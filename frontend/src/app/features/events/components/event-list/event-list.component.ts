import { Component, OnInit } from '@angular/core';
import { Event } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = true;

  constructor(
    private eventService: EventService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  viewEvent(id: string): void {
    this.router.navigate(['/events', id]);
  }

  buyTickets(eventId: string): void {
    this.router.navigate(['/tickets/new'], { queryParams: { eventId } });
  }
} 