import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Event } from '../../models/event.model';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-form',
  template: `
    <div class="event-form">
      <h2>{{ isEditMode ? 'Edit Event' : 'Create Event' }}</h2>
      
      <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input
            type="text"
            id="title"
            formControlName="title"
            class="form-control"
          >
          <div class="error-message" *ngIf="eventForm.get('title')?.hasError('required')">
            Title is required
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            formControlName="description"
            class="form-control"
            rows="4"
          ></textarea>
          <div class="error-message" *ngIf="eventForm.get('description')?.hasError('required')">
            Description is required
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date">Date</label>
            <input
              type="datetime-local"
              id="date"
              formControlName="date"
              class="form-control"
            >
            <div class="error-message" *ngIf="eventForm.get('date')?.hasError('required')">
              Date is required
            </div>
          </div>

          <div class="form-group">
            <label for="location">Location</label>
            <input
              type="text"
              id="location"
              formControlName="location"
              class="form-control"
            >
            <div class="error-message" *ngIf="eventForm.get('location')?.hasError('required')">
              Location is required
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="price">Price</label>
            <input
              type="number"
              id="price"
              formControlName="price"
              min="0"
              step="0.01"
              class="form-control"
            >
            <div class="error-message" *ngIf="eventForm.get('price')?.hasError('required')">
              Price is required
            </div>
            <div class="error-message" *ngIf="eventForm.get('price')?.hasError('min')">
              Price must be greater than 0
            </div>
          </div>

          <div class="form-group">
            <label for="totalTickets">Total Tickets</label>
            <input
              type="number"
              id="totalTickets"
              formControlName="totalTickets"
              min="1"
              class="form-control"
            >
            <div class="error-message" *ngIf="eventForm.get('totalTickets')?.hasError('required')">
              Total tickets is required
            </div>
            <div class="error-message" *ngIf="eventForm.get('totalTickets')?.hasError('min')">
              Must have at least 1 ticket
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category">Category</label>
            <input
              type="text"
              id="category"
              formControlName="category"
              class="form-control"
            >
            <div class="error-message" *ngIf="eventForm.get('category')?.hasError('required')">
              Category is required
            </div>
          </div>

          <div class="form-group">
            <label for="organizer">Organizer</label>
            <input
              type="text"
              id="organizer"
              formControlName="organizer"
              class="form-control"
            >
            <div class="error-message" *ngIf="eventForm.get('organizer')?.hasError('required')">
              Organizer is required
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            formControlName="imageUrl"
            class="form-control"
          >
          <div class="error-message" *ngIf="eventForm.get('imageUrl')?.hasError('required')">
            Image URL is required
          </div>
          <div class="error-message" *ngIf="eventForm.get('imageUrl')?.hasError('url')">
            Please enter a valid URL
          </div>
        </div>

        <div class="form-actions">
          <button type="button" (click)="goBack()" class="btn btn-secondary">Cancel</button>
          <button type="submit" [disabled]="eventForm.invalid" class="btn btn-primary">
            {{ isEditMode ? 'Update' : 'Create' }} Event
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .event-form {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
    }
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .error-message {
      color: #f44336;
      font-size: 0.8em;
      margin-top: 5px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  event$!: Observable<Event>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      totalTickets: [1, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      organizer: ['', Validators.required],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.isEditMode = true;
      this.event$ = this.eventService.getEventById(eventId);
      this.event$.subscribe(event => {
        this.eventForm.patchValue({
          ...event,
          date: new Date(event.date).toISOString().slice(0, 16)
        });
      });
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const eventData = {
        ...this.eventForm.value,
        date: new Date(this.eventForm.value.date)
      };

      const eventId = this.route.snapshot.paramMap.get('id');
      const request$ = eventId
        ? this.eventService.updateEvent(eventId, eventData)
        : this.eventService.createEvent(eventData);

      request$.subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Error saving event:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
} 