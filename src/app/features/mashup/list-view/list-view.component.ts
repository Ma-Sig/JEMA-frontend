import { Component, input } from '@angular/core';
import { ItemComponent } from '../item/item.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-view',
  imports: [ItemComponent],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css'
})
export class ListViewComponent {
  
  constructor(private router: Router) {}

  navigateTo(): void {
    this.router.navigate(["/inventory/inventories/new"]);
  }
}
