import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './textarea-field.component.html',
  styleUrls: ['./textarea-field.component.css'],
})
export class TextareaFieldComponent {
  @Input() placeholder: string = 'Escribe aquí';
  @Input() readonly: boolean = false;
  @Output() valueChange = new EventEmitter<string>();

  @Input() value: string = '';
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
      this.validationMessage = 'El texto debe tener al menos 2 caracteres';
      return;
    }

    this.isValid = true;
    this.validationMessage = 'Texto válido';
  }
}
