import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-detail',
  template: `
    <div class="ticket-detail" *ngIf="ticket$ | async as ticket">
      <div class="ticket-header">
        <h2>{{ ticket.event.title }}</h2>
        <span class="ticket-status" [ngClass]="ticket.status">{{ ticket.status }}</span>
      </div>
      
      <div class="ticket-info">
        <div class="info-section">
          <h3>Event Details</h3>
          <p><strong>Date:</strong> {{ ticket.event.date | date }}</p>
          <p><strong>Location:</strong> {{ ticket.event.location }}</p>
          <p><strong>Description:</strong> {{ ticket.event.description }}</p>
        </div>

        <div class="info-section">
          <h3>Ticket Details</h3>
          <p><strong>Ticket ID:</strong> {{ ticket.id }}</p>
          <p><strong>Quantity:</strong> {{ ticket.quantity }}</p>
          <p><strong>Price per Ticket:</strong> {{ ticket.price | currency }}</p>
          <p><strong>Total Price:</strong> {{ ticket.price * ticket.quantity | currency }}</p>
          <p><strong>Purchase Date:</strong> {{ ticket.purchaseDate | date }}</p>
        </div>
      </div>

      <div class="ticket-actions" *ngIf="ticket.status === 'active'">
        <button (click)="cancelTicket(ticket.id)" class="btn btn-danger">Cancel Ticket</button>
      </div>
    </div>
  `,
  styles: [`
    .ticket-detail {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .ticket-status {
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .ticket-status.active {
      background-color: #4CAF50;
      color: white;
    }
    .ticket-status.cancelled {
      background-color: #f44336;
      color: white;
    }
    .ticket-status.refunded {
      background-color: #2196F3;
      color: white;
    }
    .ticket-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    .info-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .info-section h3 {
      margin-top: 0;
      margin-bottom: 15px;
      color: #333;
    }
    .ticket-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  `]
})
export class TicketDetailComponent implements OnInit {
  ticket$!: Observable<Ticket>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    const ticketId = this.route.snapshot.paramMap.get('id');
    if (ticketId) {
      this.ticket$ = this.ticketService.getTicketById(ticketId);
    }
  }

  cancelTicket(ticketId: string): void {
    this.ticketService.cancelTicket(ticketId).subscribe({
      next: () => {
        this.router.navigate(['/tickets']);
      },
      error: (error) => {
        console.error('Error cancelling ticket:', error);
      }
    });
  }
} 