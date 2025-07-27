import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../../shared/table/table.component';
import { RouterModule, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { ServiceConsumptionService } from '../services/service-consumption.service';

interface ApiResponse {
  id_consumo_servicio: number;
  cantidad: number;
  fecha: string;
  lugares: { nombre: string };
  servicios: { nombre: string };
}

interface TableRow {
  id: string;
  lugar: string;
  servicio: string;
  cantidad: string;
  fecha: string;
}

@Component({
  selector: 'app-consumption-list',
  standalone: true,
  imports: [TableComponent, RouterModule],
  templateUrl: './consumption-list.component.html',
  styleUrl: './consumption-list.component.css',
})
export class ConsumptionListComponent implements OnInit {
  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'lugar', label: 'Lugar' },
    { key: 'servicio', label: 'Servicio' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'fecha', label: 'Fecha' },
  ];
  tableData: TableRow[] = [];

  constructor(
    private router: Router,
    private serviceConsumptionService: ServiceConsumptionService
  ) {}

  ngOnInit(): void {
    this.loadSystemData();
  }

  private loadSystemData() {
    this.serviceConsumptionService.getConsumptions().then((response) => {
      this.tableData = this.mapToTableData(response);
    });
  }

  private mapToTableData(response: ApiResponse[]): TableRow[] {
    return response.map((item) => ({
      id: item.id_consumo_servicio.toString().padStart(5, '0'),
      lugar: item.lugares?.nombre || '—',
      servicio: item.servicios?.nombre || '—',
      cantidad: item.cantidad.toFixed(2),
      fecha: item.fecha,
    }));
  }

  onViewItem(row: any) {
    console.log('onViewItem recibido:', row);
    this.router.navigate(['/service-consumption/', Number(row.id), 'view']);
  }

  onEditItem(row: any) {
    console.log('onEditItem recibido:', row);
    this.router.navigate(['/service-consumption/', Number(row.id), 'edit']);
  }

  async onDeleteItem(row: any) {
    console.log('onDeleteItem recibido:', row);

    const confirmed = await this.confirmDeletion();

    if (confirmed) {
      this.tableData = this.tableData.filter((item) => item.id !== row.id);
      console.log('Eliminar en la base de datos:', row.id);
      Swal.fire('Eliminado!', 'Este elemento ha sido eliminado correctamente.', 'success');
    } else {
      Swal.fire('Cancelado', 'La eliminación ha sido cancelada.', 'error');
    }
  }

  async confirmDeletion(): Promise<boolean> {
    const result = await Swal.fire({
      title: '¿Está seguro de eliminar este elemento?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });

    return result.isConfirmed;
  }
}
