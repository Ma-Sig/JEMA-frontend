import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { CalendarComponent } from '../../../shared/calendar/calendar.component';

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
    this.quantity = '10';
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

  saveInventory() {
    console.log('Guardar inventario');
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

    if (!this.baseCode || !this.regexCodeBase.test(this.baseCode)) {
      Toast.fire({
        icon: 'error',
        title: 'Ingrese un código base válido (solo letras, números y guiones)',
      });
      return false;
    }

    if (!this.quantity || !this.regexOnlyNumbers.test(this.quantity)) {
      console.log('Primer if', !this.quantity);
      console.log('Segundo if', !this.regexOnlyNumbers.test(this.quantity));
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

    const inventoryData = {
      location: this.selectedLocation,
      item: this.selectedItem,
      state: this.selectedState,
      baseCode: this.baseCode,
      quantity: this.quantity,
      date: this.selectedDate,
    };

    console.log('Datos del inventario:', inventoryData);
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
