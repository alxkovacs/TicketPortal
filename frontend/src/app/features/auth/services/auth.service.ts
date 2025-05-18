import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ErrorService } from '../../../core/services/error.service';
import { LoadingService } from '../../../core/services/loading.service';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));
  isAdmin$ = this.currentUser$.pipe(map(user => {
    console.log('Checking admin status for user:', user);
    return user?.role?.toLowerCase() === 'admin';
  }));

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private loadingService: LoadingService
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this.loadUserFromToken(token);
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    this.loadingService.setLoading(true);
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: AuthResponse) => {
        console.log('Login response:', response);
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
        this.loadingService.setLoading(false);
      }),
      catchError((error: any) => {
        this.loadingService.setLoading(false);
        console.error('Login error:', error);
        if (error.status === 401) {
          return throwError(() => new Error('Hibás email cím vagy jelszó!'));
        }
        return throwError(() => new Error('Hiba történt a bejelentkezés során. Kérjük próbálja újra később.'));
      })
    );
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<AuthResponse> {
    this.loadingService.setLoading(true);
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { firstName, lastName, email, password }).pipe(
      tap((response: AuthResponse) => {
        console.log('Register response:', response);
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
        this.loadingService.setLoading(false);
      }),
      catchError((error: any) => {
        this.loadingService.setLoading(false);
        console.error('Register error:', error);
        if (error.status === 400) {
          return throwError(() => new Error('Ez az email cím már foglalt!'));
        }
        return throwError(() => new Error('Hiba történt a regisztráció során. Kérjük próbálja újra később.'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  private loadUserFromToken(token: string): void {
    this.http.get<User>(`${this.apiUrl}/me`).subscribe({
      next: (user) => {
        console.log('Loaded user from token:', user);
        this.currentUserSubject.next(user);
      },
      error: (error) => {
        console.error('Error loading user from token:', error);
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
      }
    });
  }
} 