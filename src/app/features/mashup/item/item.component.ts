import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item',
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  @Input() nombre: string = "";
  @Input() lugar: string = "";
  @Input() estado: string = "";
  @Input() item: string = "";
  @Input() fecha: string = "";
  @Input() img: string = "";
}
