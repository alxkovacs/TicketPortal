import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RegisterState } from './register.component.reducer';

export const selectRegisterState = createFeatureSelector<RegisterState>('register');

export const selectForm = createSelector(
  selectRegisterState,
  (state: RegisterState) => state.form
);

export const selectLoading = createSelector(
  selectRegisterState,
  (state: RegisterState) => state.loading
);

export const selectError = createSelector(
  selectRegisterState,
  (state: RegisterState) => state.error
);

export const selectSuccess = createSelector(
  selectRegisterState,
  (state: RegisterState) => state.success
);

export const selectName = createSelector(
  selectForm,
  (form) => form.name
);

export const selectEmail = createSelector(
  selectForm,
  (form) => form.email
);

export const selectPassword = createSelector(
  selectForm,
  (form) => form.password
);

export const selectConfirmPassword = createSelector(
  selectForm,
  (form) => form.confirmPassword
);

export const selectIsFormValid = createSelector(
  selectForm,
  (form) => {
    return form.name && form.email && form.password && form.confirmPassword && form.password === form.confirmPassword;
  }
); 