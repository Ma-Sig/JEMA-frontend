import { Routes } from "@angular/router";
import { LoansComponent } from "./loans/loans.component";
import { LoanListComponent } from "./loan-list/loan-list.component";

export const routes: Routes = [
    {path: 'loanList', component: LoanListComponent},
    { path: 'loans/new', component: LoansComponent, data: { mode: 'create' } },
    { path: 'loans/:id/edit', component: LoansComponent, data: { mode: 'edit' } },
    { path: 'loans/:id/view', component: LoansComponent, data: { mode: 'view' } },
]