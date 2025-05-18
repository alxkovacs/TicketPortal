import { RegisterForm, RegisterResponse } from './register.component.interface';

export class RegisterMapper {
  static toRegisterRequest(form: RegisterForm): any {
    return {
      name: form.name,
      email: form.email,
      password: form.password
    };
  }

  static toRegisterResponse(response: any): RegisterResponse {
    return {
      id: response.id,
      name: response.name,
      email: response.email,
      token: response.token
    };
  }

  static toFormModel(response: RegisterResponse): RegisterForm {
    return {
      name: response.name,
      email: response.email,
      password: '',
      confirmPassword: ''
    };
  }

  static toErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error.message) {
      return error.message;
    }

    if (error.error && error.error.message) {
      return error.error.message;
    }

    return 'An unknown error occurred';
  }

  static toValidationErrors(errors: any): { [key: string]: string[] } {
    if (!errors) {
      return {};
    }

    return Object.keys(errors).reduce((acc, key) => {
      const error = errors[key];
      if (typeof error === 'string') {
        acc[key] = [error];
      } else if (Array.isArray(error)) {
        acc[key] = error;
      } else if (typeof error === 'object') {
        acc[key] = Object.values(error);
      }
      return acc;
    }, {} as { [key: string]: string[] });
  }
} 