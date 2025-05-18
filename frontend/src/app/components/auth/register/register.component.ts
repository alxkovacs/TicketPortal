import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Regisztráció</h3>
          </div>
          <div class="card-body">
            <div *ngIf="errorMessage" class="alert alert-danger mb-3">
              {{ errorMessage }}
            </div>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="firstName" class="form-label">Keresztnév</label>
                <input
                  type="text"
                  class="form-control"
                  id="firstName"
                  formControlName="firstName"
                  [class.is-invalid]="firstName.invalid && firstName.touched"
                >
                <div class="invalid-feedback" *ngIf="firstName.invalid && firstName.touched">
                  <div *ngIf="firstName.errors?.['required']">A keresztnév megadása kötelező</div>
                </div>
              </div>
              <div class="mb-3">
                <label for="lastName" class="form-label">Vezetéknév</label>
                <input
                  type="text"
                  class="form-control"
                  id="lastName"
                  formControlName="lastName"
                  [class.is-invalid]="lastName.invalid && lastName.touched"
                >
                <div class="invalid-feedback" *ngIf="lastName.invalid && lastName.touched">
                  <div *ngIf="lastName.errors?.['required']">A vezetéknév megadása kötelező</div>
                </div>
              </div>
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
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Jelszó megerősítése</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  formControlName="confirmPassword"
                  [class.is-invalid]="confirmPassword.invalid && confirmPassword.touched"
                >
                <div class="invalid-feedback" *ngIf="confirmPassword.invalid && confirmPassword.touched">
                  <div *ngIf="confirmPassword.errors?.['required']">A jelszó megerősítése kötelező</div>
                  <div *ngIf="confirmPassword.errors?.['passwordMismatch']">A jelszó és a megerősítés nem egyezik</div>
                </div>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" [disabled]="registerForm.invalid">
                  Regisztráció
                </button>
              </div>
            </form>
          </div>
          <div class="card-footer text-center">
            <p class="mb-0">Már van fiókja? <a routerLink="/auth/login">Bejelentkezés</a></p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get firstName() {
    return this.registerForm.get('firstName')!;
  }

  get lastName() {
    return this.registerForm.get('lastName')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword')!;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.registerForm.invalid) {
      return;
    }

    const { firstName, lastName, email, password } = this.registerForm.value;
    this.authService.register({ firstName, lastName, email, password }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        if (error.status === 409) {
          this.errorMessage = 'Ez az e-mail cím már használatban van.';
        } else if (error.status === 400) {
          this.errorMessage = 'A megadott adatok érvénytelenek. Kérjük ellenőrizze és próbálja újra.';
        } else {
          this.errorMessage = 'Hiba történt a regisztráció során. Kérjük próbálja újra később.';
        }
      }
    });
  }
}