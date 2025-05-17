import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { TextareaFieldComponent } from '../../../shared/textarea-field/textarea-field.component';
import { UploadImageComponent } from '../../../shared/upload-image/upload-image.component';
import { TypeStateEntryComponent } from '../type-state-entry/type-state-entry.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-entry',
  standalone: true,
  imports: [
    DropdownComponent,
    ButtonComponent,
    CommonModule,
    InputFieldComponent,
    TextareaFieldComponent,
    UploadImageComponent,
    TypeStateEntryComponent,
  ],
  templateUrl: './item-entry.component.html',
  styleUrls: ['./item-entry.component.css'],
})
export class ItemEntryComponent implements OnInit {
  mode: 'create' | 'edit' | 'view' = 'view';
  itemId?: string;
  selectedState = '';
  selectedType = '';
  isModalOpen = false;
  states: string[] = [];
  types: string[] = [];
  name: string = '';
  description: string = '';
  uploadedImage: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.mode = data['mode'] ?? 'view';
    });

    this.route.paramMap.subscribe((params) => {
      this.itemId = params.get('id') ?? undefined;
    });

    this.loadSystemData();
  }

  loadSystemData() {
    this.states = ['Nuevo', 'Usado', 'Dañado'];
    this.types = ['Computador', 'Mueble', 'Herramienta'];
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

  onPriorityChange1(value: string) {
    this.selectedState = value;
    console.log('Prioridad seleccionada:', value);
  }

  onPriorityChange2(value: string) {
    this.selectedType = value;
    console.log('Prioridad seleccionada:', value);
  }

  addItem() {
    console.log('Item added!');
  }

  onNameChange(value: string): void {
    this.name = value;
  }

  onDescriptionChange(value: string): void {
    this.description = value;
  }

  openTypeStateModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onDataSelected(data: any) {
    console.log('onDataSelected');
    console.log('Data selected:', data);
  }

  onStateChange(value: string) {
    console.log('Estado seleccionado:', value);
    this.selectedState = value;
  }

  onTypeChange(value: string): void {
    console.log('Tipo cambiado:', value);
    this.selectedType = value;
  }

  saveItem() {
    if (
      !this.name.trim() ||
      !this.description.trim() ||
      !this.selectedType ||
      !this.selectedState ||
      !this.uploadedImage
    ) {
      console.warn('Por favor, completa todos los campos antes de guardar.');
      console.log('this.name', this.name);
      console.log('this.description', this.description);
      console.log('this.selectedType', this.selectedType);
      console.log('this.selectedState', this.selectedState);
      console.log('this.uploadedImage', this.uploadedImage);
      return;
    }

    this.showToast();
    console.log('Guardar en la base de datos');
    this.router.navigate(['/inventory/items']);
  }

  onImageUploaded(imageData: string | null): void {
    console.log('Imagen subida');
    this.uploadedImage = imageData;
  }

  showToast() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Item guardado con éxito',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  modalData(value: any) {
    console.log('Esto llega desde el modal');
    console.log('modalData', value);
    if (value.field === 'Tipo') {
      this.types.push(value.name);
    } else if (value.field === 'Estado') {
      this.states.push(value.name);
    }
  }
}
