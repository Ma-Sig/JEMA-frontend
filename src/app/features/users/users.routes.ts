import { Routes } from "@angular/router";
import { UserListComponent } from "./user-list/user-list.component";
import { AuthGuard } from "../../core/guards/auth.guard";
import { UserItemComponent } from "./user-item/user-item.component";

export const routes: Routes = [
    {path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
    { path: 'users/new', component: UserItemComponent, canActivate: [AuthGuard], data: { mode: 'create' } },
    { path: 'users/user/:id/edit', component: UserItemComponent, canActivate: [AuthGuard], data: { mode: 'edit' } },
    { path: 'users/user/:id/view', component: UserItemComponent, canActivate: [AuthGuard], data: { mode: 'view' } },
]