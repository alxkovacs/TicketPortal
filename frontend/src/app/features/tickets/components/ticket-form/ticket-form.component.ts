import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Event } from '../../../events/models/event.model';
import { EventService } from '../../../events/services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {
  ticketForm: FormGroup;
  events: Event[] = [];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private eventService: EventService,
    public router: Router
  ) {
    this.ticketForm = this.fb.group({
      eventId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      const { eventId, quantity } = this.ticketForm.value;
      this.ticketService.createTicket(eventId, quantity).subscribe({
        next: () => {
          this.router.navigate(['/tickets']);
        },
        error: (error) => {
          console.error('Error creating ticket:', error);
        }
      });
    }
  }
} 