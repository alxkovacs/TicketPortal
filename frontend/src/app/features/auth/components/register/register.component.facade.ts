import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RegisterForm } from './register.component.interface';
import * as RegisterActions from './register.component.actions';
import * as RegisterSelectors from './register.component.selectors';

@Injectable({
  providedIn: 'root'
})
export class RegisterFacade {
  form$: Observable<RegisterForm> = this.store.select(RegisterSelectors.selectForm);
  loading$: Observable<boolean> = this.store.select(RegisterSelectors.selectLoading);
  error$: Observable<string | null> = this.store.select(RegisterSelectors.selectError);
  success$: Observable<boolean> = this.store.select(RegisterSelectors.selectSuccess);
  isFormValid$: Observable<boolean> = this.store.select(RegisterSelectors.selectIsFormValid);

  constructor(private store: Store) {}

  register(form: RegisterForm): void {
    this.store.dispatch(RegisterActions.register({ form }));
  }

  updateForm(form: Partial<RegisterForm>): void {
    this.store.dispatch(RegisterActions.updateForm({ form }));
  }

  validateEmail(email: string): void {
    this.store.dispatch(RegisterActions.validateEmail({ email }));
  }

  validatePassword(password: string): void {
    this.store.dispatch(RegisterActions.validatePassword({ password }));
  }
} 