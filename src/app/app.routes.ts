import { Routes } from '@angular/router';
import { routes as auth_routes } from './features/auth/auth.routes';
import { routes as inventory_routes } from './features/inventory/inventory.routes';
import { MashupComponent } from './features/mashup/mashup.component';
import { LoansComponent } from './features/loans/loans.component';

export const routes: Routes = [
  ...auth_routes,
  ...inventory_routes.map((route) => ({
    ...route,
    path: `inventory/${route.path}`,
  })),
  { path: 'mushup', component: MashupComponent },
  { path: 'loans', component: LoansComponent }
];
