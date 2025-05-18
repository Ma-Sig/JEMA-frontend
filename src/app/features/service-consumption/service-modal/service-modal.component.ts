import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { ButtonComponent } from '../../../shared/button/button.component';

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

  close() {
    // console.log('Cerrando modal y emitiendo datos...');
    this.emitDataSelected.emit({
      serviceName: this.serviceName,
      unitOfMeasure: this.unitOfMeasure,
      price: this.price,
    });

    // Reset the form fields
    this.serviceName = '';
    this.unitOfMeasure = '';
    this.price = '';

    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
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
