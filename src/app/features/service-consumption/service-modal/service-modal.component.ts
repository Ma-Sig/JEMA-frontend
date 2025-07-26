import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { ButtonComponent } from '../../../shared/button/button.component';

import Swal from 'sweetalert2';
import { ModalsService } from '../services/modals.service';

interface Servicio {
  id_servicio?: number;
  id_unidad: number;
  nombre: string;
  precio: number;
}

@Component({
  selector: 'app-service-modal',
  standalone: true,
  imports: [CommonModule, InputFieldComponent, ButtonComponent],
  templateUrl: './service-modal.component.html',
  styleUrl: './service-modal.component.css',
})
export class ServiceModalComponent {
  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() emitDataSelected = new EventEmitter<any>();

  serviceName: string = '';
  unitOfMeasure: string = '';
  price: string = '';

  priceRegex: RegExp = /^[0-9]+(\.[0-9]{1,2})?$/;

  constructor(private modalsService: ModalsService) {}

  public close() {
    if (!this.validate()) {
      return;
    }

    this.modalsService.createUnit({ nombre: this.unitOfMeasure }).then((unitResponse) => {
      console.log('Unidad creada:', unitResponse);
      const unitId = unitResponse.id_unidad;
      this.modalsService
        .createService({
          id_unidad: unitId,
          nombre: this.serviceName,
          precio: parseFloat(this.price),
        })
        .then((serviceResponse) => {
          console.log('Servicio creado:', serviceResponse);
          this.emitDataSelected.emit(serviceResponse);
          // Reset the form fields
          this.serviceName = '';
          this.unitOfMeasure = '';
          this.price = '';

          this.isOpen = false;
          this.isOpenChange.emit(this.isOpen);
        });
    });
  }

  public closeWithoutSave() {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);

    // Reset the form fields
    this.serviceName = '';
    this.unitOfMeasure = '';
    this.price = '';
  }

  validate() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    if (!this.serviceName) {
      Toast.fire({
        icon: 'error',
        title: 'El nombre del servicio es obligatorio',
      });
      return false;
    }
    if (!this.unitOfMeasure) {
      Toast.fire({
        icon: 'error',
        title: 'La unidad de medida es obligatoria',
      });
      return false;
    }
    if (!this.price) {
      Toast.fire({
        icon: 'error',
        title: 'El precio es obligatorio',
      });
      return false;
    }
    if (!this.priceRegex.test(this.price)) {
      Toast.fire({
        icon: 'error',
        title: 'El precio debe ser un número válido',
      });
      return false;
    }
    return true;
  }

  open() {
    this.isOpen = true;
    this.isOpenChange.emit(this.isOpen);
  }

  onServiceNameChange(value: string) {
    this.serviceName = value;
  }

  onUnitOfMeasureChange(value: string) {
    this.unitOfMeasure = value;
  }
  onPriceChange(value: string) {
    this.price = value;
  }
}
