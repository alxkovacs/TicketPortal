export class RegisterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RegisterError';
  }
}

export class ValidationError extends RegisterError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends RegisterError {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends RegisterError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ServerError extends RegisterError {
  constructor(message: string) {
    super(message);
    this.name = 'ServerError';
  }
}

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  SERVER_ERROR: 'An error occurred on the server. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please try again.',
  EMAIL_EXISTS: 'This email address is already registered.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  REQUIRED_FIELD: 'This field is required.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.'
}; 