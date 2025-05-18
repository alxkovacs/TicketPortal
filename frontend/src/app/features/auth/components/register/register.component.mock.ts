import { RegisterForm, RegisterResponse } from './register.component.interface';

export const mockRegisterForm: RegisterForm = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!'
};

export const mockRegisterResponse: RegisterResponse = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  token: 'mock-jwt-token'
};

export const mockRegisterFacade = {
  form$: {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  loading$: false,
  error$: null,
  success$: false,
  isFormValid$: false,
  register: () => {},
  updateForm: () => {},
  validateEmail: () => {},
  validatePassword: () => {}
};

export const mockRegisterState = {
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

export const mockRegisterErrors = {
  name: {
    required: 'Name is required',
    minlength: 'Name must be at least 2 characters long'
  },
  email: {
    required: 'Email is required',
    email: 'Please enter a valid email address'
  },
  password: {
    required: 'Password is required',
    minlength: 'Password must be at least 8 characters long',
    pattern: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  },
  confirmPassword: {
    required: 'Password confirmation is required',
    passwordMismatch: 'Passwords do not match'
  }
}; 