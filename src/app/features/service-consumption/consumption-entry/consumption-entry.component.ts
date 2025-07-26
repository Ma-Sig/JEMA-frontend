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
import { ServiceConsumptionService } from '../services/service-consumption.service';

interface Unit {
  id_unidad: number;
  nombre: string;
}

interface Service {
  id_servicio: number;
  id_unidad: number;
  nombre: string;
  precio: number;
  unidades: Unit;
}

interface LugarPadre {
  id_lugar: number;
  nombre: string;
}

interface Lugar {
  id_lugar: number;
  id_lugar_padre: number;
  nombre: string;
  descripcion: string;
  lugarPadre: LugarPadre;
}

interface ConsumoServicio {
  id_consumo_servicio?: number;
  id_servicio: number;
  id_lugar: number;
  cantidad: number;
  fecha: string;
}

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
  selectedService: Service | null = null;
  selectedLocation = '';
  isServiceModalOpen = false;
  isLocationModalOpen = false;

  services: any[] = [];
  selectedUnit: string = '';
  selectedPricePerUnit: string = '';
  allServices: Service[] = [];
  places: Lugar[] = [];
  selectedPlace: Lugar | null = null;
  servicesConsumption: ConsumoServicio[] = [];

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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceConsumptionService: ServiceConsumptionService
  ) {}

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
    this.serviceConsumptionService.getServices().then((services) => {
      this.allServices = services;
    });
    this.serviceConsumptionService.getLugares().then((lugares) => {
      this.places = lugares;
    });
  }

  loadItemData() {
    console.log('Cargar datos del item con ID:', this.itemId);
    // this.selectedService = 'Agua';
    // this.selectedLocation = 'Aula 1';
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

  onServiceChange(value: any) {
    console.log('Servicio seleccionado:', value);
    this.selectedService = value;
  }

  onLocationChange(value: any): void {
    console.log('Ubicación seleccionada:', value);
    this.selectedPlace = value;
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

    this.serviceConsumptionService
      .createServiceConsumption(this.servicesConsumption)
      .then((response) => {
        this.showToast();
        this.router.navigate(['/service-consumption/list']);
      });
  }

  onEditService(row: any) {
    console.log('Editar servicio:', row);
    this.selectedService =
      this.allServices.find((service) => service.nombre === row.servicio) || null;
    this.selectedPlace = this.places.find((place) => place.nombre === row.lugar) || null;
    this.quantity = row.cantidad;
    this.selectedDate = new Date(row.fecha);
    this.selectedRow = row;
  }

  public updateRow() {
    if (!this.validate()) {
      return;
    }

    this.selectedRow.servicio = this.selectedService?.nombre;
    this.selectedRow.lugar = this.selectedPlace?.nombre;
    this.selectedRow.cantidad = this.quantity;
    this.selectedRow.fecha = this.selectedDate;

    this.servicesConsumption[this.selectedRow.id - 1] = {
      id_servicio: this.selectedService?.id_servicio || 0,
      id_lugar: this.selectedPlace?.id_lugar || 0,
      cantidad: this.toNumber(this.quantity),
      fecha:
        this.selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    };

    this.clearFields();
    this.selectedRow = null;

    Swal.fire('Actualizado!', 'Este elemento ha sido actualizado correctamente.', 'success');
  }

  async onDeleteService(row: any) {
    const confirmed = await this.confirmDeletion();

    if (confirmed) {
      this.tableData = this.tableData.filter((item) => item.id !== row.id);
      this.servicesConsumption.splice(row.id - 1, 1);
      this.consumptionCount--;
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
    console.log('Esto llega desde el modal de servicio', value);
    this.serviceConsumptionService.getServices().then((services) => {
      console.log('Servicios de la DB:', services);
      this.allServices = services;
      console.log('Servicios disponibles:', this.allServices);
    });
  }

  locationModalData(value: any) {
    console.log('Esto llega desde el modal', value);
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
      lugar: this.selectedPlace?.nombre,
      servicio: this.selectedService?.nombre,
      cantidad: this.quantity,
      fecha: this.selectedDate,
    };
    this.tableData.push(newConsumption);

    this.servicesConsumption.push({
      id_servicio: this.selectedService?.id_servicio || 0,
      id_lugar: this.selectedPlace?.id_lugar || 0,
      cantidad: this.toNumber(this.quantity),
      fecha:
        this.selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    });

    this.consumptionCount++;
    this.clearFields();

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: 'success',
      title: 'Consumo agregado a la tabla',
    });
  }

  clearFields() {
    this.selectedPlace = null;
    this.selectedService = null;
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

    if (!this.selectedPlace) {
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

  toNumber(value: string): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
}
