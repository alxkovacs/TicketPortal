import { createAction, props } from '@ngrx/store';
import { RegisterForm } from './register.component.interface';

export const register = createAction(
  '[Register] Register',
  props<{ form: RegisterForm }>()
);

export const registerSuccess = createAction(
  '[Register] Register Success'
);

export const registerFailure = createAction(
  '[Register] Register Failure',
  props<{ error: string }>()
);

export const updateForm = createAction(
  '[Register] Update Form',
  props<{ form: Partial<RegisterForm> }>()
);

export const validateEmail = createAction(
  '[Register] Validate Email',
  props<{ email: string }>()
);

export const validateEmailSuccess = createAction(
  '[Register] Validate Email Success',
  props<{ isValid: boolean }>()
);

export const validateEmailFailure = createAction(
  '[Register] Validate Email Failure',
  props<{ error: string }>()
);

export const validatePassword = createAction(
  '[Register] Validate Password',
  props<{ password: string }>()
);

export const validatePasswordSuccess = createAction(
  '[Register] Validate Password Success',
  props<{ isValid: boolean }>()
);

export const validatePasswordFailure = createAction(
  '[Register] Validate Password Failure',
  props<{ error: string }>()
); 