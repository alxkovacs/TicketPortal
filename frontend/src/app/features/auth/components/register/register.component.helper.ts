import { FormGroup } from '@angular/forms';
import { RegisterForm } from './register.component.interface';
import { REGISTER_ERROR_MESSAGES } from './register.component.constants';

export const getErrorMessage = (form: FormGroup, field: keyof RegisterForm): string => {
  const control = form.get(field);
  if (!control || !control.errors) {
    return '';
  }

  const errorKey = Object.keys(control.errors)[0];
  return REGISTER_ERROR_MESSAGES[field]?.[errorKey] || '';
};

export const isFieldInvalid = (form: FormGroup, field: keyof RegisterForm): boolean => {
  const control = form.get(field);
  return control ? control.invalid && control.touched : false;
};

export const isFormValid = (form: FormGroup): boolean => {
  return form.valid && !form.errors?.['passwordMismatch'];
};

export const getFormValue = (form: FormGroup): RegisterForm => {
  return form.value as RegisterForm;
}; 