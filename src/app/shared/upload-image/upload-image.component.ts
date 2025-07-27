import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class UploadImageComponent {
  @Input() imageSrc: string | SafeUrl | null = null;
  @Input() readonly: boolean = false;
  @Output() imageUploaded = new EventEmitter<string | null>();

  // Estado interno para manejar errores
  hasImageError: boolean = false;
  // URL temporal para previsualización inmediata
  previewUrl: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.showError('Por favor selecciona un archivo de imagen válido.');
        this.clearFileInput();
        return;
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.showError('La imagen es demasiado grande. El tamaño máximo es 5MB.');
        this.clearFileInput();
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.previewUrl = result; // URL completa para previsualización
        const base64String = result.split(',')[1]; // Solo la parte base64
        this.imageUploaded.emit(base64String);
        this.hasImageError = false;
      };

      reader.onerror = () => {
        this.showError('Error al leer el archivo. Inténtalo de nuevo.');
        this.clearFileInput();
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.previewUrl = null;
    this.hasImageError = false;
    this.imageUploaded.emit(null);
    this.clearFileInput();
  }

  onImageError(): void {
    this.hasImageError = true;
  }

  onImageLoad(): void {
    this.hasImageError = false;
  }

  private clearFileInput(): void {
    const fileInput = document.getElementById('photoUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private showError(message: string): void {
    // Puedes personalizar esto según tu sistema de notificaciones
    console.error('Error en upload de imagen:', message);
    // Opcional: mostrar toast o modal de error
  }

  get displayImageSrc(): string | SafeUrl | null {
    if (this.hasImageError) return null;

    // Priorizar la URL de previsualización temporal si existe
    if (this.previewUrl) return this.previewUrl;

    // Usar la imagen proporcionada por el padre si existe
    return this.imageSrc;
  }
}
