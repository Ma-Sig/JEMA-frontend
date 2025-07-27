import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
})
export class InputFieldComponent {
  @Input() placeholder: string = 'Ingrese texto';
  @Input() readonly: boolean = false;
  @Input() value: string = '';
  @Input() regexExp: RegExp = /^[a-zA-ZÀ-ÿ\s]+$/;
  @Input() type: string = 'text';
  @Output() valueChange = new EventEmitter<string>();

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

    if (trimmed.length < 1) {
      this.isValid = false;
      this.validationMessage = 'El nombre debe tener al menos 1 caracter';
      return;
    }

    if (!this.regexExp.test(trimmed)) {
      this.isValid = false;
      this.validationMessage = 'El texto no cumple el formato requerido';
      return;
    }

    this.isValid = true;
    this.validationMessage = this.value !== '' ? 'Campo válido' : '';
  }
}
