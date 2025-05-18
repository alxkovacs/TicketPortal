import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';
import { AuthService } from '../../../services/auth.service';
import { User } from '@app/models/user.model';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error: string | null = null;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(eventId);
    }
    this.currentUser = this.authService.getCurrentUser();
  }

  loadEvent(id: string): void {
    this.loading = true;
    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        // Debug információk
        console.log('Részletes esemény adatok:', event);
        console.log('Elérhető jegyek értéke:', event.availableTickets);
        
        // Ha az availableTickets értéke nem létezik, számítsuk ki a kategóriákból
        if (event.availableTickets === undefined || event.availableTickets === null) {
          if (event.ticketCategories && event.ticketCategories.length > 0) {
            // Összesítsük a kategóriákban lévő elérhető helyeket
            event.availableTickets = event.ticketCategories.reduce(
              (sum, cat) => sum + (cat.availableSeats || 0), 0
            );
          } else {
            event.availableTickets = 0;
          }
        }
        
        this.event = event;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Hiba történt az esemény betöltése közben.';
        this.loading = false;
        console.error('Error loading event:', err);
      }
    });
  }

  purchaseTicket(categoryId: string): void {
    if (this.event) {
      this.router.navigate(['/events', this.event._id, 'purchase'], {
        queryParams: { category: categoryId }
      });
    }
  }

  editEvent(): void {
    if (this.event) {
      this.router.navigate(['/events', this.event._id, 'edit']);
    }
  }
  
  /**
   * Kategória paraméter nélkül navigál a jegyvásárlás oldalra
   */
  navigateToPurchase(): void {
    if (this.event) {
      this.router.navigate(['/events', this.event._id, 'purchase']);
    }
  }
} 