import { Component, OnInit } from '@angular/core';
import { ReportService } from './reports.service';
import { exportToExcel } from '../../../shared/export.uti';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ReportsComponent implements OnInit {
  items = ['Historico de Item', 'Item por lugar'];
  selectedItem: string | null = null;

  comboItems: any[] = [];
  selectedComboItem: any = null;

  lugares: any[] = [];
  selectedLugar: any = null;

  tableData: any[] = [];
  tableColumns: { key: string; label: string }[] = [];

  mensajeInfo = '';
  showTable = false;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.cargarComboItems();
    this.cargarLugares();
  }

  seleccionarItem(item: string | null) {
    this.selectedItem = item;
    this.resetReport();
  }

  resetReport() {
    this.mensajeInfo = '';
    this.showTable = false;
    this.tableData = [];
    this.tableColumns = [];
  }

  cargarComboItems() {
    this.reportService.getComboItems().subscribe({
      next: (items) => (this.comboItems = items),
      error: () => alert('Error al cargar ítems'),
    });
  }

  cargarLugares() {
    this.reportService.getLugares().subscribe({
      next: (lugares) => (this.lugares = lugares),
      error: () => alert('Error al cargar lugares'),
    });
  }

  onLugarSeleccionado(): void {
    this.resetReport();
  }

  onMostrarReporte() {
    this.mensajeInfo = '';
    this.showTable = false;

    if (this.selectedItem === 'Historico de Item') {
      this.mostrarHistoricoItem();
    } else if (this.selectedItem === 'Item por lugar') {
      this.mostrarItemsPorLugar();
    }
  }

  mostrarHistoricoItem() {
    if (!this.selectedComboItem) {
      alert('Por favor selecciona un ítem');
      return;
    }

    const codigo = this.selectedComboItem.codigo;

    this.reportService.getAuditoriasItem(codigo).subscribe({
      next: (auditorias) => {
        if (!auditorias.length) {
          this.mensajeInfo = 'No hay información del ítem seleccionado.';
          return;
        }

        this.tableColumns = [
          { key: 'codigo', label: 'Código' },
          { key: 'accion', label: 'Acción' },
          { key: 'fecha', label: 'Fecha' },
          { key: 'accionRealizada', label: 'Detalle' },
          { key: 'lugar', label: 'Lugar' },
          { key: 'lugarPadre', label: 'Lugar Padre' },
          { key: 'caracteristicas', label: 'Características' },
          { key: 'responsable', label: 'Responsable' }
        ];

        this.tableData = auditorias.map((aud: any) => {
          let detalle = aud.accionRealizada;

          if (
            detalle.toLowerCase().includes('imagen') ||
            detalle.length > 100
          ) {
            detalle = 'Imagen';
          }

          return {
            codigo: aud.codigo,
            accion: aud.accion,
            fecha: new Date(aud.fecha).toLocaleString(), // formato legible
            accionRealizada: detalle,
            lugar: aud.lugar,
            lugarPadre: aud.lugarPadre,
            caracteristicas: aud.caracteristicas,
            responsable: aud.responsable
          };
        });

        this.showTable = true;
      },
      error: () => alert('Error al cargar histórico del ítem'),
    });
  }

  mostrarItemsPorLugar() {
    if (!this.selectedLugar) {
      alert('Por favor selecciona un lugar');
      return;
    }

    const idLugar = this.selectedLugar.id;

    this.reportService.getItemsPorLugar(idLugar).subscribe({
      next: (itemsPorLugar) => {
        if (!itemsPorLugar.length) {
          this.mensajeInfo = 'No hay ítems en el lugar seleccionado.';
          return;
        }

        this.tableColumns = [
          { key: 'codigo', label: 'Código' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'lugar', label: 'Lugar' },
          { key: 'estado', label: 'Estado' }
        ];

        this.tableData = itemsPorLugar;
        this.showTable = true;
      },
      error: () => alert('Error al cargar ítems por lugar'),
    });
  }

  onGuardarReporte() {
    if (this.tableData.length === 0) {
      alert('No hay datos para guardar');
      return;
    }

    exportToExcel(this.tableData, 'archivo');
  }
}
