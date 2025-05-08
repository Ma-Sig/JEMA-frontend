import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { Route, Routes } from "@angular/router";

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
]