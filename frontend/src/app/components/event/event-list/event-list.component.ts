import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  loading = true;
  error: string | null = null;
  
  // Frissítéshez használt időzítő
  private refreshTimer: Subscription | null = null;
  
  // isAdmin getter, ami egyszerűen meghívja az authService.isAdmin() függvényt
  get isAdmin(): boolean {
    // Direkt debug információk a hiba megoldásához
    console.log('isAdmin getter hívása, eredmény:', this.authService.isAdmin());
    return this.authService.isAdmin();
  }

  constructor(
    private eventService: EventService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Azonnal betöltjük az eseményeket
    this.loadEvents();
    
    // Beállítunk egy időzítőt, ami 10 másodpercenként frissíti az elérhető jegyek számát
    this.refreshTimer = interval(10000).subscribe(() => {
      console.log('Automatikus frissítés - adatok újratöltése a szerverről...');
      this.loadEvents(true);
    });
    
    // Feliratkozunk az authentikációs állapot változásaira, hogy frissítsük az események listáját
    this.authService.authStateChanged.pipe(
      filter(isLoggedIn => !isLoggedIn) // Csak a kijelentkezés érdekel minket
    ).subscribe(() => {
      console.log('Felhasználó kijelentkezett, események újratöltése...');
      this.loadEvents();
    });
  }
  
  ngOnDestroy(): void {
    // Feliratkozás lemondása, amikor a komponens megsemmisül
    if (this.refreshTimer) {
      this.refreshTimer.unsubscribe();
      this.refreshTimer = null;
    }
  }
  
  /**
   * Ellenőrzi, hogy a felhasználó be van-e jelentkezve
   */
  isAuthenticated(): boolean {
    try {
      const userData = localStorage.getItem('currentUser');
      return !!userData; // Ha van felhasználói adat, akkor be van jelentkezve
    } catch (error) {
      console.error('Hiba a bejelentkezési állapot ellenőrzése közben:', error);
      return false;
    }
  }

  /**
   * Ellenőrzi, hogy a bejelentkezett felhasználó rendelkezik-e admin jogosultsággal
   */
  hasAdminRole(): boolean {
    // Ahelyett, hogy megpróbálnánk sajt logikát implementni, egyszerűen használjuk az authService-t
    // Így ha a probléma jelen van, akkor csak egy helyen kell javítani
    const isAdmin = this.authService.isAdmin();
    console.log('hasAdminRole eredménye (authService.isAdmin()):', isAdmin);
    
    // Ha ez most false, akkor közvetlenül próbáljuk meg a token nélkül, a user objektum megtekintésével
    if (!isAdmin) {
      try {
        const userDataStr = localStorage.getItem('user');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          console.log('User objektum a localStorage-ból:', userData);
          if (userData && userData.role === 'admin') {
            console.log('User objektum tartalmaz admin szerepkört!');
            return true;
          }
        } else {
          console.log('Nincs user objektum a localStorage-ban');
        }
      } catch (e) {
        console.error('Hiba a user objektum feldolgozása közben:', e);
      }
    }
    
    return isAdmin;
  }

  loadEvents(silent: boolean = false): void {
    // Ha csendes módban hívják, nem mutatjuk a töltés indikátort
    if (!silent) {
      this.loading = true;
    }
    
    // Időbélyeg a cache elkerüléséhez
    const timestamp = new Date().getTime();
    
    // Admin felhasználóknak minden eseményt megjelenitünk (múltbeli eseményeket is),
    // nem admin felhasználóknak csak a jövőbeli eseményeket
    const observable = this.authService.isAdmin() ?
      this.eventService.getEvents(timestamp) :
      this.eventService.getUpcomingEvents(timestamp);
    
    observable.subscribe({
      next: (events) => {
        // Részletes log a jegyek számáról, hogy követhető legyen a frissítés
        if (events && events.length > 0) {
          events.forEach(event => {
            console.log(`Esemény: ${event.title}`);
            console.log(`  Összes elérhető jegy száma: ${event.availableTickets || 0}`);
            console.log('  Kategóriánkénti jegyek:');
            if (event.ticketCategories && event.ticketCategories.length > 0) {
              event.ticketCategories.forEach(cat => 
                console.log(`    ${cat.name}: ${cat.availableSeats} db`)
              );
            }
          });
        }
        
        // Számítsuk ki a helyesen a teljes elérhető jegyeket minden eseményhez
        this.events = events.map(event => {
          // Mindig számítsuk újra az elérhető jegyek számát a kategóriákból, hogy biztos friss adatokat mutassunk
          if (event.ticketCategories && event.ticketCategories.length > 0) {
            event.availableTickets = event.ticketCategories.reduce(
              (sum: number, cat: any) => sum + (cat.availableSeats || 0), 0
            );
          } else {
            event.availableTickets = 0;
          }
          return event;
        });
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Hiba történt az események betöltése közben.';
        this.loading = false;
        console.error('Error loading events:', err);
      }
    });
  }

  viewDetails(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  purchaseTicket(eventId: string): void {
    this.router.navigate(['/events', eventId, 'purchase']);
  }

  editEvent(eventId: string): void {
    this.router.navigate(['/events', eventId, 'edit']);
  }
  
  /**
   * Ellenőrzi, hogy egy esemény már múltbeli-e (dátuma korábbi a mai dátumnál)
   * @param event A vizsgálandó esemény objektum
   * @returns True ha az esemény múltbeli, false egyébként
   */
  isPastEvent(event: Event): boolean {
    if (!event || !event.date) return false;
    
    const eventDate = new Date(event.date);
    const currentDate = new Date();
    
    // Ha az esemény dátuma korábbi, mint a jelenlegi dátum, akkor múltbeli
    return eventDate < currentDate;
  }

  /**
   * Esemény törlése a rendszerből
   * @param eventId Az esemény azonosítója
   * @param eventTitle Az esemény címe a felhasználói megerősítés kijelzéséhez
   */
  deleteEvent(eventId: string, eventTitle: string): void {
    // Megerősítés kérése a felhasználótól
    if (confirm(`Biztosan törölni szeretnéd a(z) "${eventTitle}" eseményt? Ez a művelet nem visszavonható!`)) {
      this.loading = true;
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          // Sikeres törlés után frissítjük az eseménylistát
          this.loadEvents();
          // Felhasználói visszajelzés
          alert(`A(z) "${eventTitle}" esemény sikeresen törölve.`);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Hiba történt az esemény törlése közben.';
          console.error('Error deleting event:', err);
          // Felhasználói visszajelzés
          alert('Hiba történt az esemény törlése közben.');
        }
      });
    }
  }

  /**
   * Új esemény létrehozásához navigál az esemény űrlapra
   */
  createEvent(): void {
    // Egyszerű, közvetlen navigáció az új esemény űrlapra
    this.router.navigate(['/events/create']);
  }
} 