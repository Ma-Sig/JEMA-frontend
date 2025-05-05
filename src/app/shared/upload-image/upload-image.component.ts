import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class UploadImageComponent {
  imageSrc: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.imageSrc = null;

    // También puedes reiniciar el input si lo necesitas
    const fileInput = document.getElementById(
      'photoUpload'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
