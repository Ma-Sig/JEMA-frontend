import { Component, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-card',
  imports: [],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.css',
})
export class DashboardCardComponent {
  title = input('card');
  backgroundColor = input('#000000');
  route = input('/');

  constructor(private router: Router) {}

  navigateTo(): void {
    this.router.navigate([this.route()]);
  }
}
