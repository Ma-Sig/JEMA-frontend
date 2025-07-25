import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'; 

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private baseUrl = `${environment.apiBaseUrl}/reportes`;

  constructor(private http: HttpClient) {}

  getHistoricoItem(codigo: string, userId: string) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const params = new HttpParams().set('userId', userId);

    return this.http.get<any[]>(`${this.baseUrl}/historico/${codigo}`, { headers, params });
  }

  getItemsPorLugar(idLugar: number, userId: string) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const params = new HttpParams().set('userId', userId);

    return this.http.get<any[]>(`${this.baseUrl}/items-lugar/${idLugar}`, { headers, params });
  }

  getEstadoItems(userId: string) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const params = new HttpParams().set('userId', userId);

    return this.http.get<any[]>(`${this.baseUrl}/estado-items`, { headers, params });
  }
}
