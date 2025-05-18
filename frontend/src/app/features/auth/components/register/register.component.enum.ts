export enum RegisterFormField {
  NAME = 'name',
  EMAIL = 'email',
  PASSWORD = 'password',
  CONFIRM_PASSWORD = 'confirmPassword'
}

export enum RegisterValidationError {
  REQUIRED = 'required',
  EMAIL = 'email',
  MIN_LENGTH = 'minlength',
  PATTERN = 'pattern',
  PASSWORD_MATCH = 'passwordMismatch'
}

export enum RegisterErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  SERVER = 'server',
  AUTHENTICATION = 'authentication',
  UNKNOWN = 'unknown'
}

export enum RegisterStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum RegisterRoute {
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  HOME = '/events'
}

export enum RegisterLanguage {
  EN = 'en',
  HU = 'hu'
}

export enum RegisterTheme {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum RegisterRole {
  USER = 'user',
  ADMIN = 'admin'
} 