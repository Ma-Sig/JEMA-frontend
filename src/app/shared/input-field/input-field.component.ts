import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent {
  @Input() placeholder: string = 'Ingrese texto';
  @Output() valueChange = new EventEmitter<string>();

  value: string = '';
  validationMessage: string = '';
  isValid: boolean | null = null;

  onInputChange(): void {
    this.valueChange.emit(this.value);
    this.validate();
  }

  validate(): void {
    const trimmed = this.value.trim();

    if (trimmed.length === 0) {
      this.isValid = null;
      this.validationMessage = '';
      return;
    }

    if (trimmed.length < 2) {
      this.isValid = false;
      this.validationMessage = 'El nombre debe tener al menos 2 caracteres';
      return;
    }

    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)) {
      this.isValid = false;
      this.validationMessage = 'El nombre solo debe contener letras';
      return;
    }

    this.isValid = true;
    this.validationMessage = 'Nombre válido';
  }
}
