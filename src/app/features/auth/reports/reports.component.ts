import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { TableComponent } from '../../../shared/table/table.component';
import { CalendarComponent } from '../../../shared/calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  imports: [ButtonComponent, TableComponent, FormsModule, CommonModule, CalendarComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  standalone: true,
})
export class ReportsComponent {
  
  searchTerm = '';
  selectedItem: string | null = null;
  showTable = false;

  items = ['Historico de Item', 'Item por lugar', 'Estado de item'];

  tableColumns: { key: string, label: string }[] = [];
  tableData: any[] = [];

  onMostrarReporte() {
    this.showTable = true;
  }

  onGuardarReporte() {
    alert('Funcionalidad para guardar reporte en Excel (pendiente)');
  }

  seleccionarItem(item: string) {
    this.selectedItem = item;
    this.showTable = false;

    switch (item) {
      case 'Historico de Item':
        this.tableColumns = [
          { key: 'accion', label: 'Acción' },
          { key: 'fecha', label: 'Fecha' },
          { key: 'accionRealizada', label: 'Acción Realizada' },
          { key: 'lugar', label: 'Lugar Destino' },
          { key: 'responsable', label: 'Responsable' }
        ];
        this.tableData = [
          { accion: 'Movimiento', fecha: '2025-05-01', accionRealizada: 'Entrega', lugar: 'Cuenca', responsable: 'Juan Pérez' },
          { accion: 'Verificación', fecha: '2025-05-02', accionRealizada: 'Inspección', lugar: 'Quito', responsable: 'Ana Gómez' }
        ];
        break;

      case 'Item por lugar':
        this.tableColumns = [
          { key: 'codigo', label: 'Código Item' },
          { key: 'nombre', label: 'Item' },
          { key: 'lugar', label: 'Lugar' }
        ];
        this.tableData = [
          { codigo: 'A123', nombre: 'Proyector', lugar: 'Cuenca' },
          { codigo: 'B456', nombre: 'Computador', lugar: 'Quito' }
        ];
        break;

      case 'Estado de item':
        this.tableColumns = [
          { key: 'codigo', label: 'Código Item' },
          { key: 'nombre', label: 'Item' },
          { key: 'estado', label: 'Estado' }
        ];
        this.tableData = [
          { codigo: 'A123', nombre: 'Proyector', estado: 'Bueno' },
          { codigo: 'B456', nombre: 'Computador', estado: 'Desgastado' }
        ];
        break;
    }
  }
}
