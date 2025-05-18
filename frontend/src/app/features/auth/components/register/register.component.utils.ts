import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { RegisterForm } from './register.component.interface';
import { RegisterFormField } from './register.component.types';

export const validatePasswordMatch = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password?.value !== confirmPassword?.value) {
    return { passwordMismatch: true };
  }

  return null;
};

export const getFormControlError = (form: FormGroup, field: RegisterFormField): string | null => {
  const control = form.get(field);
  if (!control || !control.errors || !control.touched) {
    return null;
  }

  const errorKey = Object.keys(control.errors)[0];
  return errorKey;
};

export const isFormFieldValid = (form: FormGroup, field: RegisterFormField): boolean => {
  const control = form.get(field);
  return control ? control.valid && control.touched : false;
};

export const resetForm = (form: FormGroup): void => {
  form.reset({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
};

export const mapFormToRegisterData = (form: FormGroup): RegisterForm => {
  const { name, email, password } = form.value;
  return {
    name,
    email,
    password,
    confirmPassword: password
  };
}; 