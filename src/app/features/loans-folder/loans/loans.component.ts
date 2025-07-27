// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
// import { CheckListComponent } from '../../../shared/check-list/check-list.component';
// import { ButtonComponent } from '../../../shared/button/button.component';

// import Swal from 'sweetalert2';
// import { firstValueFrom } from 'rxjs';

// @Component({
//   selector: 'app-loans',
//   imports: [DropdownComponent, CheckListComponent,CommonModule,ButtonComponent],
//   templateUrl: './loans.component.html',
//   styleUrl: './loans.component.css',
// })
// export class LoansComponent {
//   mode: 'create' | 'edit' | 'view' = 'view';
//   itemId?: string;
//   states: string[] = [];
//   selectedState = '';
//   selectedType = '';
//   types: string[] = [];
//   name: string = '';
//   description: string = '';
//   isModalOpen = false;

//   constructor(private route: ActivatedRoute, private router: Router) {}

//   placesOriginOptions: string[] = [];
//   itemOptions: string[] = [];
//   placesDestinationOptions: string[] = [];
//   selectedPlace: string = "";

//   placesData = [
//     {
//       campus: "Balzay",
//       aula: "Laboratorio HCI"
//     },
//     {
//       campus: "Balzay",
//       aula: "Laboratorio de Redes"
//     },
//     {
//       campus: "Balzay",
//       aula: "C105"
//     },
//     {
//       campus: "Balzay",
//       aula: "C106"
//     },
//   ];

//   itemTypesData = ["Pc Imac", "Proyector"]

//   itemsData = {
//     'Laboratorio HCI': [
//       {id: 1234, tipo: "PC Imac", estado: "bueno"},
//       {id: 1235, tipo: "PC Imac", estado: "bueno"},
//       {id: 1236, tipo: "PC Imac", estado: "bueno"},
//       {id: 1237, tipo: "PC Imac", estado: "bueno"},
//       {id: 1238, tipo: "PC Imac", estado: "bueno"}
//     ]
//   }

//   async ngOnInit(): Promise<void> {
//       const data = await firstValueFrom(this.route.data);
//       this.mode = data['mode'] ?? 'view';

//       const params = await firstValueFrom(this.route.paramMap);
//       this.itemId = params.get('id') ?? undefined;

//       this.loadSystemData();

//       if (this.mode === 'edit' || this.mode === 'view') {
//         this.loadItemData();
//       }
//     }

//   loadItemData() {
//     console.log('Cargar datos del item con ID:', this.itemId);
//     this.placesOriginOptions = this.placesData.map((place) => place.aula);
//     this.placesDestinationOptions = this.placesData.map((place) => place.aula);
//     this.itemOptions = this.itemsData['Laboratorio HCI'].map((item) => item.tipo);
//   }
//   loadSystemData() {
//     this.states = ['Nuevo', 'Usado', 'Dañado'];
//     this.types = ['Computador', 'Mueble', 'Herramienta'];
//   }
//   get isReadOnly(): boolean {
//       return this.mode === 'view';
//     }

//     get isEdit(): boolean {
//       return this.mode === 'edit';
//     }

//     get isCreate(): boolean {
//       return this.mode === 'create';
//     }

//     onPriorityChange1(value: string) {
//       this.selectedState = value;
//       console.log('Prioridad seleccionada:', value);
//     }

//     onPriorityChange2(value: string) {
//       this.selectedType = value;
//       console.log('Prioridad seleccionada:', value);
//     }

//     addItem() {
//       console.log('Item added!');
//     }

//     onNameChange(value: string): void {
//       this.name = value;
//     }

//     onDescriptionChange(value: string): void {
//       this.description = value;
//     }

//     openTypeStateModal() {
//       this.isModalOpen = true;
//     }

//     closeModal() {
//       this.isModalOpen = false;
//     }

//     onDataSelected(data: any) {
//       console.log('onDataSelected');
//       console.log('Data selected:', data);
//     }

//     onStateChange(value: string) {
//       console.log('Estado seleccionado:', value);
//       this.selectedState = value;
//     }

//     onTypeChange(value: string): void {
//       console.log('Tipo cambiado:', value);
//       this.selectedType = value;
//     }

//     saveItem() {
//       if (
//         !this.name.trim() ||
//         !this.description.trim() ||
//         !this.selectedType ||
//         !this.selectedState
//       ) {
//         console.warn('Por favor, completa todos los campos antes de guardar.');
//         console.log('this.name', this.name);
//         console.log('this.description', this.description);
//         console.log('this.selectedType', this.selectedType);
//         console.log('this.selectedState', this.selectedState);
//         return;
//       }

//       this.showToast();
//       console.log('Guardar en la base de datos');
//       this.router.navigate(['/inventory/items']);
//     }

//     showToast() {
//       Swal.fire({
//         toast: true,
//         position: 'top-end',
//         icon: 'success',
//         title: 'Item guardado con éxito',
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     }

//     modalData(value: any) {
//       console.log('Esto llega desde el modal');
//       console.log('modalData', value);
//       if (value.field === 'Tipo') {
//         this.types.push(value.name);
//       } else if (value.field === 'Estado') {
//         this.states.push(value.name);
//       }
//     }
//     showAlert() {
//   Swal.fire({
//     title: '¿Deseas registrar este préstamo?',
//     icon: 'question',
//     showCancelButton: true,
//     confirmButtonText: 'Sí, continuar',
//     cancelButtonText: 'Cancelar'
//   }).then((result) => {
//     if (result.isConfirmed) {
//       Swal.fire('¡Hecho!', 'El registro se realizó correctamente.', 'success');
//     } else if (result.dismiss === Swal.DismissReason.cancel) {
//       Swal.fire('Cancelado', 'No se realizó ninguna acción', 'error');
//     }
//   });
//   }
// }

// prestamo.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';
import { PrestamoService, Lugar, Item, DropdownOption } from '../services/loans.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loans',
  imports: [FormsModule, NgIf, CommonModule, HttpClientModule],
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
})
export class LoansComponent implements OnInit, OnDestroy {
  mode: 'create' | 'edit' | 'view' = 'view';
  idPrestamo: string | undefined = undefined;

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
  isSubmitting = false;

  // Mensajes
  errorMessage = '';
  successMessage = '';

  // Subject para manejar unsubscriptions
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private prestamoService: PrestamoService) {}

  async ngOnInit() {
    const data = await firstValueFrom(this.route.data);
    this.mode = data['mode'] ?? 'view';

    const params = await firstValueFrom(this.route.paramMap);
    this.idPrestamo = params.get('id') ?? undefined;

    this.loadPlaces();
    this.subscribeToSelectedItems();
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
    if (this.selectedItems.length > 0) {
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
    this.clearItemSelection();
    this.loadItems(placeId);
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
          this.loadingItems = false;
        },
        error: (error) => {
          this.errorMessage = this.prestamoService.handleError(error);
          this.loadingItems = false;
        },
      });
  }

  /**
   * Alternar selección de un item
   */
  toggleItemSelection(item: Item): void {
    if (this.isReadOnly || item.id_item_estado !== 1) return;

    item.selected = !item.selected;
    this.prestamoService.updateSelectedItems(this.items);
    this.clearMessages();
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
      !this.loadingPlaces
    );
  }

  /**
   * Realizar el préstamo
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

    // Enviar solicitud
    this.isSubmitting = true;
    this.prestamoService
      .crearPrestamo(prestamoData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.successMessage = 'Préstamo registrado exitosamente';
          this.resetForm();
          this.isSubmitting = false;
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
}
