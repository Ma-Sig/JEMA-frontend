import { Routes } from '@angular/router';
import { routes as dashboard_routes } from './features/dashboard/dashboard.routes';
import { routes as auth_routes } from './features/auth/auth.routes';
import { routes as inventory_routes } from './features/inventory/inventory.routes';
import { routes as mashup_routes } from './features/mashup/mashup.routes';
import { routes as loans_routes  } from './features/loans-folder/loans.routes';
import { routes as service_consumption_routes } from './features/service-consumption/service-consumption.routes';

export const routes: Routes = [
  ...loans_routes,
  ...mashup_routes,
  ...dashboard_routes,
  ...auth_routes,
  ...inventory_routes.map((route) => ({
    ...route,
    path: `inventory/${route.path}`,
  })),
  ...service_consumption_routes.map((route) => ({
    ...route,
    path: `service-consumption/${route.path}`,
  })),
];
