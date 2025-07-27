// prestamo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Lugar {
  id_lugar: number;
  id_lugar_padre: number | null;
  nombre: string;
  descripcion: string;
  lugarPadre: {
    id_lugar: number;
    nombre: string;
  } | null;
}

export interface Item {
  id_item: number;
  id_lugar: number;
  nombre: string;
  id_item_estado: number;
  codigo: string;
  imagen: string | null;
  selected?: boolean;
}

export interface DropdownOption {
  value: any;
  label: string;
}

export interface PrestamoRequest {
  id_usuario: number;
  id_lugar_origen: number;
  id_lugar_destino: number;
  items: number[];
}

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {
  private baseUrl = environment.apiBaseUrl;

  // Subjects para manejar el estado reactivo
  private selectedItemsSubject = new BehaviorSubject<Item[]>([]);
  public selectedItems$ = this.selectedItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los lugares disponibles
   */
  getLugares(): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.baseUrl}/lugares`);
  }

  /**
   * Obtiene los items de un lugar específico
   */
  getItemsByLugar(lugarId: number): Observable<Item[]> {
    return this.http
      .get<Item[]>(`${this.baseUrl}/items/lugar/${lugarId}`)
      .pipe(map((items) => items.map((item) => ({ ...item, selected: false }))));
  }

  /**
   * Convierte la lista de lugares en opciones para dropdown
   */
  convertLugaresToDropdownOptions(lugares: Lugar[]): DropdownOption[] {
    return lugares.map((lugar) => ({
      value: lugar.id_lugar,
      label: lugar.lugarPadre ? `${lugar.lugarPadre.nombre} - ${lugar.nombre}` : lugar.nombre,
    }));
  }

  /**
   * Filtra lugares excluyendo el lugar de origen
   */
  getDestinationOptions(lugares: Lugar[], origenId: number | null): DropdownOption[] {
    const filteredLugares = lugares.filter((lugar) => lugar.id_lugar !== origenId);
    return this.convertLugaresToDropdownOptions(filteredLugares);
  }

  /**
   * Actualiza la lista de items seleccionados
   */
  updateSelectedItems(items: Item[]): void {
    const selectedItems = items.filter((item) => item.selected);
    this.selectedItemsSubject.next(selectedItems);
  }

  /**
   * Obtiene la lista actual de items seleccionados
   */
  getSelectedItems(): Item[] {
    return this.selectedItemsSubject.value;
  }

  /**
   * Limpia la selección de items
   */
  clearSelectedItems(): void {
    this.selectedItemsSubject.next([]);
  }

  /**
   * Obtiene el ID del usuario desde localStorage
   */
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * Crea un nuevo préstamo
   */
  crearPrestamo(prestamoData: PrestamoRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/prestamos`, prestamoData);
  }

  /**
   * Valida si los datos del préstamo están completos
   */
  validatePrestamoData(
    origenId: number | null,
    destinoId: number | null,
    selectedItems: Item[]
  ): { isValid: boolean; message?: string } {
    if (!origenId) {
      return { isValid: false, message: 'Debe seleccionar un lugar de origen' };
    }

    if (!destinoId) {
      return { isValid: false, message: 'Debe seleccionar un lugar de destino' };
    }

    if (selectedItems.length === 0) {
      return { isValid: false, message: 'Debe seleccionar al menos un item' };
    }

    const userId = this.getUserId();
    if (!userId) {
      return {
        isValid: false,
        message: 'Usuario no encontrado. Por favor inicia sesión nuevamente.',
      };
    }

    return { isValid: true };
  }

  /**
   * Prepara los datos del préstamo para enviar al servidor
   */
  preparePrestamoData(
    origenId: number,
    destinoId: number,
    selectedItems: Item[]
  ): PrestamoRequest | null {
    const userId = this.getUserId();
    if (!userId) return null;

    return {
      id_usuario: userId,
      id_lugar_origen: origenId,
      id_lugar_destino: destinoId,
      items: selectedItems.map((item) => item.id_item),
    };
  }

  /**
   * Maneja errores de HTTP y devuelve mensajes amigables
   */
  handleError(error: any): string {
    console.error('Error en PrestamoService:', error);

    if (error.status === 0) {
      return 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
    } else if (error.status >= 400 && error.status < 500) {
      return error.error?.message || 'Error en la solicitud. Verifica los datos ingresados.';
    } else if (error.status >= 500) {
      return 'Error interno del servidor. Inténtalo más tarde.';
    }

    return 'Ocurrió un error inesperado. Inténtalo nuevamente.';
  }
}
