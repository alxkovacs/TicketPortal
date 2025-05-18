import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Ticket Portal</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/events" routerLinkActive="active">Events</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/tickets" routerLinkActive="active">My Tickets</a>
            </li>
            <li class="nav-item" *ngIf="isAdmin$ | async">
              <a class="nav-link" routerLink="/admin" routerLinkActive="active">Admin</a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" *ngIf="!(isAuthenticated$ | async)">
              <a class="nav-link" routerLink="/auth/login">Login</a>
            </li>
            <li class="nav-item" *ngIf="!(isAuthenticated$ | async)">
              <a class="nav-link" routerLink="/auth/register">Register</a>
            </li>
            <li class="nav-item dropdown" *ngIf="isAuthenticated$ | async">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                {{ (currentUser$ | async)?.name }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" (click)="logout()">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      margin-bottom: 2rem;
    }
    .dropdown-menu {
      cursor: pointer;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  currentUser$: Observable<any>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isAdmin$ = this.authService.isAdmin$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
} 