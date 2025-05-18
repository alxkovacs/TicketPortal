import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { RegisterForm, RegisterResponse } from './register.component.interface';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegisterService } from './register.component.service';

interface RegisterState {
  form: RegisterForm;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: RegisterState = {
  form: {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  loading: false,
  error: null,
  success: false
};

@Injectable()
export class RegisterStore extends ComponentStore<RegisterState> {
  constructor(private registerService: RegisterService) {
    super(initialState);
  }

  readonly form$ = this.select(state => state.form);
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);
  readonly success$ = this.select(state => state.success);

  readonly updateForm = this.updater((state, form: Partial<RegisterForm>) => ({
    ...state,
    form: { ...state.form, ...form }
  }));

  readonly register = this.effect((form$: Observable<RegisterForm>) => {
    return form$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      tap(form => {
        this.registerService.register(form).subscribe({
          next: () => {
            this.patchState({ loading: false, success: true });
          },
          error: (error) => {
            this.patchState({ loading: false, error: error.message });
          }
        });
      })
    );
  });

  readonly validateEmail = this.effect((email$: Observable<string>) => {
    return email$.pipe(
      tap(email => {
        this.registerService.validateEmail(email).subscribe({
          error: (error) => {
            this.patchState({ error: error.message });
          }
        });
      })
    );
  });

  readonly validatePassword = this.effect((password$: Observable<string>) => {
    return password$.pipe(
      tap(password => {
        this.registerService.validatePassword(password).subscribe({
          error: (error) => {
            this.patchState({ error: error.message });
          }
        });
      })
    );
  });
} 