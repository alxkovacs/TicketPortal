import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventService } from '../../../services/event.service';
import { TicketService } from '../../../services/ticket.service';
import { Event, TicketCategory } from '../../../models/event.model';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ticket-purchase',
  templateUrl: './ticket-purchase.component.html',
  styleUrls: ['./ticket-purchase.component.css']
})
export class TicketPurchaseComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error: string | null = null;
  purchaseForm: FormGroup;
  selectedCategory: TicketCategory | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private ticketService: TicketService,
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.purchaseForm = this.fb.group({
      categoryId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  loadEvent(id: string): void {
    this.loading = true;
    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        this.event = event;
        
        // Diagnosztikai célból kiírjuk az összes kategóriát
        console.log('Esemény összes kategóriája:', event.ticketCategories);
        
        // Ellenőrizzük az összes kategória ID formátumát
        if (event.ticketCategories && event.ticketCategories.length > 0) {
          event.ticketCategories.forEach((cat, index) => {
            console.log(`Kategória #${index + 1}:`, {
              id: cat._id, 
              name: cat.name,
              price: cat.price,
              availableSeats: cat.availableSeats
            });
          });
        } else {
          console.warn('Nincs jegykategoria az esemenyhez!');
        }
        
        // Ellenőrizzük, hogy van-e kategória megadva a query paraméterben
        const categoryId = this.route.snapshot.queryParamMap.get('category');
        if (categoryId && event.ticketCategories.some(c => c._id === categoryId)) {
          this.purchaseForm.patchValue({ categoryId });
          this.selectedCategory = event.ticketCategories.find(c => c._id === categoryId) || null;
          console.log('Előre kiválasztott kategória:', this.selectedCategory);
        }
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Hiba történt az esemény betöltése közben.';
        this.loading = false;
        console.error('Error loading event:', err);
      }
    });
  }

  onCategoryChange(): void {
    const categoryId = this.purchaseForm.get('categoryId')?.value;
    this.selectedCategory = this.event?.ticketCategories.find(c => c._id === categoryId) || null;
    
    if (this.selectedCategory) {
      console.log('Kategória kiválasztása:', {
        categoryId: this.selectedCategory._id,
        categoryName: this.selectedCategory.name,
        price: this.selectedCategory.price,
        availableSeats: this.selectedCategory.availableSeats
      });
    }
  }

  onSubmit(): void {
    if (this.purchaseForm.invalid || !this.event) {
      return;
    }

    const { categoryId, quantity } = this.purchaseForm.value;
    this.loading = true;
    
    // Megkeressük a kiválasztott kategória nevét, mert a backend azt várja, nem az ID-t
    const selectedCategory = this.event.ticketCategories.find(cat => cat._id === categoryId);
    
    if (!selectedCategory) {
      this.error = 'Nem található a kiválasztott kategória';
      this.loading = false;
      return;
    }
    
    const categoryName = selectedCategory.name; // Ez kell a backendnek, pl. 'Álló'
    
    console.log('Jegyvásárlás indítása:', { 
      eventId: this.event._id, 
      categoryId, // Az ID amit a komponens használ
      categoryName, // Ez a név amit a backend vár
      quantity 
    });
    
    // Diagnosztikai célból kiiratjuk, mi megy ténylegesen a backend felé
    console.log('Pontos adatok a vásárláshoz:', {
      eventId: this.event._id,
      selectedCategoryName: categoryName,
      quantity: quantity
    });
    
    // A TicketService-nek átadjuk a kategória nevét, nem az ID-t,
    // mert a backend kódja a név alapján keresi meg a kategóriát:
    // const ticketCategory = event.ticketCategories.find((cat) => cat.name === category);
    this.ticketService.purchaseTicket(this.event._id, categoryName, quantity).subscribe({
      next: (response) => {
        console.log('Sikeres jegyvásárlás:', response);
        
        // Újra lekérjük az esemény adatait, hogy lássuk a frissített elérhető jegyek számát
        if (this.event) {
          this.loadEvent(this.event._id);
          
          // Késleltetjük az átirányítást, hogy legyen idő az adatok frissítésére
          setTimeout(() => {
            this.loading = false;
            this.router.navigate(['/tickets']);
          }, 1000);
        } else {
          this.loading = false;
          this.router.navigate(['/tickets']);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Hiba a jegyvásárlásnál:', err);
        
        if (err && err.error && err.error.message) {
          this.error = `Hiba: ${err.error.message}`;
        } else if (err && err.error && err.error.errors && err.error.errors.length > 0) {
          // Ha van egy konkért validciós hibaüzenet, azt jelezzük
          this.error = `Hiba: ${err.error.errors[0].msg}`;
        } else {
          this.error = 'Hiba történt a jegyvásárlás során. Kérjük próbálja újra.';
        }
      }
    });
  }
} 