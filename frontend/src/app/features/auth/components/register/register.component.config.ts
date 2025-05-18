import { RegisterFormValidation, RegisterFormMessages } from './register.component.types';

export const REGISTER_FORM_VALIDATION: RegisterFormValidation = {
  name: {
    required: true,
    minlength: 2
  },
  email: {
    required: true,
    email: true
  },
  password: {
    required: true,
    minlength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  },
  confirmPassword: {
    required: true
  }
};

export const REGISTER_FORM_MESSAGES: RegisterFormMessages = {
  name: {
    required: 'auth.nameRequired',
    minlength: 'auth.nameMinLength'
  },
  email: {
    required: 'auth.emailRequired',
    email: 'auth.emailInvalid'
  },
  password: {
    required: 'auth.passwordRequired',
    minlength: 'auth.passwordMinLength',
    pattern: 'auth.passwordPattern'
  },
  confirmPassword: {
    required: 'auth.confirmPasswordRequired',
    passwordMismatch: 'auth.passwordsDontMatch'
  }
};

export const REGISTER_FORM_INITIAL_VALUES = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export const PASSWORD_MIN_LENGTH = 8;
export const NAME_MIN_LENGTH = 2; 