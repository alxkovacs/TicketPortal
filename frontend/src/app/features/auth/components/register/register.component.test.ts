import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { RegisterFacade } from './register.component.facade';
import { RegisterForm } from './register.component.interface';
import { TranslationModule } from '../../../../assets/i18n/translation.module';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let facade: RegisterFacade;

  const mockRegisterFacade = {
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
    register: jasmine.createSpy('register'),
    updateForm: jasmine.createSpy('updateForm'),
    validateEmail: jasmine.createSpy('validateEmail'),
    validatePassword: jasmine.createSpy('validatePassword')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslationModule
      ],
      providers: [
        { provide: RegisterFacade, useValue: mockRegisterFacade },
        { provide: Store, useValue: { dispatch: () => {} } }
      ]
    }).compileComponents();

    facade = TestBed.inject(RegisterFacade);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all fields are filled correctly', () => {
    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should call register when form is submitted with valid data', () => {
    const formData: RegisterForm = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };

    component.registerForm.patchValue(formData);
    component.onSubmit();

    expect(facade.register).toHaveBeenCalledWith(formData);
  });

  it('should not call register when form is invalid', () => {
    component.onSubmit();
    expect(facade.register).not.toHaveBeenCalled();
  });

  it('should validate email when email field changes', () => {
    const email = 'test@example.com';
    component.registerForm.get('email')?.setValue(email);
    expect(facade.validateEmail).toHaveBeenCalledWith(email);
  });

  it('should validate password when password field changes', () => {
    const password = 'Password123!';
    component.registerForm.get('password')?.setValue(password);
    expect(facade.validatePassword).toHaveBeenCalledWith(password);
  });

  it('should show password mismatch error when passwords do not match', () => {
    component.registerForm.patchValue({
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!'
    });

    expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();
  });

  it('should not show password mismatch error when passwords match', () => {
    const password = 'Password123!';
    component.registerForm.patchValue({
      password,
      confirmPassword: password
    });

    expect(component.registerForm.hasError('passwordMismatch')).toBeFalsy();
  });
}); 