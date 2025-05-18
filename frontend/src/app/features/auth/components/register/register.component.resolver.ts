import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterResolver implements Resolve<boolean> {
  constructor(private authService: AuthService) {}

  resolve(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      map(isAuthenticated => !isAuthenticated)
    );
  }
} 