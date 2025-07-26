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
import { UserService } from '../user.service'; 

@Component({
  selector: 'app-user-item',
  imports: [
    ButtonComponent,
    CommonModule,
    InputFieldComponent,
    UploadImageComponent, 
    // TypeStateEntryComponent,
  ],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.css',
})
export class UserItemComponent implements OnInit {
  mode: 'create' | 'edit' | 'view' = 'view';
  userId?: number;
  name: string = '';
  surname: string = '';
  idNumber: string = '';
  email: string = '';
  password: string = '';
  cellphone: string = '';
  uploadedImageFile: string | null = null;
  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    const data = await firstValueFrom(this.route.data);
    this.mode = data['mode'] ?? 'view';

    const params = await firstValueFrom(this.route.paramMap);
    const idParam = params.get('id');
    this.userId = idParam ? Number(idParam) : undefined;

    if ((this.mode === 'edit' || this.mode === 'view') && this.userId !== undefined) {
      this.loadItemData(this.userId);
    }
  }

  loadItemData(id: number) {
  this.userService.getUserById(id).subscribe({
    next: async (user) => {
      this.name = user.nombres;
      this.surname = user.apellidos;
      this.idNumber = user.cedula;
      this.email = user.email;
      this.password = '';

      if (user.imagen) {
        const blob = this.bufferToBlob(user.imagen.data);
        this.uploadedImageFile = await this.convertBlobToBase64(blob);
      } else {
        this.uploadedImageFile = null;
      }
    },
    error: (err) => {
      console.error('Error al cargar usuario', err);
      Swal.fire('Error', 'No se pudo cargar el usuario.', 'error');
    }
  });
}
  convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result?.toString();
      const base64 = result?.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

bufferToBlob(bufferData: number[]): Blob {
  const byteArray = new Uint8Array(bufferData);
  return new Blob([byteArray], { type: 'image/jpeg' });
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
    this.password = value;
  }

  async saveItem() {
  if (!this.name.trim() || !this.surname.trim() || !this.email.trim() || !this.idNumber.trim() || (this.isCreate && !this.password.trim())) {
    Swal.fire('Error', 'Completa todos los campos.', 'warning');
    return;
  }

  const userPayload: any = {
    nombres: this.name,
    apellidos: this.surname,
    cedula: this.idNumber,
    email: this.email,
    celular: this.cellphone,
  };

  // Convertir base64 → ArrayBuffer si hay imagen
  if (this.uploadedImageFile) {
    const blob = this.base64StringToBlob(this.uploadedImageFile);
    const arrayBuffer = await blob.arrayBuffer(); 
    userPayload.imagen = Array.from(new Uint8Array(arrayBuffer));  // Para enviar como JSON
  }

  if (this.password.trim()) {
    userPayload.password = this.password;
  }

  const request$ = this.isCreate
    ? this.userService.createUser(userPayload)
    : this.userService.updateUser(this.userId!, userPayload);

  request$.subscribe({
    next: () => {
      this.showToast();
      this.router.navigate(['/users']);
    },
    error: (err) => {
      console.error('Error al guardar', err);
      Swal.fire('Error', 'No se pudo guardar el usuario.', 'error');
    }
  });
}

  base64StringToBlob(base64: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
  }
  onImageUploaded(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.uploadedImageFile = base64.split(',')[1];  // elimina el prefijo 'data:image/...;base64,'
      };
      reader.readAsDataURL(file);
    }
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
