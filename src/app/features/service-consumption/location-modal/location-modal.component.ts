import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { TextareaFieldComponent } from '../../../shared/textarea-field/textarea-field.component';

@Component({
  selector: 'app-location-modal',
  standalone: true,
  imports: [CommonModule, InputFieldComponent, ButtonComponent, TextareaFieldComponent],
  templateUrl: './location-modal.component.html',
  styleUrl: './location-modal.component.css',
})
export class LocationModalComponent {
  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() emitDataSelected = new EventEmitter<any>();

  locationName: string = '';
  description: string = '';

  close() {
    // console.log('Cerrando modal y emitiendo datos...');
    this.emitDataSelected.emit({
      locationName: this.locationName,
      description: this.description,
    });

    // Reset the form fields
    this.locationName = '';
    this.description = '';

    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
  }

  open() {
    this.isOpen = true;
    this.isOpenChange.emit(this.isOpen);
  }

  onLocationNameChange(value: string) {
    this.locationName = value;
  }

  onDescriptionChange(value: string) {
    this.description = value;
  }
}
