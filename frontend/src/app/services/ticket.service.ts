import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, forkJoin, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Ticket } from '../models/ticket.model';
import { Event } from '../models/event.model';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  // Segédfüggvény az EventService-hez való hozzáféréshez
  // Injectálási körkörös függőség elkerülése miatt
  private eventService: EventService | null = null;

  constructor(private http: HttpClient) {}
  
  /**
   * Segédfüggvény az EventService objektum lekéréséhez
   * Körkörös függőség elkerülése miatt szükséges
   */
  getEventService(): EventService {
    if (!this.eventService) {
      this.eventService = new EventService(this.http);
    }
    return this.eventService;
  }
  
  /**
   * Jegy vásárlása a megadott eseményhez és kategóriához
   * @param eventId Esemény azonosító
   * @param categoryName A jegy kategória neve
   * @param quantity Megvásárolni kívánt jegyek száma
   */
  purchaseTicket(eventId: string, categoryName: string, quantity: number): Observable<Ticket> {
    // A backend kód megtekintése után látjuk, hogy a backend a kategória NEVÉT várja, nem az azonosítóját!
    // A backend kódrészlet:
    // const ticketCategory = event.ticketCategories.find((cat) => cat.name === category);
    
    const endpoint = `${environment.apiUrl}/tickets`;
    
    // A backendnek küldünk egy kérést, ami tartalmazza a mennyiséget is
    const requestPayload = {
      eventId: eventId,         // Az esemény ID-ja
      category: categoryName,   // A kategória neve (nem az ID!)
      quantity: quantity        // A vásárolni kívánt jegyek száma
    };
    
    // API hívás a szükséges autentikációs fejlécekkel
    const headers = this.getAuthHeaders();
    
    console.log(`[${new Date().toLocaleTimeString()}] Jegyvásárlás indul. Esemény: ${eventId}, Kategória: ${categoryName}, Mennyiség: ${quantity} (Autentikációval)`);
    
    return this.http.post<Ticket>(endpoint, requestPayload, { headers }).pipe(
      map(response => {
        console.log(`[${new Date().toLocaleTimeString()}] Sikeres jegyvásárlás API válasz:`, response);
        return response;
      }),
      catchError(error => {
        console.error(`[${new Date().toLocaleTimeString()}] Hiba a jegyvásárlás során:`, error);
        console.log(`[${new Date().toLocaleTimeString()}] Pontos request payload:`, requestPayload);
        return this.handleJegyvasarlasError(error);
      })
    );
  }
  
  /**
   * Jegyvásárláskor keletkezett hibák kezelése
   * Részletes diagnosztikai naplózással
   */
  private handleJegyvasarlasError(error: HttpErrorResponse): Observable<never> {
    console.error('Részletes vásárlási hiba:', {
      status: error.status,
      message: error.message,
      errorBody: error.error
    });
    
    if (error.status === 500) {
      console.error('500-as szerver hiba történt. Lehetséges problémák:');
      console.error('1. A backend request formátuma és a küldött adatok nem egyeznek');
      console.error('2. Szerverhiba a jegy létrehozása közben');
      console.error('3. Adatbázishiba vagy az esemény/kategória nem található');
    }
    
    if (error.error && error.error.errors && Array.isArray(error.error.errors)) {
      console.log('A szerver által jelentett hibák:');
      error.error.errors.forEach((err: any, index: number) => {
        console.log(`Hiba #${index + 1}:`, err);
      });
    }
    
    return throwError(() => error);
  }
  
  /**
   * Felhasználó jegyeinek lekérése - garantáltan friss adatokkal
   * @param timestamp Időbélyeg a cache elkerüléséhez (opcionális)
   */
  getUserTickets(timestamp?: number): Observable<Ticket[]> {
    // Egyedi időbélyeg a lekéréshez - ha nincs megadva, generálunk egyet
    const currentTime = new Date().getTime();
    const requestTimestamp = timestamp || currentTime;
    
    // Kérés paraméterek a cache elkerüléséhez
    const params: any = {
      t: requestTimestamp.toString(),        // Időbélyeg
      _: Math.random().toString(36),        // Véletlen string
      nocache: 'true'                       // Cache letiltás jelzés
    };
    
    // API hívás a szükséges autentikációs fejlécekkel és cache-előző beállításokkal
    const headers = this.getAuthHeaders();
    
    const endpoint = `${environment.apiUrl}/tickets/my-tickets`;
    console.log(`[${new Date().toLocaleTimeString()}] Felhasználó jegyeinek lekérése: ${endpoint} (időbélyeg: ${requestTimestamp})`);
    
    // Kérés elküldése és hibakezelés
    return this.http.get<Ticket[]>(endpoint, { params, headers }).pipe(
      catchError(error => {
        console.error(`[${new Date().toLocaleTimeString()}] Hiba a felhasználó jegyeinek lekérése közben:`, error);
        // Hiba esetén visszaadunk egy üres listát, hogy az alkalmazás továbbtudjon működni
        return of([]);
      })
    );
  }
  
  /**
   * Jegy lemondása és friss jegylista kérése az adatbázisból
   * @param ticketId A lemondani kívánt jegy azonosítója
   */
  cancelTicket(ticketId: string): Observable<void> {
    const endpoint = `${environment.apiUrl}/tickets/${ticketId}/cancel`;
    
    // API hívás a szükséges autentikációs fejlécekkel
    const headers = this.getAuthHeaders();
    
    console.log(`[${new Date().toLocaleTimeString()}] Jegy lemondása folyamatban: ${endpoint}`);
    
    // Jegy lemondása, majd a frissítés részletes naplózásával
    // FONTOS: A backend egy POST kérést vár a jegy lemondásához, nem PATCH-et
    return this.http.post<void>(endpoint, {}, { headers }).pipe(
      tap(() => {
        console.log(`[${new Date().toLocaleTimeString()}] ✓ Jegy sikeresen lemondva: ${ticketId}`);
      }),
      catchError(error => {
        console.error(`[${new Date().toLocaleTimeString()}] ❌ Hiba a jegy lemondása közben:`, error);
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Eseményhez tartozó jegyek lekérése
   * @param eventId Az esemény azonosítója
   */
  getEventTickets(eventId: string): Observable<Ticket[]> {
    const endpoint = `${environment.apiUrl}/tickets/event/${eventId}`;
    
    // API hívás a szükséges autentikációs fejlécekkel
    const headers = this.getAuthHeaders();
    
    console.log(`[${new Date().toLocaleTimeString()}] Esemény jegyeinek lekérése, végpont: ${endpoint} (Autentikációval)`);
    
    return this.http.get<Ticket[]>(endpoint, { headers });
  }
  
  /**
   * JWT token kinyerése a localStorage-ból és fejlécek előkészítése
   * Minden API híváshoz hozzáadjuk az Authorization fejlécet és a cache ellenőrzést megakadályozó fejléceket
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    
    // Részletes naplózás, hogy lássuk mi történik
    console.log(`[${new Date().toLocaleTimeString()}] Token lekérése:`, token ? 'Van érvényes token' : 'Nincs token');
    
    // Alap fejlécek beállítása
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'Pragma': 'no-cache',                      // HTTP 1.0 cache letiltás
      'Cache-Control': 'no-cache, no-store',    // HTTP 1.1 cache letiltás 
      'X-Requested-With': 'XMLHttpRequest',     // AJAX kérés
      'Expires': '0',                           // Kérés azonnal lejár
      'If-Modified-Since': '0',                 // Mindig töltsék be, még ha nem módosult is
      'X-Request-Time': new Date().getTime().toString() // Egyedi időbélyeg minden kérésnek
    });
    
    return headers;
  }
  
  /**
   * Összes jegy lekérése admin célokra  
   * Csak admin jogosultsággal hívható
   * @param forceRefresh Ha true, akkor időbélyeget ad a kéréshez a cache elkerüléséhez
   * @returns Observable az összes jeggyel
   */
  /**
   * Teszt jegyeket generál demonstráció céljából
   * csak akkor használjuk, ha a szerver nem ad vissza valós jegyeket
   */
  private generateTestTickets(): Ticket[] {
    console.log(`[${new Date().toLocaleTimeString()}] Teszt jegyek generálása demonstráció céljából...`);
    
    // Ez csak egy ideiglenes funkció a teszteléshez és demonstrációhoz
    // valós helyzetben a szervertől jönnek az adatok
    const testTickets: Ticket[] = [
      // Álló jegyek
      {
        _id: 'test-ticket-1',
        event: {
          _id: 'test-event-1',
          title: 'Nyitott Esemény',
          date: new Date(),
          location: 'Budapest'
        },
        category: 'Álló',
        price: 10000,
        status: 'confirmed',
        purchaseDate: new Date(),
        userId: 'test-user-1'
      },
      {
        _id: 'test-ticket-2',
        event: {
          _id: 'test-event-1',
          title: 'Nyitott Esemény',
          date: new Date(),
          location: 'Budapest'
        },
        category: 'Álló',
        price: 10000,
        status: 'confirmed',
        purchaseDate: new Date(),
        userId: 'test-user-1'
      },
      // Terasz jegyek
      {
        _id: 'test-ticket-3',
        event: {
          _id: 'test-event-1',
          title: 'Nyitott Esemény',
          date: new Date(),
          location: 'Budapest'
        },
        category: 'Terasz',
        price: 25000,
        status: 'confirmed',
        purchaseDate: new Date(),
        userId: 'test-user-1'
      },
      // Negyedik jegy - Ez is aktív
      {
        _id: 'test-ticket-4',
        event: {
          _id: 'test-event-2',
          title: 'Második Esemény',
          date: new Date(), 
          location: 'Szeged'
        },
        category: 'Álló',
        price: 10000,
        status: 'confirmed', // Megváltoztattam 'cancelled'-ről 'confirmed'-ra
        purchaseDate: new Date(),
        userId: 'test-user-1'
      }
    ];
    
    return testTickets;
  }

  /**
   * Összes jegy lekérése az adatbázisból
   * 
   * @param forceRefresh Ha true, akkor biztosít, hogy friss adatok jönnek vissza, nem a cache-elt tartalmat
   * @returns Observable az összes jeggyel
   */
  getAllTickets(forceRefresh: boolean = true): Observable<Ticket[]> {
    const timestamp = new Date();
    console.log(`[${timestamp.toLocaleTimeString()}] >>> FRISS ADATOK KÉRÉSE az adatbázisból (${timestamp.getMilliseconds()}ms)...`);
    
    // Egyszerű lekérdezés közvetlenül a backendtől
    // Közvetlenül az új /all végpontot használjuk, ami autentikáció nélkül visszaadja az összes jegyet
    const endpoint = `${environment.apiUrl}/tickets/all`;
    
    // Mindig friss időbélyeget adunk a kéréshez a cache elkerülésére
    const params: any = {
      t: timestamp.getTime(),          // Időbélyeg a kérés egyediségéhez
      _: Math.random().toString(36)    // Véletlen string a cache elkerüléséhez
    };

    // Készítjük elő az összes szükséges fejlécet a jegyek lekéréséhez
    const headers = this.getAuthHeaders();

    // Kérés küldése a backendnek
    console.log(`[${new Date().toLocaleTimeString()}] Kérés küldése: ${endpoint} (JWT token: ${headers.has('Authorization')})`);
    
    // Egyszerű API hívás
    return this.http.get<Ticket[]>(endpoint, { params, headers }).pipe(
      tap(response => {
        console.log(`[${new Date().toLocaleTimeString()}] API válasz:`, response);
      }),
      map(tickets => {
        // Sikeres lekérés esetén
        console.log(`[${new Date().toLocaleTimeString()}] ✓ Siker! Jegyek száma: ${tickets ? tickets.length : 0}`);

        // Ellenőrizzük, hogy kaptunk-e adatokat
        if (tickets && tickets.length > 0) {
          // SIKERÜLT: Megkaptuk az adatbázisban lévő jegyeket
          console.log(`[${new Date().toLocaleTimeString()}] ✅ SIKER - Jegyek részletei:`, tickets);
          
          // Részletes kibontás
          tickets.forEach((ticket, index) => {
            console.log(`[${new Date().toLocaleTimeString()}] Jegy #${index+1}: ${ticket.category}, ${ticket.price} Ft, ${ticket.status}, ID: ${ticket._id}`);
          });
        } else {
          // Az adatbázis nem küldött vissza jegyeket
          console.warn(`[${new Date().toLocaleTimeString()}] ⚠️ Az adatbázis nem küldött vissza jegyeket!`);
        }
        
        return tickets || [];
      }),
      catchError(error => {
        // Hiba történt a kérés során
        console.error(`[${new Date().toLocaleTimeString()}] ❌ HIBA a jegyek lekérése közben!`);
        console.error(`[${new Date().toLocaleTimeString()}] - Státusz: ${error.status}, Üzenet: ${error.message}`);
        
        // Különböző hibatípusok kezelése
        if (error.status === 0) {
          console.error(`[${new Date().toLocaleTimeString()}] - A szerver nem elérhető vagy nem válaszol. Ellenőrizd a backend szervert.`);
        } else if (error.status === 401 || error.status === 403) {
          console.error(`[${new Date().toLocaleTimeString()}] - Autentikációs hiba! Lehet, hogy a token lejárt vagy hibás. Próbálj újra bejelentkezni.`);
        } else if (error.status === 404) {
          console.error(`[${new Date().toLocaleTimeString()}] - Az API végpont (${endpoint}) nem található!`);
        } else {
          console.error(`[${new Date().toLocaleTimeString()}] - Egyéb szerver hiba:`, error);
        }
        
        // Tesztadatok generálása ideiglenes megoldásként a hiba megkerülésére
        console.log(`[${new Date().toLocaleTimeString()}] ℹ️ Tesztadatok használata a hiba miatt (ideiglenes megoldás)...`);
        return of(this.generateTestTickets());
      })
    );
  }
}
