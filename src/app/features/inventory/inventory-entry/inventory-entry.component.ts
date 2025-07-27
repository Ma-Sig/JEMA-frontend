import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import {
  InventoryService,
  InventoryItem,
  EstadoItem,
  Lugar,
  CaracteristicasItemForSelection,
} from '../services/inventories.service';

@Component({
  selector: 'app-inventory-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-entry.component.html',
  styleUrls: ['./inventory-entry.component.css'],
})
export class InventoryEntryComponent implements OnInit {
  mode: 'create' | 'edit' | 'view' = 'view';
  inventoryItemId?: number;

  // Propiedades del formulario
  codigo: string = '';
  selectedCaracteristicaId: number | null = null;
  selectedEstadoId: number | null = null;
  selectedLugarId: number | null = null;

  // Datos para dropdowns
  estados: EstadoItem[] = [];
  lugares: Lugar[] = [];
  caracteristicasDisponibles: CaracteristicasItemForSelection[] = [];

  // Características seleccionada
  selectedCaracteristica: CaracteristicasItemForSelection | null = null;

  // Estados del componente
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showCaracteristicasModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private inventoryService: InventoryService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const data = await firstValueFrom(this.route.data);
      this.mode = data['mode'] ?? 'view';

      const params = await firstValueFrom(this.route.paramMap);
      const idParam = params.get('id');
      this.inventoryItemId = idParam ? Number(idParam) : undefined;

      // Cargar datos necesarios para dropdowns
      await this.loadDropdownData();

      if ((this.mode === 'edit' || this.mode === 'view') && this.inventoryItemId !== undefined) {
        await this.loadInventoryItemData(this.inventoryItemId);
      }
    } catch (error) {
      console.error('Error al inicializar componente:', error);
      this.errorMessage = 'Error al cargar los datos';
    }
  }

  async loadDropdownData(): Promise<void> {
    try {
      // Cargar estados, lugares y características en paralelo
      const [estados, lugares, caracteristicas] = await Promise.all([
        firstValueFrom(this.inventoryService.getAllEstados()),
        firstValueFrom(this.inventoryService.getAllLugares()),
        firstValueFrom(this.inventoryService.getAllCaracteristicasForSelection(false)),
      ]);

      this.estados = estados;
      this.lugares = lugares;
      this.caracteristicasDisponibles = caracteristicas;
    } catch (error) {
      console.error('Error al cargar datos de dropdowns:', error);
      this.errorMessage = 'Error al cargar las opciones disponibles';
    }
  }

  async loadInventoryItemData(id: number): Promise<void> {
    try {
      const inventoryItem = await firstValueFrom(this.inventoryService.getInventoryItemById(id));

      this.codigo = inventoryItem.codigo;
      this.selectedCaracteristicaId = inventoryItem.id_caracteristicas_item;
      this.selectedEstadoId = inventoryItem.id_item_estado;
      this.selectedLugarId = inventoryItem.id_lugar;

      // Buscar y establecer la característica seleccionada
      this.selectedCaracteristica =
        this.caracteristicasDisponibles.find(
          (c) => c.id_caracteristicas_item === inventoryItem.id_caracteristicas_item
        ) || null;

      // Si no encontramos la característica en la lista, cargarla individualmente
      if (!this.selectedCaracteristica && this.selectedCaracteristicaId) {
        try {
          this.selectedCaracteristica = await firstValueFrom(
            this.inventoryService.getCaracteristicaById(this.selectedCaracteristicaId, false)
          );
        } catch (error) {
          console.warn('No se pudo cargar la característica específica:', error);
        }
      }

      this.errorMessage = '';
    } catch (error) {
      console.error('Error al cargar item de inventario:', error);
      this.errorMessage = 'No se pudo cargar la información del item de inventario';
      Swal.fire('Error', 'No se pudo cargar el item de inventario.', 'error');
    }
  }

  // Modal de características
  openCaracteristicasModal(): void {
    if (this.isReadOnly) return;
    this.showCaracteristicasModal = true;
  }

  closeCaracteristicasModal(): void {
    this.showCaracteristicasModal = false;
    this.selectedCaracteristicaId = this.selectedCaracteristica?.id_caracteristicas_item || null;
  }

  selectCaracteristica(caracteristica: CaracteristicasItemForSelection): void {
    this.selectedCaracteristicaId = caracteristica.id_caracteristicas_item;
  }

  confirmCaracteristicaSelection(): void {
    if (this.selectedCaracteristicaId) {
      this.selectedCaracteristica =
        this.caracteristicasDisponibles.find(
          (c) => c.id_caracteristicas_item === this.selectedCaracteristicaId
        ) || null;
      this.showCaracteristicasModal = false;
      this.clearMessages();
    }
  }

  async saveInventoryItem(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const inventoryItemPayload: InventoryItem = {
        codigo: this.codigo.trim(),
        id_caracteristicas_item: this.selectedCaracteristicaId!,
        id_item_estado: this.selectedEstadoId!,
        id_lugar: this.selectedLugarId!,
      };

      const request$ = this.isCreate
        ? this.inventoryService.createInventoryItem(inventoryItemPayload)
        : this.inventoryService.updateInventoryItem(this.inventoryItemId!, inventoryItemPayload);

      console.log(typeof this.selectedEstadoId);
      await firstValueFrom(request$);

      this.showSuccessToast();
      this.router.navigate(['/inventory/inventories']);
    } catch (error) {
      console.error('Error al guardar item de inventario:', error);
      this.errorMessage = 'No se pudo guardar el item de inventario. Inténtalo de nuevo.';
      Swal.fire('Error', 'No se pudo guardar el item de inventario.', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  private validateForm(): boolean {
    if (!this.codigo.trim()) {
      this.errorMessage = 'El código es obligatorio';
      return false;
    }

    if (!this.selectedCaracteristicaId) {
      this.errorMessage = 'Debe seleccionar las características del item';
      return false;
    }

    if (!this.selectedEstadoId) {
      this.errorMessage = 'Debe seleccionar un estado';
      return false;
    }

    if (!this.selectedLugarId) {
      this.errorMessage = 'Debe seleccionar un lugar';
      return false;
    }

    return true;
  }

  // Getters para el template
  get isReadOnly(): boolean {
    return this.mode === 'view';
  }

  get isEdit(): boolean {
    return this.mode === 'edit';
  }

  get isCreate(): boolean {
    return this.mode === 'create';
  }

  get canSubmit(): boolean {
    return (
      this.codigo.trim() !== '' &&
      this.selectedCaracteristicaId !== null &&
      this.selectedEstadoId !== null &&
      this.selectedLugarId !== null &&
      !this.isSubmitting
    );
  }

  get buttonText(): string {
    if (this.isSubmitting) {
      return 'Guardando...';
    }
    return this.isCreate ? 'Crear Item de Inventario' : 'Actualizar Item de Inventario';
  }

  private showSuccessToast(): void {
    const message = this.isCreate
      ? 'Item de inventario creado con éxito'
      : 'Item de inventario actualizado con éxito';

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  // Método para limpiar mensajes cuando el usuario empiece a escribir
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Método público para navegación desde el template
  navigateToInventory(): void {
    this.router.navigate(['/inventory/inventories']);
  }

  // Método público para navegación desde el template
  navigateToItem(): void {
    this.router.navigate([`/inventory/items/${this.selectedCaracteristicaId}/view`]);
  }
}
