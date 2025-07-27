import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiBaseUrl + '/usuarios';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private getUserId(): number {
    if (isPlatformBrowser(this.platformId)) {
      return Number(localStorage.getItem('userId')) || 13; // por defecto 13
    }
    return 13;
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createUser(user: any): Observable<any> {
    const userId = this.getUserId();
    return this.http.post<any>(this.baseUrl, { ...user, userId }, { headers: this.getAuthHeaders() });
  }

  updateUser(id: number, user: any): Observable<any> {
    const userId = this.getUserId();
    return this.http.put<any>(`${this.baseUrl}/${id}`, { ...user, userId }, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    const userId = this.getUserId();
    return this.http.request<any>('delete', `${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      body: { userId },
    });
  }
}
