import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Login</h2>
      
      <div class="alert alert-danger" *ngIf="errorMessage" style="margin-bottom: 20px;">
        {{ errorMessage }}
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="form-control"
          >
          <div class="error-message" *ngIf="loginForm.get('email')?.hasError('required')">
            Email is required
          </div>
          <div class="error-message" *ngIf="loginForm.get('email')?.hasError('email')">
            Please enter a valid email
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            class="form-control"
          >
          <div class="error-message" *ngIf="loginForm.get('password')?.hasError('required')">
            Password is required
          </div>
        </div>

        <div class="form-actions">
          <button type="button" (click)="goToRegister()" class="btn btn-secondary">Register</button>
          <button type="submit" [disabled]="loginForm.invalid" class="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
    }
    .form-group {
      margin-bottom: 20px;
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
      justify-content: space-between;
      margin-top: 20px;
    }
    .alert {
      padding: 12px;
      border-radius: 4px;
    }
    .alert-danger {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.errorMessage = ''; // Reset error message
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Attempting login with:', { email });
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Login error:', error);
          if (error.status === 401) {
            this.errorMessage = 'Hibás email cím vagy jelszó!';
          } else {
            this.errorMessage = 'Hiba történt a bejelentkezés során. Kérjük próbálja újra később.';
          }
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
} 