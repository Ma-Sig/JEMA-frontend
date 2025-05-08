import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent {
  @Input() options: string[] = []; // Lista de opciones
  @Input() placeholder: string = 'Seleccionar'; // Placeholder inicial
  @Input() readonly: boolean = false; // Modo solo lectura
  @Input() selectedLabel: string = ''; // Valor preseleccionado (opcional)
  @Input() hostClass: string | string[] = '';
  @Output() selectionChange = new EventEmitter<string>(); // Emitir selección

  isOpen = false;

  toggleDropdown() {
    if (!this.readonly) {
      this.isOpen = !this.isOpen;
    }
  }

  selectOption(option: string) {
    if (!this.readonly) {
      this.selectedLabel = option;
      this.isOpen = false;
      this.selectionChange.emit(option); // Emitimos el valor seleccionado
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
