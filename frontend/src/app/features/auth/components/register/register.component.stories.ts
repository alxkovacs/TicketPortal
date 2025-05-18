import { Meta, Story } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { RegisterFacade } from './register.component.facade';
import { RegisterForm } from './register.component.interface';
import { TranslationModule } from '../../../../assets/i18n/translation.module';

export default {
  title: 'Auth/Register',
  component: RegisterComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslationModule
      ],
      providers: [
        {
          provide: RegisterFacade,
          useValue: {
            form$: of({
              name: '',
              email: '',
              password: '',
              confirmPassword: ''
            } as RegisterForm),
            loading$: of(false),
            error$: of(null),
            success$: of(false),
            isFormValid$: of(false),
            register: () => {},
            updateForm: () => {},
            validateEmail: () => {},
            validatePassword: () => {}
          }
        },
        { provide: Store, useValue: { dispatch: () => {} } }
      ]
    })
  ]
} as Meta;

const Template: Story = (args) => ({
  props: args
});

export const Default = Template.bind({});
Default.args = {};

export const Loading = Template.bind({});
Loading.args = {
  loading: true
};

export const Error = Template.bind({});
Error.args = {
  error: 'Registration failed. Please try again.'
};

export const Success = Template.bind({});
Success.args = {
  success: true
};

export const FilledForm = Template.bind({});
FilledForm.args = {
  form: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!'
  }
}; 