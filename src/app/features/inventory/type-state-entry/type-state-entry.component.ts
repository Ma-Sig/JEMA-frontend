import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'app-type-state-entry',
  standalone: true,
  imports: [CommonModule, DropdownComponent, InputFieldComponent, ButtonComponent],
  templateUrl: './type-state-entry.component.html',
  styleUrl: './type-state-entry.component.css',
})
export class TypeStateEntryComponent {
  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() emitDataSelected = new EventEmitter<any>();

  fields: string[] = ['Tipo', 'Estado'];
  selectedField = '';
  selectedData: any = {};
  inputName: string = '';

  close() {
    // console.log('Cerrando modal y emitiendo datos...');
    this.emitDataSelected.emit({
      field: this.selectedField,
      name: this.inputName,
    });

    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
  }

  open() {
    this.isOpen = true;
    this.isOpenChange.emit(this.isOpen);
  }

  onFieldChange(value: string) {
    this.selectedField = value;
  }

  onNameChange(value: string) {
    this.inputName = value;
  }
}
