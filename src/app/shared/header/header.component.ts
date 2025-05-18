import { Component, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ChatbotComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  sidebarOpen = false;
  dropdownOpen = false;

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

  logOut() {
    console.log('Cerrar sesión');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
