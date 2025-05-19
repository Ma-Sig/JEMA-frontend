import { Route, Routes } from '@angular/router';
import { ConsumptionListComponent } from './consumption-list/consumption-list.component';
import { ConsumptionEntryComponent } from './consumption-entry/consumption-entry.component';

import { AuthGuard } from '../../core/guards/auth.guard';

export const routes: Routes = [
  { path: 'list', component: ConsumptionListComponent, canActivate: [AuthGuard] },
  { path: 'new', component: ConsumptionEntryComponent, canActivate: [AuthGuard], data: { mode: 'create' } },
  { path: ':id/edit', component: ConsumptionEntryComponent, canActivate: [AuthGuard], data: { mode: 'edit' } },
  { path: ':id/view', component: ConsumptionEntryComponent, canActivate: [AuthGuard], data: { mode: 'view' } },
];
