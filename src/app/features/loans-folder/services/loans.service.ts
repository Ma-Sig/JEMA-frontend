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

export interface CaracteristicasItem {
  id_caracteristicas_item: number;
  codigo: string;
  nombre: string;
  marca: string;
  categoria: string;
  descripcion: string;
}

export interface EstadoItem {
  id_item_estado: number;
  estado: string;
}

export interface Item {
  id_item: number;
  id_caracteristicas_item: number;
  id_lugar: number;
  id_item_estado: number;
  codigo: string;
  caracteristicas: CaracteristicasItem;
  estadoItem: EstadoItem;
  selected?: boolean;
}

export interface DropdownOption {
  value: any;
  label: string;
}

export interface PrestamoRequest {
  id_usuario: number;
  id_origen: number;
  id_destino: number;
  items: PrestamoItemRequest[];
}

export interface PrestamoItemRequest {
  id_item: number;
}

export interface Prestamo {
  id_prestamo: number;
  id_usuario: number;
  id_origen: number;
  id_destino: number;
  fecha: string;
  origen?: Lugar;
  destino?: Lugar;
  items?: Item[];
}

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {
  private baseUrl = environment.apiBaseUrl;

  // Subjects para manejar el estado reactivo
  private selectedItemsSubject = new BehaviorSubject<Item[]>([]);
  public selectedItems$ = this.selectedItemsSubject.asObservable();

  // Estados de items para determinar colores
  private estadosColores = {
    Bueno: 'green',
    Nuevo: 'green',
    Viejo: 'yellow',
    Decente: 'yellow',
    Dañado: 'red',
    Prestado: 'red',
    Malo: 'red',
  };

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
   * Obtiene todos los estados de items
   */
  getEstadosItem(): Observable<EstadoItem[]> {
    return this.http.get<EstadoItem[]>(`${this.baseUrl}/estado-item`);
  }

  /**
   * Obtiene todos los préstamos
   */
  getPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.baseUrl}/prestamos`);
  }

  /**
   * Obtiene un préstamo específico por ID
   */
  getPrestamoById(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.baseUrl}/prestamos/${id}`);
  }

  /**
   * Obtiene los items de un préstamo específico
   */
  getItemsByPrestamo(prestamoId: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/prestamos/${prestamoId}/items`);
  }

  /**
   * Crea un nuevo préstamo
   */
  crearPrestamo(prestamoData: PrestamoRequest): Observable<any> {
    const payload = {
      ...prestamoData,
      userId: this.getUserId(),
    };
    console.log('pay', payload);
    return this.http.post(`${this.baseUrl}/prestamos`, payload);
  }

  /**
   * Actualiza un préstamo existente
   */
  actualizarPrestamo(id: number, prestamoData: PrestamoRequest): Observable<any> {
    const payload = {
      ...prestamoData,
      userId: this.getUserId(),
    };
    return this.http.put(`${this.baseUrl}/prestamos/${id}`, payload);
  }

  /**
   * Elimina un préstamo
   */
  eliminarPrestamo(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/prestamos/${id}?userId=${this.getUserId()}`);
  }

  /**
   * Determina el color del estado del item
   */
  getEstadoColor(estado: string): string {
    const estadoLower = estado.toLowerCase();

    if (estadoLower.includes('bueno') || estadoLower.includes('nuevo')) {
      return 'green';
    } else if (estadoLower.includes('viejo') || estadoLower.includes('decente')) {
      return 'yellow';
    } else if (
      estadoLower.includes('dañado') ||
      estadoLower.includes('prestado') ||
      estadoLower.includes('malo')
    ) {
      return 'red';
    }

    return 'blue'; // Color por defecto
  }

  /**
   * Verifica si un item se puede seleccionar (no está prestado ni dañado)
   */
  canSelectItem(item: Item): boolean {
    const estado = item.estadoItem.estado.toLowerCase();
    return !estado.includes('prestado') && !estado.includes('dañado');
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

    if (origenId === destinoId) {
      return {
        isValid: false,
        message: 'Los lugares de origen y destino no pueden ser los mismos',
      };
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
      id_origen: origenId,
      id_destino: destinoId,
      items: selectedItems.map((item) => ({ id_item: item.id_item })),
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
