import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterForm } from './register.component.interface';
import { RegisterFormModel } from './register.component.model';
import { passwordMatchValidator, emailValidator, passwordStrengthValidator } from './register.component.validators';
import { REGISTER_FORM_INITIAL_VALUES, PASSWORD_MIN_LENGTH, NAME_MIN_LENGTH } from './register.component.config';

export class RegisterFormFactory {
  static create(fb: FormBuilder): FormGroup {
    return fb.group({
      name: [
        REGISTER_FORM_INITIAL_VALUES.name,
        [
          Validators.required,
          Validators.minLength(NAME_MIN_LENGTH)
        ]
      ],
      email: [
        REGISTER_FORM_INITIAL_VALUES.email,
        [
          Validators.required,
          Validators.email,
          emailValidator
        ]
      ],
      password: [
        REGISTER_FORM_INITIAL_VALUES.password,
        [
          Validators.required,
          Validators.minLength(PASSWORD_MIN_LENGTH),
          passwordStrengthValidator
        ]
      ],
      confirmPassword: [
        REGISTER_FORM_INITIAL_VALUES.confirmPassword,
        [
          Validators.required
        ]
      ]
    }, {
      validators: passwordMatchValidator
    });
  }

  static createModel(form: FormGroup): RegisterFormModel {
    return new RegisterFormModel(form);
  }

  static createInitialState(): RegisterForm {
    return {
      ...REGISTER_FORM_INITIAL_VALUES
    };
  }
} 