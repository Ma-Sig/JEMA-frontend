import { Route, Routes } from '@angular/router';
import { ConsumptionListComponent } from './consumption-list/consumption-list.component';
import { ConsumptionEntryComponent } from './consumption-entry/consumption-entry.component';

export const routes: Routes = [
  { path: 'list', component: ConsumptionListComponent },
  { path: 'new', component: ConsumptionEntryComponent, data: { mode: 'create' } },
  { path: ':id/edit', component: ConsumptionEntryComponent, data: { mode: 'edit' } },
  { path: ':id/view', component: ConsumptionEntryComponent, data: { mode: 'view' } },
];
