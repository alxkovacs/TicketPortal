import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { RegisterForm, RegisterResponse } from './register.component.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private readonly apiUrl = `${environment.apiUrl}/auth/register`;

  constructor(private http: HttpClient) {}

  register(formData: RegisterForm): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.apiUrl, formData);
  }

  validateEmail(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/validate-email`, { email });
  }

  validatePassword(password: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/validate-password`, { password });
  }
} 