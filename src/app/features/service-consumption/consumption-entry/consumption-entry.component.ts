import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { CalendarComponent } from '../../../shared/calendar/calendar.component';
import { TableComponent } from '../../../shared/table/table.component';

import { LocationModalComponent } from '../location-modal/location-modal.component';
import { ServiceModalComponent } from '../service-modal/service-modal.component';

import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-consumption-entry',
  standalone: true,
  imports: [
    DropdownComponent,
    ButtonComponent,
    CommonModule,
    InputFieldComponent,
    TableComponent,
    LocationModalComponent,
    ServiceModalComponent,
    CalendarComponent,
  ],
  templateUrl: './consumption-entry.component.html',
  styleUrl: './consumption-entry.component.css',
})
export class ConsumptionEntryComponent {
  mode: 'create' | 'edit' | 'view' = 'view';
  itemId?: string;
  selectedService = '';
  selectedLocation = '';
  isServiceModalOpen = false;
  isLocationModalOpen = false;
  services: string[] = [];
  locations: string[] = [];
  name: string = '';
  description: string = '';
  uploadedImage: string | null = null;
  quantity: string = '';
  selectedDate: Date | null = new Date();
  tableData: any[] = [];
  tableColumns: any[] = [
    { key: 'id', label: 'ID' },
    { key: 'lugar', label: 'lugar' },
    { key: 'servicio', label: 'servicio' },
    { key: 'cantidad', label: 'cantidad' },
    { key: 'fecha', label: 'fecha', type: 'date' },
  ];
  selectedRow: any = null;
  quantityRegex: RegExp = /^[0-9]+(\.[0-9]{1,2})?$/;
  consumptionCount: number = 0;
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

  loadSystemData() {
    this.services = ['Agua', 'Luz', 'Gas'];
    this.locations = ['Aula 1', 'Aula 2', 'Aula 3'];
  }

  loadItemData() {
    console.log('Cargar datos del item con ID:', this.itemId);
    this.selectedService = 'Agua';
    this.selectedLocation = 'Aula 1';
    this.quantity = '10';
    this.selectedDate = new Date();
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

  addItem() {
    console.log('Item added!');
  }

  onQuantityChange(value: string) {
    console.log('Cantidad seleccionada:', value);
    this.quantity = value;
  }

  onNameChange(value: string): void {
    this.name = value;
  }

  onDescriptionChange(value: string): void {
    this.description = value;
  }

  openServiceModal() {
    this.isServiceModalOpen = true;
  }

  openLocationModal() {
    this.isLocationModalOpen = true;
  }

  closeServiceModal() {
    this.isServiceModalOpen = false;
  }

  closeLocationModal() {
    this.isLocationModalOpen = false;
  }

  onDataSelected(data: any) {
    console.log('onDataSelected');
    console.log('Data selected:', data);
  }

  onServiceChange(value: string) {
    console.log('Estado seleccionado:', value);
    this.selectedService = value;
  }

  onLocationChange(value: string): void {
    console.log('Tipo cambiado:', value);
    this.selectedLocation = value;
  }

  saveConsumption() {
    if (this.mode == 'create' && this.tableData.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay datos para guardar.',
      });
      return;
    }

    if (this.mode == 'edit' && !this.validate()) {
      return;
    }

    this.showToast();
    console.log('Guardar en la base de datos');
    this.router.navigate(['/service-consumption/list']);
  }

  onEditService(row: any) {
    console.log('Editar servicio:', row);
    this.selectedService = row.servicio;
    this.selectedLocation = row.lugar;
    this.quantity = row.cantidad;
    this.selectedDate = new Date(row.fecha);
    this.selectedRow = row;
  }

  updateRow() {
    if (!this.validate()) {
      return;
    }

    this.selectedRow.servicio = this.selectedService;
    this.selectedRow.lugar = this.selectedLocation;
    this.selectedRow.cantidad = this.quantity;
    this.selectedRow.fecha = this.selectedDate;
    this.clearFields();
    this.selectedRow = null;

    Swal.fire('Actualizado!', 'Este elemento ha sido actualizado correctamente.', 'success');
  }

  async onDeleteService(row: any) {
    const confirmed = await this.confirmDeletion();

    if (confirmed) {
      this.tableData = this.tableData.filter((item) => item.id !== row.id);
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

  serviceModalData(value: any) {
    console.log('Esto llega desde el modal');
    console.log('serviceModalData', value);
    this.services.push(value.serviceName);
  }

  locationModalData(value: any) {
    console.log('Esto llega desde el modal');
    console.log('locationModalData', value);
    this.locations.push(value.locationName);
  }

  showToast() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Consumo guardado con éxito',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  addToTable() {
    if (!this.validate()) {
      console.warn('Por favor, completa todos los campos antes de agregar.');
      return;
    }

    const newConsumption = {
      id: this.consumptionCount + 1,
      lugar: this.selectedLocation,
      servicio: this.selectedService,
      cantidad: this.quantity,
      fecha: this.selectedDate,
    };
    this.tableData.push(newConsumption);
    this.consumptionCount++;
    this.clearFields();
  }

  clearFields() {
    this.selectedLocation = '';
    this.selectedService = '';
    this.quantity = '';
    this.selectedDate = new Date();
  }

  validate() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    if (!this.selectedService) {
      Toast.fire({
        icon: 'error',
        title: 'Seleccione un servicio',
      });
      return false;
    }

    if (!this.selectedLocation) {
      Toast.fire({
        icon: 'error',
        title: 'Seleccione una ubicación',
      });
      return false;
    }

    if (!this.quantity) {
      Toast.fire({
        icon: 'error',
        title: 'Ingrese una cantidad',
      });
      return false;
    }

    if (!this.selectedDate) {
      Toast.fire({
        icon: 'error',
        title: 'Seleccione una fecha',
      });
      return false;
    }

    return true;
  }

  modalData(value: any) {
    console.log('Esto llega desde el modal');
    console.log('modalData', value);
    if (value.field === 'Tipo') {
      this.locations.push(value.name);
    } else if (value.field === 'Estado') {
      this.services.push(value.name);
    }
  }
}
