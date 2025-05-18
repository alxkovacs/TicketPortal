import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <h2>Register</h2>
      
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            class="form-control"
          >
          <div class="error-message" *ngIf="registerForm.get('name')?.hasError('required')">
            Name is required
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="form-control"
          >
          <div class="error-message" *ngIf="registerForm.get('email')?.hasError('required')">
            Email is required
          </div>
          <div class="error-message" *ngIf="registerForm.get('email')?.hasError('email')">
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
          <div class="error-message" *ngIf="registerForm.get('password')?.hasError('required')">
            Password is required
          </div>
          <div class="error-message" *ngIf="registerForm.get('password')?.hasError('minlength')">
            Password must be at least 6 characters
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            formControlName="confirmPassword"
            class="form-control"
          >
          <div class="error-message" *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
            Please confirm your password
          </div>
          <div class="error-message" *ngIf="registerForm.hasError('passwordMismatch')">
            Passwords do not match
          </div>
        </div>

        <div class="form-actions">
          <button type="button" (click)="goToLogin()" class="btn btn-secondary">Back to Login</button>
          <button type="submit" [disabled]="registerForm.invalid" class="btn btn-primary">Register</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
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
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password } = this.registerForm.value;
      this.authService.register(firstName, lastName, email, password).subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          // Itt hozzáadhatunk egy felhasználói értesítést a hibáról
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
} 