import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { TableComponent } from '../../../shared/table/table.component';
import { CalendarComponent } from '../../../shared/calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-reports',
  imports: [ButtonComponent, TableComponent, FormsModule, CommonModule,CalendarComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  standalone: true,
})
export class ReportsComponent {

  searchTerm = '';
  selectedItem: string | null = null;
  showTable = false;

  items = ['Reporte A', 'Reporte B', 'Reporte C'];

  tableColumns = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'accion', label: 'Acción Realizada' },
    { key: 'lugar', label: 'Lugar Destino' },
    { key: 'responsable', label: 'Responsable' },
  ];

  tableData = [
    { fecha: '2025-05-01', accion: 'Entrega', lugar: 'Cuenca', responsable: 'Juan Pérez' },
    { fecha: '2025-05-02', accion: 'Inspección', lugar: 'Quito', responsable: 'Ana Gómez' },
  ];

  onMostrarReporte() {
    this.showTable = true;
  }

  onGuardarReporte() {
    alert('Funcionalidad para guardar reporte en Excel (pendiente)');
  }

  seleccionarItem(item: string) {
    this.selectedItem = item;
    this.showTable = false;
  }
}
