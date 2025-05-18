import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/users/profile`);
  }

  updateUserProfile(profileData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/api/users/profile`, profileData);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/api/users/change-password`, {
      currentPassword,
      newPassword
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/users`);
  }

  updateUserRole(userId: string, role: 'user' | 'admin'): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/api/users/${userId}/role`, { role });
  }
} 