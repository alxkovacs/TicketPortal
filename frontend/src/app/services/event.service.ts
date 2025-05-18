import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Event, NewEvent, TicketCategory } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /**
   * Események lekérése a szerverről
   * @param timestamp Időbélyeg a cache elkerüléséhez (opcionális)
   */
  getEvents(timestamp?: number): Observable<Event[]> {
    // Ha van timestamp paraméter, hozzáadjuk a kéréshez, hogy elkerüljük a cache-elést
    let params = new HttpParams();
    if (timestamp) {
      params = params.set('t', timestamp.toString());
    }
    
    return this.http.get<Event[]>(this.apiUrl, { params });
  }
  
  /**
   * Csak jövőbeli események lekérése
   * Adminok számára az összes esemény elérhető a getEvents metódussal
   * Ez a metódus pedig csak a jövőbeli eseményeket adja vissza
   * @param timestamp Időbélyeg a cache elkerüléséhez (opcionális)
   */
  getUpcomingEvents(timestamp?: number): Observable<Event[]> {
    return new Observable<Event[]>(observer => {
      this.getEvents(timestamp).subscribe({
        next: (events: Event[]) => {
          // Kiszűrjük a múltbeli eseményeket
          const currentDate = new Date();
          const upcomingEvents = events.filter(event => {
            // Ellenőrizzük, hogy az esemény dátuma jövőbeli-e
            return new Date(event.date) > currentDate;
          });
          
          observer.next(upcomingEvents);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  /**
   * Új esemény létrehozása
   * @param eventData Az új esemény adatai
   */
  createEvent(eventData: any): Observable<Event> {
    // Biztositsuk, hogy van legalabb egy jegykategoria
    let ticketCategories = eventData.ticketCategories || [];
    if (!Array.isArray(ticketCategories) || ticketCategories.length === 0) {
      ticketCategories = [{
        name: 'Alap jegy',
        price: 1000,
        availableSeats: 100  // Backend API az "availableSeats" nevet várja, nem "availableTickets"-et
      }];
    }
    
    // Átkonvertáljuk a meglévő jegykategoriákat a backend által várt médon
    ticketCategories = ticketCategories.map((category: any) => {
      // Clone to avoid mutating the original
      const convertedCategory = {...category};
      // Rename availableTickets to availableSeats if it exists
      if ('availableTickets' in convertedCategory) {
        convertedCategory.availableSeats = convertedCategory.availableTickets;
        delete convertedCategory.availableTickets;
      } else if (!('availableSeats' in convertedCategory)) {
        // Ha egyiket sem találjuk, adjunk hozzá alapértelmezetten 100-at
        convertedCategory.availableSeats = 100;
      }
      return convertedCategory;
    });
    
    // Számítsuk ki a teljes jegy mennyiséget
    const totalTickets = ticketCategories.reduce(
      (sum: number, category: any) => sum + (Number(category.availableSeats) || 0), 0
    );

    // Készítsünk egy típushelyes új eseményt
    const newEvent: NewEvent = {
      title: eventData.title,
      description: eventData.description,
      date: new Date(eventData.date).toISOString(),
      location: eventData.location,
      imageUrl: eventData.imageUrl || '',
      ticketCategories: ticketCategories,
      availableTickets: totalTickets
    };
    
    // Szerző hozzáadása, ha megtalálható
    try {
      // Először próbáljuk a user kulcsot
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        if (userData && userData.user && userData.user._id) {
          newEvent.organizer = userData.user._id;
        } else if (userData && userData._id) {
          newEvent.organizer = userData._id;
        }
      }
      
      // Ha nincs, próbáljuk a currentUser kulcsot
      if (!newEvent.organizer) {
        const currentUserStr = localStorage.getItem('currentUser');
        if (currentUserStr) {
          const currentUserData = JSON.parse(currentUserStr);
          if (currentUserData && currentUserData._id) {
            newEvent.organizer = currentUserData._id;
          }
        }
      }
    } catch (e) {
      console.error('Hiba a felhasználó ID kiolvasása közben:', e);
    }
    
    console.log('Küldés a szervernek:', newEvent);
    return this.http.post<Event>(this.apiUrl, newEvent);
  }

  updateEvent(id: string, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getOrganizerEvents(): Observable<Event[]> {
    // Feltételezzük, hogy environment.apiUrl már tartalmazza az /api előtagot
    return this.http.get<Event[]>(`${environment.apiUrl}/users/my-events`);
  }

  // A purchaseTicket metódus most már a TicketService-be került át
} 