import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReportsComponent } from './reports/reports.component';
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ReportsComponent],
  imports: [CommonModule, AuthRoutingModule, InfoComponent],
})
export class AuthModule {}
