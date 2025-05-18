import { Component } from '@angular/core';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { CheckListComponent } from '../../../shared/check-list/check-list.component';

@Component({
  selector: 'app-loans',
  imports: [DropdownComponent, CheckListComponent],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.css',
})
export class LoansComponent {
  itemOptions = ['Opción 1', 'Opción 2', 'Opción 3'];
  placesOriginOptions = ['Opción 1', 'Opción 2', 'Opción 3'];
  placesDestinationOptions = ['Opción 1', 'Opción 2', 'Opción 3'];
}
