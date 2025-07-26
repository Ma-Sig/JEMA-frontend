import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiBaseUrl + '/usuarios';  // ejemplo: http://localhost:3000/usuarios

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createUser(user: any): Observable<any> {
  const userId = localStorage.getItem('userId');
  return this.http.request<any>('post', this.baseUrl, {
    headers: this.getAuthHeaders(),
    body: { ...user, userId }
  });
}

updateUser(id: number, user: any): Observable<any> {
  const userId = localStorage.getItem('userId');
  return this.http.request<any>('put', `${this.baseUrl}/${id}`, {
    headers: this.getAuthHeaders(),
    body: { ...user, userId }
  });
}

  deleteUser(id: number): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.request<any>('delete', `${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      body: { userId },
    });
  }
}
