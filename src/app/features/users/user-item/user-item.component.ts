import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { TextareaFieldComponent } from '../../../shared/textarea-field/textarea-field.component';
import { UploadImageComponent } from '../../../shared/upload-image/upload-image.component';
// import { TypeStateEntryComponent } from '../type-state-entry/type-state-entry.component';

import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-item',
  imports: [
    ButtonComponent,
    CommonModule,
    InputFieldComponent,
    // TypeStateEntryComponent,
  ],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.css',
})
export class UserItemComponent implements OnInit {
  mode: 'create' | 'edit' | 'view' = 'view';
  username?: string;
  name: string = '';
  surname: string = '';
  idNumber: string = '';
  email: string = '';
  password: string = '';
  uploadedImage: string | null =
    'https://t3.ftcdn.net/jpg/00/92/53/56/360_F_92535664_IvFsQeHjBzfE6sD4VHdO8u5OHUSc6yHF.jpg';

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const data = await firstValueFrom(this.route.data);
    this.mode = data['mode'] ?? 'view';

    const params = await firstValueFrom(this.route.paramMap);
    this.username = params.get('username') ?? undefined;

    if (this.mode === 'edit' || this.mode === 'view') {
      this.loadItemData();
    }
  }

  loadItemData() {
    console.log('Cargar datos del usuario con username:', this.username);
    this.name = 'Item de ejemplo';
    this.surname = 'Item de ejemplo';
    this.idNumber = 'Item de ejemplo';
    this.email = 'Item de ejemplo';
    this.password = 'Item de ejemplo';
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

  addItem() {
    console.log('Item added!');
  }

  onNameChange(value: string): void {
    this.name = value;
  }

  onSurnameChange(value: string): void {
    this.surname = value;
  }

  onIdNumberChange(value: string): void {
    this.idNumber = value;
  }

  onEmailChange(value: string): void {
    this.email = value;
  }

  onPasswordChange(value: string): void {
    this.name = value;
  }

  saveItem() {
    if (
      !this.name.trim() ||
      !this.surname.trim() ||
      !this.email ||
      !this.idNumber ||
      !this.password
    ) {
      console.warn('Por favor, completa todos los campos antes de guardar.');
      console.log('this.name', this.name);
      console.log('this.description', this.surname);
      console.log('this.selectedType', this.email);
      console.log('this.selectedState', this.idNumber);
      console.log('this.uploadedImage', this.password);
      return;
    }

    this.showToast();
    console.log('Guardar en la base de datos');
    this.router.navigate(['/users']);
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
}
