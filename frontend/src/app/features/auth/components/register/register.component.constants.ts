export const MIN_PASSWORD_LENGTH = 6;

export const REGISTER_FORM_DEFAULT_VALUES = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export const REGISTER_FORM_VALIDATORS = {
  name: ['', []],
  email: ['', ['required', 'email']],
  password: ['', ['required', `minlength:${MIN_PASSWORD_LENGTH}`]],
  confirmPassword: ['', ['required']]
};

export const REGISTER_ERROR_MESSAGES = {
  name: {
    required: 'auth.nameRequired'
  },
  email: {
    required: 'auth.emailRequired',
    email: 'auth.emailInvalid'
  },
  password: {
    required: 'auth.passwordRequired',
    minlength: 'auth.passwordMinLength'
  },
  confirmPassword: {
    required: 'auth.confirmPasswordRequired'
  },
  passwordMismatch: 'auth.passwordsDontMatch'
}; 