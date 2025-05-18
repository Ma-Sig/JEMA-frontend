import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Item {
  id: string;
  text: string;
  selected: boolean;
}

@Component({
  standalone: true,
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css'],
  imports: [FormsModule, CommonModule],
})
export class CheckListComponent {
  items: Item[] = [
    { id: '1234', text: '1234 - Pc Imac. Estado: Bueno', selected: true },
    { id: '1235', text: '1235 - Pc Imac. Estado: Bueno', selected: true },
    { id: '1236', text: '1236 - Pc Imac. Estado: Bueno', selected: true },
    { id: '1237', text: '1237 - Pc Imac. Estado: Bueno', selected: false },
    { id: '1234', text: '1234 - Pc Imac. Estado: Bueno', selected: true },
    { id: '1234', text: '1234 - Pc Imac. Estado: Bueno', selected: true },
    { id: '1234', text: '1234 - Pc Imac. Estado: Bueno', selected: true },
    { id: '1234', text: '1234 - Pc Imac. Estado: Bueno', selected: true },
    { id: '1234', text: '1234 - Pc Imac. Estado: Bueno', selected: true },
    { id: '1234', text: '1234 - Pc Imac. Estado: Bueno', selected: true },
    { id: '1234', text: '1234 - Pc Imac. Estado: Bueno', selected: true },
  ];

  get selectedCount(): number {
    return this.items.filter(item => item.selected).length;
  }

  get allSelected(): boolean {
    return this.selectedCount === this.items.length;
  }

  toggleItem(item: Item): void {
    item.selected = !item.selected;
  }

  toggleAll(): void {
    const newState = !this.allSelected;
    this.items.forEach(item => item.selected = newState);
  }

  performAction(): void {
    const selectedIds = this.items
      .filter(item => item.selected)
      .map(item => item.id);
    alert(`Acción realizada con los elementos: ${selectedIds.join(', ')}`);
  }
}
