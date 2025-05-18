import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Event } from '../../models/event.model';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  event$!: Observable<Event>;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.event$ = this.eventService.getEventById(eventId);
    }
  }

  backToEvents(): void {
    this.router.navigate(['/events']);
  }

  purchaseTickets(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.router.navigate(['/tickets/new'], { queryParams: { eventId } });
    }
  }
} 