import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { InfoPageComponent } from "../info-page/info-page.component";
import { ReportsComponent } from "../reports/reports.component";
import { Route, Routes } from "@angular/router";

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'info', component: InfoPageComponent},
    { path: 'reports', component: ReportsComponent},
]