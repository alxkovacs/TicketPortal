import { RegisterForm } from './register.component.interface';

export interface RegisterState {
  form: RegisterForm;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const initialRegisterState: RegisterState = {
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