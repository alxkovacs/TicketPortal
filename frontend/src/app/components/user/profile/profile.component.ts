import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Profile</h3>
          </div>
          <div class="card-body">
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="firstName" class="form-label">First Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="firstName"
                  formControlName="firstName"
                  [class.is-invalid]="firstName.invalid && firstName.touched"
                >
                <div class="invalid-feedback" *ngIf="firstName.invalid && firstName.touched">
                  <div *ngIf="firstName.errors?.['required']">First name is required</div>
                </div>
              </div>
              <div class="mb-3">
                <label for="lastName" class="form-label">Last Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="lastName"
                  formControlName="lastName"
                  [class.is-invalid]="lastName.invalid && lastName.touched"
                >
                <div class="invalid-feedback" *ngIf="lastName.invalid && lastName.touched">
                  <div *ngIf="lastName.errors?.['required']">Last name is required</div>
                </div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  formControlName="email"
                  [class.is-invalid]="email.invalid && email.touched"
                >
                <div class="invalid-feedback" *ngIf="email.invalid && email.touched">
                  <div *ngIf="email.errors?.['required']">Email is required</div>
                  <div *ngIf="email.errors?.['email']">Please enter a valid email</div>
                </div>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid">
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header">
            <h3 class="text-center">Change Password</h3>
          </div>
          <div class="card-body">
            <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">Current Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="currentPassword"
                  formControlName="currentPassword"
                  [class.is-invalid]="currentPassword.invalid && currentPassword.touched"
                >
                <div class="invalid-feedback" *ngIf="currentPassword.invalid && currentPassword.touched">
                  <div *ngIf="currentPassword.errors?.['required']">Current password is required</div>
                </div>
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">New Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="newPassword"
                  formControlName="newPassword"
                  [class.is-invalid]="newPassword.invalid && newPassword.touched"
                >
                <div class="invalid-feedback" *ngIf="newPassword.invalid && newPassword.touched">
                  <div *ngIf="newPassword.errors?.['required']">New password is required</div>
                  <div *ngIf="newPassword.errors?.['minlength']">Password must be at least 6 characters</div>
                </div>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" [disabled]="passwordForm.invalid">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  user: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
      }
    });
  }

  get firstName() {
    return this.profileForm.get('firstName')!;
  }

  get lastName() {
    return this.profileForm.get('lastName')!;
  }

  get email() {
    return this.profileForm.get('email')!;
  }

  get currentPassword() {
    return this.passwordForm.get('currentPassword')!;
  }

  get newPassword() {
    return this.passwordForm.get('newPassword')!;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.userService.updateUserProfile(this.profileForm.value).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        console.error('Failed to update profile:', error);
      }
    });
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;
    this.userService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.passwordForm.reset();
      },
      error: (error) => {
        console.error('Failed to change password:', error);
      }
    });
  }
} 