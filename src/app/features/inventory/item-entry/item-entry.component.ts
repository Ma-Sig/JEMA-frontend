import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from 'src/app/shared/input-field/input-field.component';
import { TextareaFieldComponent } from 'src/app/shared/textarea-field/textarea-field.component';

@Component({
  selector: 'app-item-entry',
  standalone: true,
  imports: [
    DropdownComponent,
    ButtonComponent,
    CommonModule,
    InputFieldComponent,
    TextareaFieldComponent,
  ],
  templateUrl: './item-entry.component.html',
  styleUrls: ['./item-entry.component.scss'],
})
export class ItemEntryComponent implements OnInit {
  mode: 'create' | 'edit' | 'view' = 'view';
  itemId?: string;
  selectedPriority = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Leer bandera de la ruta
    this.route.data.subscribe((data) => {
      this.mode = data['mode'] ?? 'view';
    });

    // Leer ID si existe
    this.route.paramMap.subscribe((params) => {
      this.itemId = params.get('id') ?? undefined;
    });
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

  onPriorityChange(value: string) {
    this.selectedPriority = value;
    console.log('Prioridad seleccionada:', value);
  }

  addItem() {
    console.log('Item added!');
  }

  onValueChange(value: string): void {
    console.log('Valor del input: ', value);
  }

  onValueChangeTextarea(value: string): void {
    console.log('Valor del textarea: ', value);
  }
}
