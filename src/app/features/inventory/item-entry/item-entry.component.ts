import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadImageComponent } from '../../../shared/upload-image/upload-image.component';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { ItemService, CaracteristicasItem } from '../services/items.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-item-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, UploadImageComponent],
  templateUrl: './item-entry.component.html',
  styleUrls: ['./item-entry.component.css'],
})
export class ItemEntryComponent implements OnInit {
  mode: 'create' | 'edit' | 'view' = 'view';
  itemId?: number;

  // Propiedades del formulario
  codigo: string = '';
  nombre: string = '';
  marca: string = '';
  categoria: string = '';
  descripcion: string = '';
  uploadedImageFile: string | null = null; // base64 sin prefijo
  imagePreviewUrl: SafeUrl | null = null;

  // Estados del componente
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router, // Cambiado a public para acceso desde template
    private itemService: ItemService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const data = await firstValueFrom(this.route.data);
      this.mode = data['mode'] ?? 'view';

      const params = await firstValueFrom(this.route.paramMap);
      const idParam = params.get('id');
      this.itemId = idParam ? Number(idParam) : undefined;

      if ((this.mode === 'edit' || this.mode === 'view') && this.itemId !== undefined) {
        await this.loadItemData(this.itemId);
      }
    } catch (error) {
      console.error('Error al inicializar componente:', error);
      this.errorMessage = 'Error al cargar los datos';
    }
  }

  async loadItemData(id: number): Promise<void> {
    try {
      const item = await firstValueFrom(this.itemService.getItemById(id, true));
      this.codigo = item.codigo;
      this.nombre = item.nombre;
      this.marca = item.marca;
      this.categoria = item.categoria;
      this.descripcion = item.descripcion;

      if (item.imagen) {
        this.uploadedImageFile = item.imagen; // base64 desde el backend
        this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
          `data:image/jpeg;base64,${item.imagen}`
        );
      } else {
        this.uploadedImageFile = null;
        this.imagePreviewUrl = null;
      }

      this.errorMessage = '';
    } catch (error) {
      console.error('Error al cargar item:', error);
      this.errorMessage = 'No se pudo cargar la información del item';
      Swal.fire('Error', 'No se pudo cargar el item.', 'error');
    }
  }

  onImageUploaded(base64: string | null): void {
    this.uploadedImageFile = base64;
    if (base64) {
      // Crear una URL de datos segura para la previsualización
      const dataUrl = `data:image/jpeg;base64,${base64}`;
      this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
    } else {
      this.imagePreviewUrl = null;
    }
  }

  async saveItem(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const itemPayload: CaracteristicasItem = {
        userId: this.itemService.getUserId(),
        codigo: this.codigo.trim(),
        nombre: this.nombre.trim(),
        marca: this.marca.trim(),
        categoria: this.categoria.trim(),
        descripcion: this.descripcion.trim(),
      };

      // Procesar imagen si existe
      if (this.uploadedImageFile) {
        const blob = this.base64StringToBlob(this.uploadedImageFile);
        const arrayBuffer = await blob.arrayBuffer();
        itemPayload.imagen = Array.from(new Uint8Array(arrayBuffer));
      } else {
        itemPayload.imagen = null;
      }

      const request$ = this.isCreate
        ? this.itemService.createItem(itemPayload)
        : this.itemService.updateItem(this.itemId!, itemPayload);

      await firstValueFrom(request$);

      this.showSuccessToast();
      this.router.navigate(['/inventory/items']);
    } catch (error) {
      console.error('Error al guardar item:', error);
      this.errorMessage = 'No se pudo guardar el item. Inténtalo de nuevo.';
      Swal.fire('Error', 'No se pudo guardar el item.', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  private validateForm(): boolean {
    if (!this.codigo.trim()) {
      this.errorMessage = 'El codigo es obligatorio';
      return false;
    }

    if (!this.nombre.trim()) {
      this.errorMessage = 'El nombre es obligatorio';
      return false;
    }

    // if (!this.marca.trim()) {
    //   this.errorMessage = 'La marca es obligatoria';
    //   return false;
    // }

    // if (!this.descripcion.trim()) {
    //   this.errorMessage = 'La descripción es obligatoria';
    //   return false;
    // }

    return true;
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

  // Getters para el template
  get isReadOnly(): boolean {
    return this.mode === 'view';
  }

  get isEdit(): boolean {
    return this.mode === 'edit';
  }

  get isCreate(): boolean {
    return this.mode === 'create';
  }

  get canSubmit(): boolean {
    return this.codigo.trim() !== '' && this.nombre.trim() !== '' && !this.isSubmitting;
  }

  get buttonText(): string {
    if (this.isSubmitting) {
      return 'Guardando...';
    }
    return this.isCreate ? 'Crear Item' : 'Actualizar Item';
  }

  private showSuccessToast(): void {
    const message = this.isCreate ? 'Item creado con éxito' : 'Item actualizado con éxito';

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  // Método para limpiar mensajes cuando el usuario empiece a escribir
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Método público para navegación desde el template
  navigateToInventory(): void {
    this.router.navigate(['/inventory/items']);
  }
}
