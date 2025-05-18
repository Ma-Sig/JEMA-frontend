import { Component } from '@angular/core';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-list-view',
  imports: [ItemComponent],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css'
})
export class ListViewComponent {

}
