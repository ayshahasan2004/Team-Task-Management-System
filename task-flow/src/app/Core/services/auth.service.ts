import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  userId: string;
  fullName: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private tokenSignal = signal<string | null>(localStorage.getItem('token'));
  private userSignal = signal<Omit<AuthResponse, 'token'> | null>(
    JSON.parse(localStorage.getItem('user') ?? 'null')
  );

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.userSignal.asReadonly();
  readonly isLoggedIn = () => this.tokenSignal() !== null;

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.authApiUrl}/login`, { email, password });
  }

  signup(fullName: string, email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.authApiUrl}/signup`, { fullName, email, password });
  }

  saveSession(response: AuthResponse) {
    localStorage.setItem('token', response.token);
    localStorage.setItem(
      'user',
      JSON.stringify({
        userId: response.userId,
        fullName: response.fullName,
        email: response.email,
      })
    );

    this.tokenSignal.set(response.token);
    this.userSignal.set({
      userId: response.userId,
      fullName: response.fullName,
      email: response.email,
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }
}
