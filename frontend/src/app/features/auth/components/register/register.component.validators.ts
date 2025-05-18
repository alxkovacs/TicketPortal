import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password?.value !== confirmPassword?.value) {
    return { passwordMismatch: true };
  }

  return null;
};

export const emailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const email = control.value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return { invalidEmail: true };
  }

  return null;
};

export const passwordStrengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.value;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors: ValidationErrors = {};

  if (!hasNumber) {
    errors['noNumber'] = true;
  }
  if (!hasUpper) {
    errors['noUpperCase'] = true;
  }
  if (!hasLower) {
    errors['noLowerCase'] = true;
  }
  if (!hasSpecial) {
    errors['noSpecialChar'] = true;
  }
  if (password.length < 8) {
    errors['minLength'] = true;
  }

  return Object.keys(errors).length ? errors : null;
}; 