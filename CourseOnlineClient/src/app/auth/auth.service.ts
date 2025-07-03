import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

interface AuthResponse {
  message: string;
  userId?: number;
  token?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // ודא שכתובת ה-API נכונה
  public isBrowser: boolean; // מאפיין ציבורי לבדיקה אם אנחנו בדפדפן

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
  
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        if (response.token) {
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('userId', response.userId?.toString() || '');
          sessionStorage.setItem('role', response.role || '');
        }
      }),
      map((response: AuthResponse) => response)
    );
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  getUserId(): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem('userId');
    }
    return null;
  }

  getRole(): string | null {
   // console.log("test");
    if (this.isBrowser) {
     // console.log(sessionStorage.getItem('role'));
      return sessionStorage.getItem('role');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.isBrowser && !!this.getToken();
  }
}