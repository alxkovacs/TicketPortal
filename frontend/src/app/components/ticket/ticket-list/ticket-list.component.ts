import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TicketService } from 'src/app/services/ticket.service';
import { EventService } from 'src/app/services/event.service';
import { Ticket } from 'src/app/models/ticket.model';
import { Event } from 'src/app/models/event.model';

interface CategoryPriceMap {
  [eventId: string]: {
    [categoryName: string]: number
  }
}

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  activeTickets: Ticket[] = [];
  cancelledTickets: Ticket[] = [];
  showCancelledTickets = false;
  loading = false;
  error: string | null = null;
  
  // Események jegykategória árainak cache-elése
  events: Event[] = [];
  categoryPrices: CategoryPriceMap = {};

  constructor(
    private ticketService: TicketService,
    private eventService: EventService
  ) {}
  
  /**
   * Segédmetódus a kategórianevének meghatározására. A template-ben használjuk
   * a typeof operátor használata helyett.
   */
  getCategoryName(ticket: Ticket): string {
    if (ticket.category && typeof ticket.category === 'object') {
      const categoryObj = ticket.category as any;
      return categoryObj.name || 'Ismeretlen kategória';
    }
    // Ha a category egy string
    return typeof ticket.category === 'string' ? ticket.category : 'Ismeretlen kategória';
  }

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.error = null;

    // Első lépésben betöltjük az összes eseményt az árak miatt
    this.eventService.getEvents().subscribe({
      next: (events) => {
        // Eltároljuk az összes eseményt
        this.events = events;
        
        // Felkonstruljuk a kategória ár térképet az eseményekből
        this.events.forEach(event => {
          if (!this.categoryPrices[event._id]) {
            this.categoryPrices[event._id] = {};
          }
          
          // Minden kategória árát eltároljuk az eseményhez
          event.ticketCategories.forEach(category => {
            this.categoryPrices[event._id][category.name] = category.price;
            console.log(`Árakat cache-elünk: ${event.title}, ${category.name}: ${category.price} Ft`);
          });
        });

        // Második lépésben betöltjük a felhasználó jegyeit
        this.ticketService.getUserTickets().subscribe({
          next: (tickets) => {
            this.tickets = tickets;
            
            // Jegyek szétválogatása aktív és lemondott kategóriákba
            // Az adatbázisból látszik, hogy a ticketek 'confirmed' vagy 'cancelled' státusszal rendelkeznek
            this.activeTickets = tickets.filter(ticket => ticket.status === 'confirmed');
            this.cancelledTickets = tickets.filter(ticket => ticket.status === 'cancelled');
            
            this.loading = false;
            console.log('Aktív jegyek:', this.activeTickets.length);
            console.log('Lemondott jegyek:', this.cancelledTickets.length);
    
            // Debug: minden jegy adatainak kilistázása
            tickets.forEach((ticket, index) => {
              // Csak a most érkezett jegyek adataival dolgozunk
              const status = ticket.status === 'confirmed' ? 'confirmed' : 'cancelled';
              const kategoriaType = typeof ticket.category;
              console.log(`Jegy #${index + 1}:`, { 
                id: ticket._id, 
                státusz: status, 
                esemény: ticket.event.title,
                kategória: ticket.category,
                kategóriaTípus: kategoriaType,
                dátum: ticket.purchaseDate
              });
            });
          },
          error: (error) => {
            this.loading = false;
            this.error = 'Nem sikerült betölteni a jegyeket. Kérlek próbáld újra később.';
            console.error('Hiba a jegyek betöltése közben:', error);
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Nem sikerült betölteni az eseményeket.';
        console.error('Hiba az események betöltése közben:', error);
      }
    });
  }
  
  /**
   * Jegy státusz kapcsoló
   */
  toggleCancelledTickets(): void {
    this.showCancelledTickets = !this.showCancelledTickets;
  }
  
  /**
   * Jegy árának meghatározása
   * Mivel a backend csak string-et küld a kategóriára (nem objektumot), 
   * ezért itt határozzuk meg az árat a kategória nevéből
   */
  /**
   * Kiszámolja a jegy árát a backend adatok alapján,
   * először az előre betöltött esemény kategóriákból keresve.
   */
  getTicketPrice(ticket: Ticket): number {
    // Ha nincs esemény vagy kategoria a jegyhez
    if (!ticket.event || !ticket.category) {
      console.log('Nincs esemény vagy kategoria információ a jegyhez');
      return 0;
    }

    // 1. Lépés: Szerezzünk kategórianevet
    const categoryName = this.getCategoryName(ticket);
    const eventId = ticket.event._id;

    // 2. Lépés: Keressük meg az árat az előre betöltött ár táblázatban
    if (this.categoryPrices[eventId] && this.categoryPrices[eventId][categoryName]) {
      const price = this.categoryPrices[eventId][categoryName];
      console.log(`Talált ár az események között: ${price} Ft (${categoryName})`);
      return price;
    }

    // 3. Lépés: Próbáljuk megtalálni az eseményt az előre betöltöttek között
    const foundEvent = this.events.find(e => e._id === eventId);
    if (foundEvent) {
      // Keressük a megfelelő kategóriát
      const foundCategory = foundEvent.ticketCategories.find(c => c.name === categoryName);
      if (foundCategory) {
        console.log(`Talált ár az esemény kategóriában: ${foundCategory.price} Ft`);
        
        // Cache-eljük ezt az értéket a későbbi gyorsabb eléréshez
        if (!this.categoryPrices[eventId]) {
          this.categoryPrices[eventId] = {};
        }
        this.categoryPrices[eventId][categoryName] = foundCategory.price;
        
        return foundCategory.price;
      }
    }

    // 4. Lépés: Próbáljuk a jegy objektumból kiszedni
    if (typeof ticket.category === 'object') {
      const categoryObj = ticket.category as any;
      if (typeof categoryObj.price === 'number') {
        console.log(`Talált ár a jegy objektumból: ${categoryObj.price} Ft`);
        return categoryObj.price;
      }
    }

    // 5. Lépés: Ha nem találtunk árat, logoljuk a hibát
    console.warn(`Nem sikerült árat meghatározni a jegyhez. Esemény: ${ticket.event.title}, Kategória: ${categoryName}`);
    console.log('Jegy objektum:', ticket);
    
    // Visszatérünk 0-val, ha nincs ár
    return 0;
  }

  cancelTicket(ticketId: string): void {
    if (confirm('Biztosan lemondod ezt a jegyet?')) {
      this.ticketService.cancelTicket(ticketId).subscribe({
        next: () => {
          this.loadTickets();
        },
        error: (err: any) => {
          this.error = 'Hiba történt a jegy lemondása közben. Kérjük próbálja újra később.';
          console.error('Hiba a jegy lemondása közben:', err);
        }
      });
    }
  }
} 