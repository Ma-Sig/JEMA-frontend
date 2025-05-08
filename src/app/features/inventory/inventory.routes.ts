import { Route, Routes } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemEntryComponent } from './item-entry/item-entry.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryEntryComponent } from './inventory-entry/inventory-entry.component';

export const routes: Routes = [
  { path: 'items', component: ItemListComponent },
  {
    path: 'items/new',
    component: ItemEntryComponent,
    data: { mode: 'create' },
  },
  {
    path: 'items/:id/edit',
    component: ItemEntryComponent,
    data: { mode: 'edit' },
  },
  {
    path: 'items/:id/view',
    component: ItemEntryComponent,
    data: { mode: 'view' },
  },

  { path: 'inventories', component: InventoryListComponent },
  {
    path: 'inventories/new',
    component: InventoryEntryComponent,
    data: { mode: 'create' },
  },
  {
    path: 'inventories/:id/edit',
    component: InventoryEntryComponent,
    data: { mode: 'edit' },
  },
  {
    path: 'inventories/:id/view',
    component: InventoryEntryComponent,
    data: { mode: 'view' },
  },

  // Ruta por defecto para inventario
  { path: '', redirectTo: 'items', pathMatch: 'full' },
];
