import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  handleError(error: any): void {
    const errorMessage = error.error?.message || error.message || 'An error occurred';
    this.errorSubject.next(errorMessage);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
} 