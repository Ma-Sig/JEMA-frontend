import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { CalendarComponent } from '../../../shared/calendar/calendar.component';
import { TableComponent } from '../../../shared/table/table.component';

import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-inventory-entry',
  standalone: true,
  imports: [
    DropdownComponent,
    ButtonComponent,
    CommonModule,
    InputFieldComponent,
    CalendarComponent,
    TableComponent,
  ],
  templateUrl: './inventory-entry.component.html',
  styleUrls: ['./inventory-entry.component.css'],
})
export class InventoryEntryComponent implements OnInit {
  mode: 'create' | 'edit' | 'view' = 'view';
  itemId?: string;
  locations: string[] = [];
  items: string[] = [];
  states: string[] = [];
  selectedLocation = '';
  selectedItem = '';
  selectedState = '';
  baseCode: string = '';
  quantity: string = '';
  selectedDate: Date = new Date();
  regexOnlyNumbers = /^[0-9]+$/;
  regexCodeBase = /^[a-zA-Z0-9-]+$/;
  inventoryData: any[] = [];
  inventoryColumns: any[] = [
    { key: 'id', label: 'codigo' },
    { key: 'item', label: 'item' },
    { key: 'estado', label: 'estado' },
    { key: 'lugar', label: 'lugar' },
    { key: 'fecha', label: 'fecha', type: 'date' },
  ];
  editingRow: boolean = false;
  viewingRow: boolean = false;
  selectedRow: any = null;
  inventoryCount: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const data = await firstValueFrom(this.route.data);
    this.mode = data['mode'] ?? 'view';

    const params = await firstValueFrom(this.route.paramMap);
    this.itemId = params.get('id') ?? undefined;

    this.loadSystemData();

    if (this.mode === 'edit' || this.mode === 'view') {
      this.loadItemData();
    }
  }

  loadItemData() {
    // Simulate loading item data
    this.selectedLocation = 'Aula 1';
    this.selectedItem = 'Item 1';
    this.selectedState = 'Nuevo';
    this.baseCode = 'ABC123';
    // this.quantity = '10';
    this.selectedDate = new Date();
  }

  loadSystemData() {
    this.locations = ['Aula 1', 'Aula 2', 'Aula 3'];
    this.items = ['Item 1', 'Item 2', 'Item 3'];
    this.states = ['Nuevo', 'Usado', 'Dañado'];
  }

  onLocationChange(location: string) {
    this.selectedLocation = location;
  }
  onItemChange(item: string) {
    this.selectedItem = item;
  }
  onStateChange(state: string) {
    this.selectedState = state;
  }
  onCodeBaseChange(baseCode: string) {
    this.baseCode = baseCode;
  }

  onQuantityChange(quantity: string) {
    this.quantity = quantity;
  }

  saveInventory() {
    if (this.mode == 'create' && this.inventoryData.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay datos para guardar.',
      });
      return;
    }

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Inventario guardado con éxito',
      showConfirmButton: false,
      timer: 1500,
    });
    console.log('Guardar en la base de datos');
    this.router.navigate(['/inventory/inventories']);
  }

  validate() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    if (!this.selectedLocation) {
      Toast.fire({
        icon: 'error',
        title: 'Seleccione una ubicación',
      });
      return false;
    }

    if (!this.selectedItem) {
      Toast.fire({
        icon: 'error',
        title: 'Seleccione un item',
      });
      return false;
    }

    if (!this.selectedState) {
      Toast.fire({
        icon: 'error',
        title: 'Seleccione un estado',
      });
      return false;
    }

    if (!this.updateRow && (!this.baseCode || !this.regexCodeBase.test(this.baseCode))) {
      Toast.fire({
        icon: 'error',
        title: 'Ingrese un código base válido (solo letras, números y guiones)',
      });
      return false;
    }

    if (!this.updateRow && (!this.quantity || !this.regexOnlyNumbers.test(this.quantity))) {
      Toast.fire({
        icon: 'error',
        title: 'Ingrese una cantidad válida (solo números)',
      });
      return false;
    }

    return true;
  }

  addToTable() {
    console.log('Agregar a la tabla');
    if (!this.validate()) {
      return;
    }

    const quantity = parseInt(this.quantity, 10);
    for (let i = 0; i < quantity; i++) {
      const inventoryData = {
        id: this.baseCode + '-' + (this.inventoryCount + 1),
        item: this.selectedItem,
        estado: this.selectedState,
        lugar: this.selectedLocation,
        fecha: this.selectedDate,
      };

      this.inventoryData.push(inventoryData);
      this.inventoryCount++;
    }

    this.clearFields();
  }

  clearFields() {
    this.selectedLocation = '';
    this.selectedItem = '';
    this.selectedState = '';
    this.baseCode = '';
    this.quantity = '';
    this.selectedDate = new Date();
  }

  onEditInventory(row: any) {
    this.editingRow = true;
    this.selectedLocation = row.lugar;
    this.selectedItem = row.item;
    this.selectedState = row.estado;
    this.selectedDate = row.fecha;
    this.selectedRow = row;
  }

  updateRow() {
    if (!this.validate()) {
      return;
    }

    this.selectedRow.lugar = this.selectedLocation;
    this.selectedRow.item = this.selectedItem;
    this.selectedRow.estado = this.selectedState;
    this.selectedRow.fecha = this.selectedDate;
    this.editingRow = false;
    this.selectedRow = null;
    this.clearFields();

    Swal.fire('Actualizado!', 'Este elemento ha sido actualizado correctamente.', 'success');
  }

  async onDeleteInventory(row: any) {
    const confirmed = await this.confirmDeletion();

    if (confirmed) {
      this.inventoryData = this.inventoryData.filter((item) => item.id !== row.id);
      console.log('Eliminar en la base de datos:', row.id);
      Swal.fire('Eliminado!', 'Este elemento ha sido eliminado correctamente.', 'success');
    } else {
      Swal.fire('Cancelado', 'La eliminación ha sido cancelada.', 'error');
    }
  }

  async confirmDeletion(): Promise<boolean> {
    const result = await Swal.fire({
      title: '¿Está seguro de eliminar este elemento?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });

    return result.isConfirmed;
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
