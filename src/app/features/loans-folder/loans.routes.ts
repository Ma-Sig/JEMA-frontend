import { Routes } from "@angular/router";
import { LoansComponent } from "./loans/loans.component";
import { LoanListComponent } from "./loan-list/loan-list.component";
import { AuthGuard } from '../../core/guards/auth.guard';

export const routes: Routes = [
    {path: 'loans', component: LoanListComponent, canActivate: [AuthGuard] },
    { path: 'loans/new', component: LoansComponent, canActivate: [AuthGuard], data: { mode: 'create' } },
    { path: 'loans/:id/edit', component: LoansComponent, canActivate: [AuthGuard], data: { mode: 'edit' } },
    { path: 'loans/:id/view', component: LoansComponent, canActivate: [AuthGuard], data: { mode: 'view' } },
]