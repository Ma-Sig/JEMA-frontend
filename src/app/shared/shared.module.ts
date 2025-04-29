import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CalendarComponent } from './calendar/calendar.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { TableComponent } from './table/table.component';
import { CheckListComponent } from './check-list/check-list.component';



@NgModule({
  declarations: [
    ButtonComponent,
    PageNotFoundComponent,
    DropdownComponent,
    CalendarComponent,
    UploadImageComponent,
    TableComponent,
    CheckListComponent
  ],
  imports: [
    CommonModule,
    FormsModule 
  ],
  exports: [ButtonComponent]
})
export class SharedModule { }
