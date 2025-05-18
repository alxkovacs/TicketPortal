import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  tickets$!: Observable<Ticket[]>;

  constructor(private ticketService: TicketService) { }

  ngOnInit(): void {
    this.tickets$ = this.ticketService.getTickets();
  }

  cancelTicket(id: string): void {
    this.ticketService.cancelTicket(id).subscribe({
      next: () => {
        this.tickets$ = this.ticketService.getTickets();
      },
      error: (error) => {
        console.error('Error canceling ticket:', error);
      }
    });
  }
} 