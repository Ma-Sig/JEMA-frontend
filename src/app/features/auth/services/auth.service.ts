import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Promise<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).toPromise();
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
    // if (isPlatformBrowser(this.platformId)) {
    //   return !!localStorage.getItem('token');
    // }
    // return false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  //Ah den revisando, si esto si va o no
  getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userId');
    }
    return null;
  }

  /**
   * Obtiene userId por el email del usuario
   */
  getUserIdByEmail(email: string): Observable<{ id_usuario: string }> {
    return this.http.get<{ id_usuario: string }>(`${this.baseUrl}/usuarios/email/${email}`);
  }
}
