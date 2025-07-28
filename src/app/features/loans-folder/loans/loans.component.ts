// prestamo.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';
import { PrestamoService, Lugar, Item, DropdownOption, Prestamo } from '../services/loans.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-loans',
  imports: [FormsModule, NgIf, CommonModule, HttpClientModule],
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
})
export class LoansComponent implements OnInit, OnDestroy {
  mode: 'create' | 'edit' | 'view' = 'view';
  idPrestamo: string | undefined = undefined;
  prestamo: Prestamo | null = null;

  // Datos y opciones
  lugares: Lugar[] = [];
  placesOptions: DropdownOption[] = [];
  items: Item[] = [];
  selectedItems: Item[] = [];

  // Valores seleccionados
  selectedOriginPlace: number | null = null;
  selectedConfirmedOriginPlace: number | null = null;
  selectedDestinationPlace: number | null = null;

  // Estados de carga
  loadingPlaces = false;
  loadingItems = false;
  loadingPrestamo = false;
  isSubmitting = false;

  // Mensajes
  errorMessage = '';
  successMessage = '';

  // Subject para manejar unsubscriptions
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prestamoService: PrestamoService
  ) {}

  async ngOnInit() {
    const data = await firstValueFrom(this.route.data);
    this.mode = data['mode'] ?? 'view';

    const params = await firstValueFrom(this.route.paramMap);
    this.idPrestamo = params.get('id') ?? undefined;

    this.loadPlaces();
    this.subscribeToSelectedItems();

    // Si es modo editar o ver, cargar datos del préstamo
    if ((this.mode === 'edit' || this.mode === 'view') && this.idPrestamo) {
      this.loadPrestamoData();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Suscribirse a los cambios en items seleccionados
   */
  private subscribeToSelectedItems(): void {
    this.prestamoService.selectedItems$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      this.selectedItems = items;
    });
  }

  /**
   * Cargar datos del préstamo (para editar o ver)
   */
  private loadPrestamoData(): void {
    if (!this.idPrestamo) return;

    this.loadingPrestamo = true;
    const prestamoId = parseInt(this.idPrestamo, 10);

    this.prestamoService
      .getPrestamoById(prestamoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prestamo) => {
          this.prestamo = prestamo;
          this.selectedOriginPlace = prestamo.id_origen;
          this.selectedDestinationPlace = prestamo.id_destino;
          this.selectedConfirmedOriginPlace = prestamo.id_origen;

          if (this.mode === 'view') {
            // En modo vista, cargar solo los items del préstamo
            this.loadPrestamoItems(prestamoId);
          } else {
            // En modo editar, cargar todos los items del lugar origen
            this.loadItems(prestamo.id_origen);
          }

          this.loadingPrestamo = false;
        },
        error: (error) => {
          this.errorMessage = this.prestamoService.handleError(error);
          this.loadingPrestamo = false;
        },
      });
  }

  /**
   * Cargar items específicos del préstamo (para modo vista)
   */
  private loadPrestamoItems(prestamoId: number): void {
    this.loadingItems = true;

    this.prestamoService
      .getItemsByPrestamo(prestamoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.items = items.map((item) => ({ ...item, selected: true }));
          this.prestamoService.updateSelectedItems(this.items);
          this.loadingItems = false;
        },
        error: (error) => {
          this.errorMessage = this.prestamoService.handleError(error);
          this.loadingItems = false;
        },
      });
  }

  /**
   * Cargar la lista de lugares
   */
  loadPlaces(): void {
    this.loadingPlaces = true;
    this.errorMessage = '';

    this.prestamoService
      .getLugares()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lugares) => {
          this.lugares = lugares;
          this.placesOptions = this.prestamoService.convertLugaresToDropdownOptions(lugares);
          this.loadingPlaces = false;
        },
        error: (error) => {
          this.errorMessage = this.prestamoService.handleError(error);
          this.loadingPlaces = false;
        },
      });
  }

  /**
   * Manejar cambio en el lugar de origen
   */
  onOriginPlaceChange(placeId: number): void {
    if (placeId === this.selectedDestinationPlace) {
      setTimeout(() => {
        this.selectedDestinationPlace = null;
      }, 0);
    }

    // Si hay items seleccionados y está cambiando el lugar, preguntar confirmación
    if (this.selectedItems.length > 0 && this.mode !== 'view') {
      const confirmed = confirm(
        'Cambiar el lugar de origen eliminará la selección actual de items. ¿Deseas continuar?'
      );
      if (!confirmed) {
        setTimeout(() => (this.selectedOriginPlace = this.selectedConfirmedOriginPlace), 0);
        return;
      }
    }

    this.selectedConfirmedOriginPlace = this.selectedOriginPlace;
    this.clearMessages();

    if (this.mode !== 'view') {
      this.clearItemSelection();
      this.loadItems(placeId);
    }
  }

  /**
   * Manejar cambio en el lugar de destino
   */
  onDestinationPlaceChange(placeId: number): void {
    if (placeId === this.selectedOriginPlace) {
      setTimeout(() => {
        this.selectedDestinationPlace = null;
      }, 0);

      this.errorMessage = 'Los lugares de origen y destino no pueden ser los mismos.';
      return;
    }

    this.clearMessages();
  }

  /**
   * Cargar items de un lugar
   */
  private loadItems(placeId: number): void {
    this.loadingItems = true;
    this.errorMessage = '';

    this.prestamoService
      .getItemsByLugar(placeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.items = items;

          // Si estamos en modo editar y hay un préstamo cargado, marcar items seleccionados
          if (this.mode === 'edit' && this.prestamo) {
            this.loadPrestamoItemsForEdit();
          }

          this.loadingItems = false;
        },
        error: (error) => {
          this.errorMessage = this.prestamoService.handleError(error);
          this.loadingItems = false;
        },
      });
  }

  /**
   * Cargar items del préstamo para modo editar
   */
  private loadPrestamoItemsForEdit(): void {
    if (!this.idPrestamo) return;

    const prestamoId = parseInt(this.idPrestamo, 10);

    this.prestamoService
      .getItemsByPrestamo(prestamoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prestamoItems) => {
          const prestamoItemIds = prestamoItems.map((item) => item.id_item);

          // Marcar como seleccionados los items que están en el préstamo
          this.items.forEach((item) => {
            item.selected = prestamoItemIds.includes(item.id_item);
          });

          this.prestamoService.updateSelectedItems(this.items);
        },
        error: (error) => {
          console.error('Error cargando items del préstamo:', error);
        },
      });
  }

  /**
   * Alternar selección de un item
   */
  toggleItemSelection(item: Item): void {
    if (this.isReadOnly || !this.prestamoService.canSelectItem(item)) return;

    item.selected = !item.selected;
    this.prestamoService.updateSelectedItems(this.items);
    this.clearMessages();
  }

  /**
   * Obtener el color del estado del item
   */
  getEstadoColor(item: Item): string {
    return this.prestamoService.getEstadoColor(item.estadoItem.estado);
  }

  /**
   * Verificar si un item se puede seleccionar
   */
  canSelectItem(item: Item): boolean {
    return this.prestamoService.canSelectItem(item);
  }

  /**
   * Obtener las clases CSS para las tarjetas de items
   */
  getItemCardClasses(item: Item): string {
    let classes = '';

    if (item.selected) {
      classes += 'border-[#4880FF] bg-blue-50 ';
    } else {
      classes += 'border-gray-300 ';
    }

    if (!this.canSelectItem(item) || this.isReadOnly) {
      classes += 'opacity-50 ';
    }

    return classes.trim();
  }

  /**
   * Limpiar selección de items
   */
  private clearItemSelection(): void {
    this.items.forEach((item) => (item.selected = false));
    this.prestamoService.clearSelectedItems();
  }

  /**
   * Verificar si se puede enviar el formulario
   */
  get canSubmit(): boolean {
    return !!(
      this.selectedOriginPlace &&
      this.selectedDestinationPlace &&
      this.selectedItems.length > 0 &&
      !this.loadingItems &&
      !this.loadingPlaces &&
      !this.loadingPrestamo
    );
  }

  /**
   * Realizar el préstamo (crear o actualizar)
   */
  realizarPrestamo(): void {
    this.clearMessages();

    // Validar datos
    const validation = this.prestamoService.validatePrestamoData(
      this.selectedOriginPlace,
      this.selectedDestinationPlace,
      this.selectedItems
    );

    if (!validation.isValid) {
      this.errorMessage = validation.message!;
      return;
    }

    // Preparar datos
    const prestamoData = this.prestamoService.preparePrestamoData(
      this.selectedOriginPlace!,
      this.selectedDestinationPlace!,
      this.selectedItems
    );

    if (!prestamoData) {
      this.errorMessage = 'Error al preparar los datos del préstamo';
      return;
    }

    console.log(prestamoData);

    // Determinar si crear o actualizar
    this.isSubmitting = true;
    const operation =
      this.mode === 'edit' && this.idPrestamo
        ? this.prestamoService.actualizarPrestamo(parseInt(this.idPrestamo, 10), prestamoData)
        : this.prestamoService.crearPrestamo(prestamoData);

    operation.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        const mensaje =
          this.mode === 'edit'
            ? 'Préstamo actualizado exitosamente'
            : 'Préstamo registrado exitosamente';

        this.successMessage = mensaje;

        if (this.mode === 'create') {
          this.resetForm();
        }

        this.isSubmitting = false;

        // Opcional: redirigir después de un tiempo
        setTimeout(() => {
          this.router.navigate(['/loans']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = this.prestamoService.handleError(error);
        this.isSubmitting = false;
      },
    });
  }

  /**
   * Eliminar préstamo
   */
  eliminarPrestamo(): void {
    if (!this.idPrestamo) return;

    const confirmed = confirm('¿Estás seguro de que deseas eliminar este préstamo?');
    if (!confirmed) return;

    this.isSubmitting = true;
    const prestamoId = parseInt(this.idPrestamo, 10);

    this.prestamoService
      .eliminarPrestamo(prestamoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Préstamo eliminado exitosamente';
          this.isSubmitting = false;

          setTimeout(() => {
            this.router.navigate(['/loans']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = this.prestamoService.handleError(error);
          this.isSubmitting = false;
        },
      });
  }

  /**
   * Resetear el formulario
   */
  private resetForm(): void {
    this.selectedOriginPlace = null;
    this.selectedDestinationPlace = null;
    this.selectedConfirmedOriginPlace = null;
    this.clearItemSelection();
    this.items = [];
  }

  /**
   * Limpiar mensajes de error y éxito
   */
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Método legacy para compatibilidad
  showAlert(): void {
    this.realizarPrestamo();
  }

  get isReadOnly(): boolean {
    return this.mode === 'view';
  }

  get isEdit(): boolean {
    return this.mode === 'edit';
  }

  get isCreate(): boolean {
    return this.mode === 'create';
  }

  get actionButtonText(): string {
    if (this.isSubmitting) {
      return this.mode === 'edit' ? 'Actualizando...' : 'Procesando...';
    }
    return this.mode === 'edit' ? 'Actualizar Préstamo' : 'Realizar Préstamo';
  }
}
