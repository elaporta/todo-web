// dependencies
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'auth_token';
  private tokenSignal = signal<string | null>(this.getStoredToken());

  token = this.tokenSignal.asReadonly();

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setStoredToken(token: string | null): void {
    if(token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  login(email: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/auth/login`, { email })
      .pipe(
        tap(response => {
          this.tokenSignal.set(response.token);
          this.setStoredToken(response.token);
        })
      );
  }

  register(email: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/auth/register`, { email })
      .pipe(
        tap(response => {
          this.tokenSignal.set(response.token);
          this.setStoredToken(response.token);
        })
      );
  }

  logout(): Observable<void> {
    return this.http.get<void>(`${environment.apiUrl}/auth/logout`)
      .pipe(
        tap(() => {
          this.tokenSignal.set(null);
          this.setStoredToken(null);
          this.router.navigate(['/auth']);
        })
      );
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}