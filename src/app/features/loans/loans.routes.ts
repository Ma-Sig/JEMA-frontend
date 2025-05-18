import { Routes } from "@angular/router";
import { LoansComponent } from "./loans.component";

export const routes: Routes = [
    {path: 'loans', component: LoansComponent},
    { path: '', redirectTo: '/loans', pathMatch: 'full' },
]