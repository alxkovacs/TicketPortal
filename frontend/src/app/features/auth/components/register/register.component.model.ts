import { FormGroup } from '@angular/forms';
import { RegisterForm } from './register.component.interface';
import { RegisterFormField } from './register.component.types';

export class RegisterFormModel {
  private form: FormGroup;

  constructor(form: FormGroup) {
    this.form = form;
  }

  get value(): RegisterForm {
    return this.form.value;
  }

  get valid(): boolean {
    return this.form.valid;
  }

  get dirty(): boolean {
    return this.form.dirty;
  }

  get touched(): boolean {
    return this.form.touched;
  }

  get errors(): any {
    return this.form.errors;
  }

  getField(field: RegisterFormField): any {
    return this.form.get(field);
  }

  getFieldValue(field: RegisterFormField): any {
    return this.form.get(field)?.value;
  }

  getFieldError(field: RegisterFormField): any {
    const control = this.form.get(field);
    return control?.errors;
  }

  isFieldValid(field: RegisterFormField): boolean {
    const control = this.form.get(field);
    return control ? control.valid && control.touched : false;
  }

  isFieldInvalid(field: RegisterFormField): boolean {
    const control = this.form.get(field);
    return control ? control.invalid && control.touched : false;
  }

  markAsTouched(): void {
    this.form.markAllAsTouched();
  }

  reset(): void {
    this.form.reset();
  }

  patchValue(value: Partial<RegisterForm>): void {
    this.form.patchValue(value);
  }

  setValue(value: RegisterForm): void {
    this.form.setValue(value);
  }

  updateValidators(): void {
    this.form.updateValueAndValidity();
  }
} 