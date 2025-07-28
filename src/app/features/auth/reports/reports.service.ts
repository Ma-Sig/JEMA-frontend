import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getComboItems() {
    return this.http.get<{ codigo: string; nombre: string; id_item: number }[]>(`${this.baseUrl}/combo-items/`);
  }

  getLugares() {
    return this.http.get<{ id_lugar: number; nombre: string }[]>(`${this.baseUrl}/combo-lugares/`);
  }

  getItemsPorLugar(idLugar: number) {
    return this.http.get<{ codigo: string; nombre: string }[]>(`${this.baseUrl}/items-por-lugar/${idLugar}`);
  }

  getAuditoriasItem(idItem: number) {
    return this.http.get<{nombre_tabla: string; accion: string; fecha: Date; usuarios:{nombres: string}}>(`${this.baseUrl}/auditorias-item/${idItem}`);
  }

  getEstadoItems() {
    return this.http.get<{codigo: string; nombre: string; estado: string}>(`${this.baseUrl}/estado-items/`);
  }
}
