export type RegisterFormField = 'name' | 'email' | 'password' | 'confirmPassword';

export type RegisterFormErrors = {
  [key in RegisterFormField]?: string[];
};

export type RegisterFormValidation = {
  [key in RegisterFormField]: {
    required?: boolean;
    email?: boolean;
    minlength?: number;
    pattern?: RegExp;
  };
};

export type RegisterFormMessages = {
  [key in RegisterFormField]: {
    [key: string]: string;
  };
}; 