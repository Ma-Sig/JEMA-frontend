import { Component } from '@angular/core';
import { DashboardCardComponent } from '../../shared/dashboard-card/dashboard-card.component';
import { CommonModule } from '@angular/common';

interface DashboardItem {
  title: string;
  backgroundColor: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DashboardCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  dashboardItems: DashboardItem[] = [
    {
      title: 'Servicios',
      backgroundColor: 'bg-green-400',
      route: '/servicios',
    },
    {
      title: 'Items',
      backgroundColor: 'bg-red-400',
      route: '/items',
    },
    {
      title: 'Usuarios',
      backgroundColor: 'bg-blue-400',
      route: '/users',
    },
    {
      title: 'Préstamos',
      backgroundColor: 'bg-indigo-500',
      route: '/prestamos',
    },
    {
      title: 'Mapa',
      backgroundColor: 'bg-pink-400',
      route: '/mashup',
    },
    {
      title: 'Reportes',
      backgroundColor: 'bg-yellow-400',
      route: '/reportes',
    },
    {
      title: 'Estadísticas',
      backgroundColor: 'bg-purple-400',
      route: '/statistics/statistics-dashboard',
    },
  ];
}
