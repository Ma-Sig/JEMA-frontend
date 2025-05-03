import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { ItemEntryComponent } from './item-entry/item-entry.component';
import { ItemListComponent } from './item-list/item-list.component';
import { InventoryEntryComponent } from './inventory-entry/inventory-entry.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';


@NgModule({
  declarations: [
    InventoryComponent,
    ItemListComponent,
    InventoryEntryComponent,
    InventoryListComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    ItemEntryComponent,
  ]
})
export class InventoryModule { }
