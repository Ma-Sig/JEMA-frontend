import { Routes } from "@angular/router";
import { MashupComponent } from "./mashup.component";

export const routes: Routes = [
    {path: 'mashup', component: MashupComponent},
    { path: '', redirectTo: '/mashup', pathMatch: 'full' },
]