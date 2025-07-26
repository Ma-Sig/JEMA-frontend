import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent {
  @Input() options: any[] = [];
  @Input() propertyName: string = '';
  @Input() placeholder: string = 'Seleccionar';
  @Input() readonly: boolean = false;
  @Input() selectedLabel: string = '';
  @Input() hostClass: string | string[] = '';
  @Output() selectionChange = new EventEmitter<any>();

  isOpen = false;

  toggleDropdown() {
    if (!this.readonly) {
      this.isOpen = !this.isOpen;
    }
  }

  selectOption(option: any) {
    if (!this.readonly) {
      this.selectedLabel = option;
      this.isOpen = false;
      console.log('Emitido desde Dropdown:', option);
      this.selectionChange.emit(option);
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isOpen = false;
    }
  }

  get label(): string {
    return this.selectedLabel || this.placeholder;
  }
}
