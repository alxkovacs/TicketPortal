import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || error.statusText;
    }
    return throwError(() => new Error(errorMessage));
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${endpoint}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${endpoint}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${endpoint}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${endpoint}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
} 