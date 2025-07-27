import { Component } from '@angular/core';
import { ReportService } from './reports.service';
import { AuthService } from '../services/auth.service';
import { ButtonComponent } from '../../../shared/button/button.component';
import { TableComponent } from '../../../shared/table/table.component';
import { CalendarComponent } from '../../../shared/calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { exportToExcel } from '../../../shared/export.uti';


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

  codigoItem: string = '';
  idLugar: number = 0;

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  items = ['Historico de Item', 'Item por lugar', 'Estado de item'];

  tableColumns: { key: string, label: string }[] = [];
  tableData: any[] = [];
  filteredItems: any[] = [];

  lugares = [];
  itemsPorLugar: { label: string; value: any }[] = [];
  selectedLugar: any = null;
  selectedItemLugar: any = null;

  constructor(
    private reportService: ReportService,
    private authService: AuthService
  ) {}

  seleccionarItem(item: string) {
    this.selectedItem = item;
    this.showTable = false;

    this.codigoItem = '';
    this.idLugar = 0;
    this.searchTerm = '';
    this.tableColumns = [];
    this.tableData = [];
    this.filteredItems = [];
  }

  onSearchTermChange(term: string) {
    if (this.selectedItem === 'Historico de Item' && term.length >= 2) {
      this.reportService.buscarItems(term).subscribe(data => {
        this.filteredItems = data;
      });
    }
  }

  onSelectItem(item: any) {
    this.codigoItem = item.codigo;
    this.searchTerm = item.nombre;
    this.filteredItems = [];
  }

  onLugarSeleccionado(lugar: any) {
    this.idLugar = lugar.id;
    const userId = this.authService.getUserId();
    if (!userId) {
      alert('Usuario no autenticado.');
      return;
    }
    this.reportService.getItemsPorLugar(lugar.id, userId).subscribe(data => {
      this.itemsPorLugar = data.map(i => ({ label: `${i.codigo} - ${i.nombre}`, value: i.codigo }));
    });
  }

  onMostrarReporte() {
    const userId = this.authService.getUserId();
    if (!userId) {
      alert('Usuario no autenticado.');
      return;
    }

    this.showTable = false;

    switch (this.selectedItem) {
      case 'Historico de Item':
        if (!this.codigoItem) {
          alert('Por favor ingresa el código del item');
          return;
        }
        this.reportService.getHistoricoItem(this.codigoItem, userId, this.fechaInicio, this.fechaFin)
          .subscribe(data => {
            this.tableColumns = [
              { key: 'accion', label: 'Acción' },
              { key: 'fecha', label: 'Fecha' },
              { key: 'accionRealizada', label: 'Acción Realizada' },
              { key: 'lugar', label: 'Lugar Destino' },
              { key: 'responsable', label: 'Responsable' }
            ];
            this.tableData = data;
            this.showTable = true;
          });
        break;

      case 'Item por lugar':
        if (!this.idLugar) {
          alert('Por favor selecciona un lugar');
          return;
        }
        this.reportService.getItemsPorLugar(this.idLugar, userId).subscribe(data => {
          this.tableColumns = [
            { key: 'codigo', label: 'Código Item' },
            { key: 'nombre', label: 'Item' },
            { key: 'lugar', label: 'Lugar' }
          ];
          this.tableData = data;
          this.showTable = true;
        });
        break;

      case 'Estado de item':
        this.reportService.getEstadoItems(userId).subscribe(data => {
          this.tableColumns = [
            { key: 'codigo', label: 'Código Item' },
            { key: 'nombre', label: 'Item' },
            { key: 'estado', label: 'Estado' }
          ];
          this.tableData = data;
          this.showTable = true;
        });
        break;
    }
  }

  onGuardarReporte() {
    const fileName = this.selectedItem?.replace(/\s/g, '_') || 'reporte';
    exportToExcel(this.tableData, fileName);
  }
}
