import { RegisterForm } from './register.component.interface';

export interface RegisterEvent {
  type: RegisterEventType;
  payload?: any;
}

export enum RegisterEventType {
  FORM_SUBMIT = '[Register] Form Submit',
  FORM_RESET = '[Register] Form Reset',
  FORM_CHANGE = '[Register] Form Change',
  VALIDATION_ERROR = '[Register] Validation Error',
  REGISTRATION_SUCCESS = '[Register] Registration Success',
  REGISTRATION_FAILURE = '[Register] Registration Failure',
  EMAIL_VALIDATION = '[Register] Email Validation',
  PASSWORD_VALIDATION = '[Register] Password Validation',
  NAVIGATION = '[Register] Navigation'
}

export interface FormSubmitEvent extends RegisterEvent {
  type: RegisterEventType.FORM_SUBMIT;
  payload: RegisterForm;
}

export interface FormResetEvent extends RegisterEvent {
  type: RegisterEventType.FORM_RESET;
}

export interface FormChangeEvent extends RegisterEvent {
  type: RegisterEventType.FORM_CHANGE;
  payload: Partial<RegisterForm>;
}

export interface ValidationErrorEvent extends RegisterEvent {
  type: RegisterEventType.VALIDATION_ERROR;
  payload: { [key: string]: string[] };
}

export interface RegistrationSuccessEvent extends RegisterEvent {
  type: RegisterEventType.REGISTRATION_SUCCESS;
  payload: {
    id: string;
    token: string;
  };
}

export interface RegistrationFailureEvent extends RegisterEvent {
  type: RegisterEventType.REGISTRATION_FAILURE;
  payload: string;
}

export interface EmailValidationEvent extends RegisterEvent {
  type: RegisterEventType.EMAIL_VALIDATION;
  payload: string;
}

export interface PasswordValidationEvent extends RegisterEvent {
  type: RegisterEventType.PASSWORD_VALIDATION;
  payload: string;
}

export interface NavigationEvent extends RegisterEvent {
  type: RegisterEventType.NAVIGATION;
  payload: string;
}

export type RegisterEventUnion =
  | FormSubmitEvent
  | FormResetEvent
  | FormChangeEvent
  | ValidationErrorEvent
  | RegistrationSuccessEvent
  | RegistrationFailureEvent
  | EmailValidationEvent
  | PasswordValidationEvent
  | NavigationEvent; 