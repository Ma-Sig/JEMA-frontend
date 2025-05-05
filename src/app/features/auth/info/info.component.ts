import { Component, Input } from '@angular/core';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { RightQComponent } from 'src/app/shared/right-q/right-q.component';
import { UploadImageComponent } from 'src/app/shared/upload-image/upload-image.component';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  imports: [ButtonComponent, RightQComponent, UploadImageComponent],
  standalone: true,
})
export class InfoComponent {}
