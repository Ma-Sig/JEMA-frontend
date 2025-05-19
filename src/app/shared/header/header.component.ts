import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ChatbotComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  sidebarOpen = false;
  dropdownOpen = false;

  menuItems = [
    { label: 'Inicio', routerLink: '/dashboard' },
    { label: 'Items', routerLink: '/inventory/items' },
    { label: 'Consumos de servicios', routerLink: '/service-consumption/list' },
    { label: 'Inventario', routerLink: '/inventory/inventories' },
    { label: 'Reportes', routerLink: '/reports' },
    { label: 'Usuarios', routerLink: '/users' },
    { label: 'Sobre nosotros', routerLink: '/info' },
    { label: 'Mapa', routerLink: '/mashup' },
    { label: 'Préstamos', routerLink: '/loans' },
    { label: 'Estadísticas', routerLink: '/statistics/statistics-dashboard' },
    { label: 'Cerrar sesión', action: 'logout' },
  ];

  constructor(private router: Router) {}

  openSidebar() {
    this.sidebarOpen = true;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  toggleUserDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-container')) {
      this.dropdownOpen = false;
    }
  }

  handleMenuClick(item: any) {
    this.closeSidebar();

    if (item.action === 'logout') {
      this.logOut();
    }
  }

  logOut() {
    console.log('Cerrar sesión');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
