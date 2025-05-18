import { Route, Routes } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemEntryComponent } from './item-entry/item-entry.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryEntryComponent } from './inventory-entry/inventory-entry.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const routes: Routes = [
  { path: 'items', component: ItemListComponent, canActivate: [AuthGuard] },
  { path: 'items/new', component: ItemEntryComponent, canActivate: [AuthGuard], data: { mode: 'create' } },
  { path: 'items/:id/edit', component: ItemEntryComponent, canActivate: [AuthGuard], data: { mode: 'edit' } },
  { path: 'items/:id/view', component: ItemEntryComponent, canActivate: [AuthGuard], data: { mode: 'view' } },

  { path: 'inventories', component: InventoryListComponent, canActivate: [AuthGuard] },
  { path: 'inventories/new', component: InventoryEntryComponent, canActivate: [AuthGuard],  data: { mode: 'create' } },
  { path: 'inventories/:id/edit', component: InventoryEntryComponent, canActivate: [AuthGuard], data: { mode: 'edit' } },
  { path: 'inventories/:id/view', component: InventoryEntryComponent, canActivate: [AuthGuard], data: { mode: 'view' } },

  // Ruta por defecto para inventario
  { path: '', redirectTo: 'items', pathMatch: 'full' },
];
