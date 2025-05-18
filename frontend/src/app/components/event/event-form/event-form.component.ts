import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { Event, NewEvent, TicketCategory } from '../../../models/event.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId: string | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      imageUrl: [''],
      ticketCategories: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (this.eventId) {
      this.isEditMode = true;
      this.loadEvent(this.eventId);
    }
  }

  get ticketCategories(): FormArray {
    return this.eventForm.get('ticketCategories') as FormArray;
  }

  addTicketCategory(): void {
    this.ticketCategories.push(this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      availableSeats: [0, [Validators.required, Validators.min(0)]] // Backend API az "availableSeats" nevet várja
    }));
  }

  removeTicketCategory(index: number): void {
    this.ticketCategories.removeAt(index);
  }

  loadEvent(id: string): void {
    this.loading = true;
    this.eventService.getEvent(id).subscribe({
      next: (event: Event) => {
        // Dátum és időpont formátumának kezelése (datetime-local input mezőhöz)
        const eventDate = new Date(event.date);
        const dateTimeLocal = eventDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM formátum
        
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          date: dateTimeLocal, // Ide már a teljes dátum+idő kerül
          location: event.location,
          imageUrl: event.imageUrl
        });

        event.ticketCategories.forEach((category: TicketCategory) => {
          this.ticketCategories.push(this.fb.group({
            name: [category.name, Validators.required],
            price: [category.price, [Validators.required, Validators.min(0)]],
            availableSeats: [category.availableSeats, [Validators.required, Validators.min(0)]]
          }));
        });

        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Hiba történt az esemény betöltése közben.';
        this.loading = false;
        console.error('Error loading event:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Az adatok előkészítése a form-ból
    const formData = this.eventForm.value;
    
    // Biztosítsuk, hogy legyen legalább egy jegykategoria, ha nincs formában
    if (!formData.ticketCategories || formData.ticketCategories.length === 0) {
      this.addTicketCategory();
      formData.ticketCategories = [{
        name: 'Alap jegy',
        price: 1000,
        availableSeats: 100  // Backend "availableSeats" mezőnevet vár
      }];
    }
    
    // Kezeljük a hibahelyzetet, amikor a ticketCategories tömb, de üres
    if (Array.isArray(formData.ticketCategories) && formData.ticketCategories.length === 0) {
      formData.ticketCategories = [{
        name: 'Alap jegy',
        price: 1000,
        availableSeats: 100  // Backend "availableSeats" mezőnevet vár
      }];
    }
    
    // Szükéges formázások és kiegészítések
    const newEventData: NewEvent = {
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
      location: formData.location,
      imageUrl: formData.imageUrl || '',
      ticketCategories: formData.ticketCategories,
      availableTickets: this.calculateTotalAvailableTickets(formData.ticketCategories) // Ez a backend-nek kell, hogy legyen egy összes jegy szám
    };
    
    console.log('Elküldött esemény adatok:', newEventData);
    
    // Létrehozás vagy frissítés az edit mode alapján
    if (this.isEditMode && this.eventId) {
      // ID-t is megadunk az updateEvent-hez, mivel az már létező esemény (Event típus, nem NewEvent)
      const existingEvent = {
        _id: this.eventId,
        ...newEventData
      };
      this.eventService.updateEvent(this.eventId, existingEvent).subscribe({
        next: () => {
          this.router.navigate(['/events', this.eventId]);
        },
        error: (error: any) => {
          this.error = 'Hiba történt az esemény frissítése közben.';
          this.loading = false;
          console.error('Error updating event:', error);
        }
      });
    } else {
      this.eventService.createEvent(newEventData).subscribe({
        next: (event: Event) => {
          this.router.navigate(['/events', event._id]);
        },
        error: (error: any) => {
          this.error = 'Hiba történt az esemény létrehozása közben.';
          this.loading = false;
          console.error('Error creating event:', error);
          
          // Teljes hiba megjelenítése debug célból
          if (error.error) {
            console.log('Szerver hiba részletei:', JSON.stringify(error.error, null, 2));
            if (error.error.message) {
              console.log('Szerver hibaüzenet:', error.error.message);
              this.error = `Szerver hiba: ${error.error.message}`;
            }
            
            // Próbáljuk meg kinyerni az errors tömb tartalmát
            if (error.error.errors && Array.isArray(error.error.errors)) {
              console.log('Validaciós hibák:', error.error.errors);
              error.error.errors.forEach((err: any, index: number) => {
                console.log(`Hiba ${index+1}:`, err);
                if (typeof err === 'object') {
                  Object.keys(err).forEach(key => {
                    console.log(`  ${key}: ${err[key]}`);
                  });
                } else {
                  console.log(`  Üzenet: ${err}`);
                }
              });
              
              this.error = `Validaciós hibák: ${error.error.errors.map((e: any) => typeof e === 'string' ? e : JSON.stringify(e)).join(', ')}`;
            }
          }
          
          // Utolsó mentsvarként próbáljuk meg string formátumra konvertálni a JSON objektumot
          try {
            const requestBody = JSON.stringify(newEventData);
            console.log('Elküldött adatok stringként:', requestBody);
          } catch (e) {
            console.error('Hiba a JSON stringgelés során:', e);
          }
        }
      });
    }
  }
  
  /**
   * Kiszámítja az összes elérhető jegy számát az összes kategóriából
   */
  private calculateTotalAvailableTickets(categories: any[]): number {
    if (!categories || categories.length === 0) {
      return 0;
    }
    
    return categories.reduce((total, category) => {
      // Először az availableSeats mezőt keressük, ha nincs, akkor a availableTickets-et
      const seats = category.availableSeats !== undefined ? category.availableSeats : category.availableTickets;
      return total + (parseInt(seats) || 0);
    }, 0);
  }
} 