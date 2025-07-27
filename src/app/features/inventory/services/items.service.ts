import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CaracteristicasItem {
  id_caracteristicas_item?: number;
  userId: number | null;
  codigo: string;
  nombre: string;
  marca: string;
  categoria: string;
  descripcion: string;
  imagen?: number[] | null; // Para envío como array de bytes
}

export interface CaracteristicasItemResponse {
  id_caracteristicas_item: number;
  codigo: string;
  nombre: string;
  marca: string;
  categoria: string;
  descripcion: string;
  imagen: string | null; // Base64 string desde el backend
}

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene una característica de item por ID
   */
  getItemById(id: number): Observable<CaracteristicasItemResponse> {
    return this.http.get<CaracteristicasItemResponse>(`${this.baseUrl}/caracteristicas-item/${id}`);
  }

  /**
   * Crea una nueva característica de item
   */
  createItem(item: CaracteristicasItem): Observable<CaracteristicasItemResponse> {
    return this.http.post<CaracteristicasItemResponse>(
      `${this.baseUrl}/caracteristicas-item`,
      item
    );
  }

  /**
   * Actualiza una característica de item existente
   */
  updateItem(id: number, item: CaracteristicasItem): Observable<CaracteristicasItemResponse> {
    return this.http.put<CaracteristicasItemResponse>(
      `${this.baseUrl}/caracteristicas-item/${id}`,
      item
    );
  }

  /**
   * Elimina una característica de item
   */
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/caracteristicas-item/${id}`);
  }

  /**
   * Obtiene todas las características de items
   */
  getAllItems(): Observable<CaracteristicasItemResponse[]> {
    return this.http.get<CaracteristicasItemResponse[]>(`${this.baseUrl}/caracteristicas-item`);
  }

  /**
   * Obtiene el ID del usuario desde localStorage
   */
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }
}
