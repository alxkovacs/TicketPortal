import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const nameControl = component.registerForm.get('name');
    const emailControl = component.registerForm.get('email');
    const passwordControl = component.registerForm.get('password');
    const confirmPasswordControl = component.registerForm.get('confirmPassword');

    nameControl?.setValue('');
    emailControl?.setValue('');
    passwordControl?.setValue('');
    confirmPasswordControl?.setValue('');

    expect(nameControl?.valid).toBeFalsy();
    expect(emailControl?.valid).toBeFalsy();
    expect(passwordControl?.valid).toBeFalsy();
    expect(confirmPasswordControl?.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.registerForm.get('password');

    passwordControl?.setValue('12345');
    expect(passwordControl?.valid).toBeFalsy();

    passwordControl?.setValue('123456');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should validate password match', () => {
    const passwordControl = component.registerForm.get('password');
    const confirmPasswordControl = component.registerForm.get('confirmPassword');

    passwordControl?.setValue('password123');
    confirmPasswordControl?.setValue('different123');

    expect(component.registerForm.errors?.['passwordMismatch']).toBeTruthy();

    confirmPasswordControl?.setValue('password123');
    expect(component.registerForm.errors).toBeNull();
  });

  it('should call authService.register and navigate on valid form submission', () => {
    authService.register.and.returnValue(of({}));

    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'Test User'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/events']);
  });

  it('should not call authService.register on invalid form submission', () => {
    component.registerForm.setValue({
      name: '',
      email: 'invalid-email',
      password: '12345',
      confirmPassword: 'different'
    });

    component.onSubmit();

    expect(authService.register).not.toHaveBeenCalled();
  });
}); 