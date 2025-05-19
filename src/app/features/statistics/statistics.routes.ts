import { Routes } from '@angular/router';

import { AuthGuard } from '../../core/guards/auth.guard';
import { StatisticsDashboardComponent } from './statistics-dashboard/statistics-dashboard.component';

export const routes: Routes = [
  { path: 'statistics-dashboard', component: StatisticsDashboardComponent, canActivate: [AuthGuard] },

  { path: '', redirectTo: 'statistics-dashboard', pathMatch: 'full' },
];
