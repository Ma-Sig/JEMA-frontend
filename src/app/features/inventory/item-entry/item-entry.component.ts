import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { UploadImageComponent } from '../../../shared/upload-image/upload-image.component';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../users/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // <-- Importa DomSanitizer

@Component({
  selector: 'app-item-entry',
  standalone: true,
  imports: [ButtonComponent, CommonModule, InputFieldComponent, UploadImageComponent],
  templateUrl: './item-entry.component.html',
  styleUrls: ['./item-entry.component.css'],
})
export class ItemEntryComponent implements OnInit {
  mode: 'create' | 'edit' | 'view' = 'view';
  userId?: number;
  name: string = '';
  surname: string = '';
  idNumber: string = '';
  email: string = '';
  password: string = '';
  cellphone: string = '';
  uploadedImageFile: string | null = null; // base64 sin prefijo

  imagePreviewUrl: SafeUrl | null = null; // <-- Cambiado a SafeUrl

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private sanitizer: DomSanitizer // <-- Inyecta DomSanitizer
  ) {}

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
      next: (user) => {
        this.name = user.nombres;
        this.surname = user.apellidos;
        this.idNumber = user.cedula;
        this.email = user.email;
        this.password = '';
        this.cellphone = user.celular || '';

        if (user.imagen) {
          this.uploadedImageFile = user.imagen; // base64 sin prefijo
          // Crea URL segura para imagen
          this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
            `data:image/jpeg;base64,${user.imagen}`
          );
        } else {
          this.uploadedImageFile = null;
          this.imagePreviewUrl = null;
        }
      },
      error: (err) => {
        console.error('Error al cargar usuario', err);
        Swal.fire('Error', 'No se pudo cargar el usuario.', 'error');
      },
    });
  }

  onImageUploaded(base64: string | null): void {
    this.uploadedImageFile = base64;
    if (base64) {
      this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
        `data:image/jpeg;base64,${base64}`
      );
    } else {
      this.imagePreviewUrl = null;
    }
  }

  async saveItem() {
    if (
      !this.name.trim() ||
      !this.surname.trim() ||
      !this.email.trim() ||
      !this.idNumber.trim() ||
      (this.isCreate && !this.password.trim())
    ) {
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

    // Si la imagen es null, se envía null para borrar
    if (this.uploadedImageFile) {
      const blob = this.base64StringToBlob(this.uploadedImageFile);
      const arrayBuffer = await blob.arrayBuffer();
      userPayload.imagen = Array.from(new Uint8Array(arrayBuffer));
    } else {
      userPayload.imagen = null; // importante para borrar imagen en backend
    }

    if (this.password.trim()) {
      userPayload.password = this.password;
    }

    const storedUserId = Number(localStorage.getItem('userId')) || 13;
    userPayload.userId = storedUserId;

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
      },
    });
  }

  base64StringToBlob(base64: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
  }

  removeImage(): void {
    this.uploadedImageFile = null;
    this.imagePreviewUrl = null;
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
  onCellphoneChange(value: string): void {
    this.cellphone = value;
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
