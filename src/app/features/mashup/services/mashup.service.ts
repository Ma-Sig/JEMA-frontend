import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MashupService {
  private baseUrl = environment.apiBaseUrl;
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getPlaceByName(nombre: string): Observable<any> {
    console.log("Desde service: ", nombre);
    return this.http.get<any>(`${this.baseUrl}/lugares/nombre/${encodeURIComponent(nombre)}`, { headers: this.getAuthHeaders() });
  }

  getItemsByPlaceId(id_lugar: number): Observable<any[]> {
    console.log("Desde service id_lugar: ", id_lugar)
    return this.http.get<any[]>(`${this.baseUrl}/items/lugar/${encodeURIComponent(id_lugar)}`, { headers: this.getAuthHeaders() });
  }
}
