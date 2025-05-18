import { Routes } from "@angular/router";
import { MashupComponent } from "./mashup.component";

export const routes: Routes = [
    {path: 'mushup', component: MashupComponent},
    { path: '', redirectTo: '/mushup', pathMatch: 'full' },
]