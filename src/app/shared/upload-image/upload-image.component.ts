import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class UploadImageComponent {
  @Input() imageSrc: string | null = null;
  @Input() readonly: boolean = false;
  @Output() imageUploaded = new EventEmitter<string | null>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        const base64String = this.imageSrc.split(',')[1];
        this.imageUploaded.emit(base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.imageSrc = null;
    this.imageUploaded.emit(null);

    const fileInput = document.getElementById('photoUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
