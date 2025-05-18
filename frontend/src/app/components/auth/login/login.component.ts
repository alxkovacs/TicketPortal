import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Bejelentkezés</h3>
          </div>
          <div class="card-body">
            <div *ngIf="errorMessage" class="alert alert-danger mb-3">
              {{ errorMessage }}
            </div>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="email" class="form-label">E-mail cím</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  formControlName="email"
                  [class.is-invalid]="email.invalid && email.touched"
                >
                <div class="invalid-feedback" *ngIf="email.invalid && email.touched">
                  <div *ngIf="email.errors?.['required']">Az e-mail cím megadása kötelező</div>
                  <div *ngIf="email.errors?.['email']">Kérjük adjon meg egy érvényes e-mail címet</div>
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Jelszó</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  formControlName="password"
                  [class.is-invalid]="password.invalid && password.touched"
                >
                <div class="invalid-feedback" *ngIf="password.invalid && password.touched">
                  <div *ngIf="password.errors?.['required']">A jelszó megadása kötelező</div>
                  <div *ngIf="password.errors?.['minlength']">A jelszónak legalább 6 karakterből kell állnia</div>
                </div>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid">
                  Bejelentkezés
                </button>
              </div>
            </form>
          </div>
          <div class="card-footer text-center">
            <p class="mb-0">Még nincs fiókja? <a routerLink="/auth/register">Regisztráció</a></p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  onSubmit(): void {
    this.errorMessage = ''; // Reset any previous error messages
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        if (error.status === 401) {
          this.errorMessage = 'Hibás email cím vagy jelszó!'; 
        } else {
          this.errorMessage = 'Hiba történt a bejelentkezés során. Kérjük próbálja újra később.';
        }
      }
    });
  }
} 