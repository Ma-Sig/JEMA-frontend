import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Interfaces para el inventario
export interface InventoryItem {
  id_item?: number;
  id_caracteristicas_item: number;
  id_lugar: number;
  id_item_estado: number;
  codigo: string;
  userId?: number | null;
}

export interface InventoryItemResponse {
  id_item: number;
  id_caracteristicas_item: number;
  id_lugar: number;
  id_item_estado: number;
  codigo: string;
  caracteristicas: {
    id_caracteristicas_item: number;
    codigo: string;
    nombre: string;
    marca: string;
    categoria: string;
    descripcion: string;
  };
  estadoItem: {
    id_item_estado: number;
    estado: string;
  };
}

// Interfaces para dropdowns y selección
export interface EstadoItem {
  id_item_estado: number;
  estado: string;
}

export interface Lugar {
  id_lugar: number;
  id_lugar_padre: number | null;
  nombre: string;
  descripcion: string;
  coordenadas: string | null;
  lugarPadre: any | null;
}

export interface CaracteristicasItemForSelection {
  id_caracteristicas_item: number;
  codigo: string;
  nombre: string;
  marca: string;
  categoria: string;
  descripcion: string;
  imagen: string | null; // Base64 string
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene un item de inventario por ID
   */
  getInventoryItemById(id: number): Observable<InventoryItemResponse> {
    return this.http.get<InventoryItemResponse>(`${this.baseUrl}/items/${id}`);
  }

  /**
   * Crea un nuevo item de inventario
   */
  createInventoryItem(item: InventoryItem): Observable<InventoryItemResponse> {
    const payload = {
      ...item,
      userId: this.getUserId(),
      id_item_estado: Number(item.id_item_estado),
      id_lugar: Number(item.id_lugar),
    };
    console.log(payload);
    return this.http.post<InventoryItemResponse>(`${this.baseUrl}/items`, payload);
  }

  /**
   * Actualiza un item de inventario existente
   */
  updateInventoryItem(id: number, item: InventoryItem): Observable<InventoryItemResponse> {
    const payload = {
      ...item,
      userId: this.getUserId(),
    };
    return this.http.put<InventoryItemResponse>(`${this.baseUrl}/items/${id}`, payload);
  }

  /**
   * Elimina un item de inventario
   */
  deleteInventoryItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${id}?userId=${this.getUserId()}`);
  }

  /**
   * Obtiene todos los items de inventario
   */
  getAllInventoryItems(): Observable<InventoryItemResponse[]> {
    return this.http.get<InventoryItemResponse[]>(`${this.baseUrl}/items`);
  }

  /**
   * Obtiene todos los estados de items
   */
  getAllEstados(): Observable<EstadoItem[]> {
    return this.http.get<EstadoItem[]>(`${this.baseUrl}/estado-item`);
  }

  /**
   * Obtiene todos los lugares
   */
  getAllLugares(): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.baseUrl}/lugares`);
  }

  /**
   * Obtiene todas las características de items para selección
   */
  getAllCaracteristicasForSelection(
    includeImage: boolean = false
  ): Observable<CaracteristicasItemForSelection[]> {
    return this.http.get<CaracteristicasItemForSelection[]>(
      `${this.baseUrl}/caracteristicas-item?includeImage=${includeImage}`
    );
  }

  /**
   * Obtiene una característica específica por ID (para mostrar detalles)
   */
  getCaracteristicaById(
    id: number,
    includeImage: boolean = false
  ): Observable<CaracteristicasItemForSelection> {
    return this.http.get<CaracteristicasItemForSelection>(
      `${this.baseUrl}/caracteristicas-item/${id}?includeImage=${includeImage}`
    );
  }

  /**
   * Obtiene el ID del usuario desde localStorage
   */
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }
}
