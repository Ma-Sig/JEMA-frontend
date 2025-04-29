import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  isOpen = false;
  selectedLabel = 'Servicio';

  options = [
    'Mantenimiento',
    'Reparación',
    'Instalación',
    'Consultoría',
    'Soporte Técnico'
  ];

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    this.selectedLabel = option;
    this.isOpen = false;
  }

  // Cierra el dropdown si se hace clic fuera
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isOpen = false;
    }
  }
}
