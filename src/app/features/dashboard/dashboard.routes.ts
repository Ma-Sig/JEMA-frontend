import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { AuthGuard } from "../../core/guards/auth.guard";

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // redirect to `first-component`
]