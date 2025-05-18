import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { TicketService } from '../../../services/ticket.service';
import { AuthService } from '../../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Event } from '../../../models/event.model';
import { Ticket } from '../../../models/ticket.model';
import { interval, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  tickets: Ticket[] = [];
  loading = true;
  error: string | null = null;
  
  // Statisztikai adatok
  totalEvents = 0;
  totalTickets = 0;
  totalSales = 0;
  totalActiveTickets = 0;
  totalCancelledTickets = 0;
  eventsByMonth: any[] = [];
  ticketsByCategory: any[] = [];
  
  // Hónapi események száma
  monthlyEventCounts: number[] = [];
  
  // Jegy kategóriák és statisztikák
  ticketCategories: { name: string, count: number, revenue: number }[] = [];
  
  // Automatikus frissítés és útvonal figyelelés
  private refreshSubscription: Subscription | null = null;
  private routerSubscription: Subscription | null = null;
  private lastTicketCount = 0; // Utóbbi jegyszám összehasonlításhoz
  
  constructor(
    private eventService: EventService,
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/events']);
      return;
    }
    
    // Induló adatbetöltés mindig friss adatokkal
    this.loadDashboardData();
    
    // Figyeljuk a navigációt, és újratöltjük az adatokat, amikor visszatérünk a dashboard oldalra
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/admin/dashboard') {
        console.log(`[${new Date().toLocaleTimeString()}] Navigáció a dashboard oldalra, adatok frissítése...`);
        this.loadDashboardData();
      }
    });
    
    // Sokkal ritkább automatikus frissítés, hogy ne zavarjuk a navigációt
    // 10 másodperc elegendő lesz, csak akkor frissítünk gyakrabban, ha konkrét művelet történt
    this.refreshSubscription = interval(10000).subscribe(() => {
      console.log(`[${new Date().toLocaleTimeString()}] Időszakos adatfrissítés a dashboardon...`);
      // Csak a jegyadatokat frissítjük, hogy ne akadályozzuk a navigációt
      this.loadTicketData();
    });
    
    // Kezdeti adatbetöltés után részletes debug infó
    setTimeout(() => {
      console.log(`[${new Date().toLocaleTimeString()}] DEBUG - Autentikációs token:`, localStorage.getItem('token') ? 'Token megtalálható' : 'Nincs token!');
      console.log(`[${new Date().toLocaleTimeString()}] DEBUG - User objektum:`, this.authService.getCurrentUser());
      console.log(`[${new Date().toLocaleTimeString()}] DEBUG - Admin jogosultság:`, this.authService.isAdmin());
    }, 1000);
    
    // Figyelés a jegyvásárlási eseményekre is, hogy azonnal frissülön az adat
    // Ez egy subscribe az Angular route events-re, ami a jegyvásárlás után történik
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: any) => {
        // Jegyvásárlás vagy jegy kezelés után frissítsünk
        const purchaseUrl = event.url.includes('/purchase');
        const ticketsUrl = event.url.includes('/tickets');
        const returningToDashboard = event.url.includes('/admin/dashboard');
        return purchaseUrl || ticketsUrl || returningToDashboard;
      })
    ).subscribe(() => {
      console.log(`[${new Date().toLocaleTimeString()}] Jegyvásárlás vagy jegy művelet utáni frissítés...`);
      // Azonnali frissítés jegyvásárlás után
      this.loadDashboardData();
    });
  }
  
  /**
   * Komponens megsemmisítésekor leiratkozunk az aktív feliratkozásokról
   */
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
    
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.routerSubscription = null;
    }
  }
  
  loadDashboardData(): void {
    this.loading = true;
    
    console.log(`[${new Date().toLocaleTimeString()}] Dashboard adatok betöltése kezdődik (csak jövőbeli események)...`);
    
    // Csak jövőbeli események betöltése
    this.eventService.getUpcomingEvents().subscribe({
      next: (events) => {
        console.log(`[${new Date().toLocaleTimeString()}] Események sikeresen betöltve:`, events.length);
        this.events = events;
        this.totalEvents = events.length;
        this.calculateEventsByMonth();
        
        // Jegyinformációk betöltése
        this.loadTicketData();
      },
      error: (err) => {
        this.error = 'Hiba történt az események betöltése közben.';
        this.loading = false;
        console.error(`[${new Date().toLocaleTimeString()}] HIBA - Események betöltése sikertelen:`, err);
        console.error(`[${new Date().toLocaleTimeString()}] Státuszkód:`, err.status, 'Üzenet:', err.message);
      }
    });
  }
  
  // Ismert jegykatégóriák és áraik, a felhasználó által megadott információk alapján
  private knownTickets: { category: string, price: number }[] = [
    { category: 'Álló', price: 10000 },
    { category: 'Terasz', price: 25000 }
  ];
  
  loadTicketData(): void {
    // Jelezzük a konzolra, hogy honnan indult a jegyadatok betöltése
    console.log(`[${new Date().toLocaleTimeString()}] Jegyadatok frissítése az adatbázisból...`);
    console.log(`[${new Date().toLocaleTimeString()}] Konzol trace jegyadat betöltéshez:`, new Error().stack);
    
    // Jegyek betöltése force refresh = true paraméterrel, hogy friss adatokat kapjunk
    // a készpénzes forgalomszámlálóhoz és más dashboard statisztikákhoz
    this.ticketService.getAllTickets(true).subscribe({
      next: (tickets: Ticket[]) => {
        console.log(`[${new Date().toLocaleTimeString()}] BETÖLTÖTT JEGYEK:`, tickets);
        console.log(`[${new Date().toLocaleTimeString()}] Jegyek száma: ${tickets ? tickets.length : 'nincs adat'}`); 
        
        // Eltároljuk az előző jegyszámot, hogy lássuk, változott-e
        const previousTicketCount = this.totalActiveTickets;
        
        // Ellenőrizzük, hogy a tickets tényleg egy tömb és nem null/undefined
        if (!tickets) {
          console.error(`[${new Date().toLocaleTimeString()}] HIBA - A tickets nincs definiálva vagy null!`);
          this.tickets = [];
          this.loading = false;
          return;
        }
        
        this.tickets = tickets;
        this.totalTickets = tickets.length;
        this.totalActiveTickets = tickets.filter(t => t.status !== 'cancelled').length;
        this.totalCancelledTickets = tickets.filter(t => t.status === 'cancelled').length;

        console.log(`[${new Date().toLocaleTimeString()}] Debug - Jegy statisztikák:`);  
        console.log(`- Összes jegy: ${this.totalTickets}`);  
        console.log(`- Aktív jegyek: ${this.totalActiveTickets}`);  
        console.log(`- Lemondott jegyek: ${this.totalCancelledTickets}`); 

        // Összes bevétel számítása - aktív jegyekre
        this.totalSales = this.tickets
          .filter(t => t.status !== 'cancelled') // Csak aktív jegyeket számolunk
          .reduce((sum: number, ticket: Ticket) => {
            let price = 0;
            if (ticket.price !== undefined && ticket.price !== null) {
              price = ticket.price;
            }
            return sum + price;
          }, 0);
        
        console.log(`[${new Date().toLocaleTimeString()}] Összes bevétel: ${this.totalSales} Ft`);
        
        // Frissítjük a kategória statisztikákat is
        this.calculateTicketsByCategory();
        
        this.loading = false;
        this.error = null; // Töröljük a hibát, ha sikeres a betöltés
        
        // Ellenőrizzük és naplózzuk, ha változott a jegyek száma
        if (previousTicketCount !== this.totalActiveTickets) {
          console.log(`[${new Date().toLocaleTimeString()}] Jegyek száma változott: ${previousTicketCount} -> ${this.totalActiveTickets}`);
          
          // Jegykimutatás részletezése
          console.log(`[${new Date().toLocaleTimeString()}] Jegyek kategóriák szerinti megoszlása:`);
          this.ticketCategories.forEach(cat => {
            console.log(`- ${cat.name}: ${cat.count} db, ${cat.revenue} Ft bevétel`);
          });
        }
      },
      error: (err: any) => {
        this.error = 'Hiba történt a jegyek betöltése közben.';
        this.loading = false;
        console.error(`[${new Date().toLocaleTimeString()}] !!! SÚLYOS HIBA !!! - Jegyadatok betöltése sikertelen:`, err);
        console.error(`[${new Date().toLocaleTimeString()}] Státuszkód:`, err.status, 'Üzenet:', err.message);
        
        if (err.status === 401 || err.status === 403) {
          console.error(`[${new Date().toLocaleTimeString()}] Autentikációs HIBA - Ellenőrizd a bejelentkezést!`);
          console.log(`[${new Date().toLocaleTimeString()}] JWT Token:`, localStorage.getItem('token') ? 'Létezik' : 'Hiányzik');
        }
      }
    });
  }
  
  /**
   * Események havi eloszlásának számítása
   */
  calculateEventsByMonth(): void {
    // Minden hónapra 0 kezdésben
    this.monthlyEventCounts = Array(12).fill(0);
    
    // Tényleges adatok alapján számolás
    if (this.events && this.events.length > 0) {
      this.events.forEach(event => {
        if (event.date) {
          const month = new Date(event.date).getMonth();
          this.monthlyEventCounts[month]++;
        }
      });
      
      console.log(`[${new Date().toLocaleTimeString()}] Események havi eloszlása frissítve:`, 
        this.monthlyEventCounts.map((count, idx) => `${idx+1}. hónap: ${count}`).join(', '));
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] Nincs eseményadat a havi eloszlás számításához`);
    }
  }
  
  /**
   * Jegyek kategóriánkénti eloszlásának számítása
   * Minden különböző jegy kategóriához kiszámolja a jegyek számát és összbevételt
   */
  calculateTicketsByCategory(): void {
    // Jegyek és bevételek kategóriánként
    const categoryData = new Map<string, { count: number, revenue: number }>();
    
    // Létrehozunk előre néhány ismert kategóriát nulladattal, hogy mindig látszódjanak
    // még ha nincs is belőlük jegy
    const knownCategories = ['Álló', 'Terasz', 'VIP'];
    knownCategories.forEach(cat => {
      if (!categoryData.has(cat)) {
        categoryData.set(cat, { count: 0, revenue: 0 });
      }
    });
    
    // A tényleges jegyadatokból számolunk
    this.tickets.forEach((ticket: Ticket) => {
      // Ha nincs kategória, "Ismeretlen" kategóriába soroljuk
      const category = ticket.category || 'Ismeretlen';
      
      if (ticket.status !== 'cancelled') {
        const categoryInfo = categoryData.get(category) || { count: 0, revenue: 0 };
        categoryInfo.count += 1;
        
        // Biztonságos ár konverzió
        let ticketPrice = 0;
        if (ticket.price !== undefined && ticket.price !== null) {
          ticketPrice = typeof ticket.price === 'number' ? ticket.price : 0;
        }
        
        categoryInfo.revenue += ticketPrice;
        categoryData.set(category, categoryInfo);
      }
    });
    
    // Rendezett listát készítünk a kategóriákból
    this.ticketCategories = Array.from(categoryData.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: data.revenue
      }))
      // Rendezzük csökkenő sorrend szerint a jegyek száma alapján
      .sort((a, b) => b.count - a.count);
      
    console.log(`[${new Date().toLocaleTimeString()}] Kategória statisztikák frissítve:`, 
      this.ticketCategories.map(cat => `${cat.name}:${cat.count}`).join(', '));
  }
  
  /**
   * Adott hónapban lévő események száma
   */
  getEventCountByMonth(monthIndex: number): number {
    return this.monthlyEventCounts[monthIndex] || 0;
  }
  
  /**
   * Jegy kategóriák listájának lekérése
   */
  getTicketCategories(): { name: string, count: number, revenue: number }[] {
    return this.ticketCategories;
  }
  
  /**
   * Dátum formázása
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }
  
  /**
   * Navigáció az események oldalra
   */
  navigateToEvents(): void {
    this.router.navigate(['/events']);
  }
  
  /**
   * Esemény szerkesztése
   */
  editEvent(eventId: string): void {
    this.router.navigate(['/events', eventId, 'edit']);
  }
  
  /**
   * Esemény megtekintése
   */
  viewEvent(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }
  
  /**
   * Kiszámolja egy eseményhez elérhető összes jegy számát
   * @param event Az esemény, amihez az elérhető jegyeket számoljuk
   * @returns Az elérhető jegyek száma
   */
  getAvailableTickets(event: Event): number {
    if (!event || !event.ticketCategories) return 0;
    
    // Összegezzük a kategóriánként elérhető helyeket
    return event.ticketCategories.reduce((sum, category) => {
      return sum + (category.availableSeats || 0);
    }, 0);
  }
}
