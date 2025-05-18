import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { RegisterService } from './register.component.service';
import { RegisterForm } from './register.component.interface';

@Injectable()
export class RegisterEffects {
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Register] Register'),
      mergeMap((action: { form: RegisterForm }) =>
        this.registerService.register(action.form).pipe(
          map(() => ({ type: '[Register] Register Success' })),
          catchError(error => of({ type: '[Register] Register Failure', error }))
        )
      )
    )
  );

  validateEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Register] Validate Email'),
      mergeMap((action: { email: string }) =>
        this.registerService.validateEmail(action.email).pipe(
          map(isValid => ({ type: '[Register] Validate Email Success', isValid })),
          catchError(error => of({ type: '[Register] Validate Email Failure', error }))
        )
      )
    )
  );

  validatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Register] Validate Password'),
      mergeMap((action: { password: string }) =>
        this.registerService.validatePassword(action.password).pipe(
          map(isValid => ({ type: '[Register] Validate Password Success', isValid })),
          catchError(error => of({ type: '[Register] Validate Password Failure', error }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private registerService: RegisterService
  ) {}
} 