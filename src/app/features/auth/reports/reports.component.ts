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

    const itemId = this.selectedComboItem.id_item;

    this.reportService.getAuditoriasItem(itemId).subscribe({
      next: (auditorias) => {
        const auditoriasArray = Array.isArray(auditorias) ? auditorias : [auditorias];
        if (auditoriasArray.length === 0) {
          this.mensajeInfo = 'No hay información del ítem seleccionado.';
          return;
        }

        this.tableColumns = [
          { key: 'fecha', label: 'Fecha' },
          { key: 'accion', label: 'Acción realizada' },
          { key: 'lugar', label: 'Lugar destino' },
          { key: 'responsable', label: 'Responsable' },
        ];

        this.tableData = auditoriasArray.map((aud: any) => ({
          fecha: aud.fecha,
          accion: aud.accion,
          lugar: aud.nombre_tabla,
          responsable: aud.usuarios.nombres,
        }));

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

  console.log('selectedLugar:', this.selectedLugar);

  if (!this.selectedLugar.id) {
    alert('El lugar seleccionado no tiene id');
    return;
  }

  this.reportService.getItemsPorLugar(this.selectedLugar.id).subscribe({
    next: (itemsPorLugar) => {
      this.reportService.getEstadoItems().subscribe({
        next: (estadoItems) => {
          const estadoItemsArray = Array.isArray(estadoItems) ? estadoItems : [estadoItems];

          const combinedItems = itemsPorLugar.map((itemLugar: any) => {
            const estadoItem = estadoItemsArray.find(
              (estado: any) => estado.codigo === itemLugar.codigo
            );

            return {
              codigoNombre: `${itemLugar.codigo} - ${itemLugar.nombre}`,
              lugar: this.selectedLugar.nombre,
              estado: estadoItem ? estadoItem.estado : 'Desconocido',
            };
          });

          if (combinedItems.length === 0) {
            this.mensajeInfo = 'No hay ítems en el lugar seleccionado.';
            this.showTable = false;
            return;
          }

          this.tableColumns = [
            { key: 'codigoNombre', label: 'Código - Nombre Item' },
            { key: 'lugar', label: 'Lugar' },
            { key: 'estado', label: 'Estado' },
          ];

          this.tableData = combinedItems;
          this.showTable = true;
        },
        error: () => alert('Error al cargar estado de ítems'),
      });
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
