import { createReducer, on } from '@ngrx/store';
import { RegisterForm } from './register.component.interface';

export interface RegisterState {
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

export const registerReducer = createReducer(
  initialState,
  on('[Register] Register', state => ({
    ...state,
    loading: true,
    error: null
  })),
  on('[Register] Register Success', state => ({
    ...state,
    loading: false,
    success: true
  })),
  on('[Register] Register Failure', (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on('[Register] Update Form', (state, { form }) => ({
    ...state,
    form: { ...state.form, ...form }
  })),
  on('[Register] Validate Email Success', (state, { isValid }) => ({
    ...state,
    form: {
      ...state.form,
      email: isValid ? state.form.email : ''
    }
  })),
  on('[Register] Validate Password Success', (state, { isValid }) => ({
    ...state,
    form: {
      ...state.form,
      password: isValid ? state.form.password : ''
    }
  }))
); 