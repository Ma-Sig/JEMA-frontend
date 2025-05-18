import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/table/table.component';
import { RouterModule, Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-consumption-list',
  standalone: true,
  imports: [TableComponent, RouterModule],
  templateUrl: './consumption-list.component.html',
  styleUrl: './consumption-list.component.css',
})
export class ConsumptionListComponent {
  constructor(private router: Router) {}
  tableData = [
    {
      id: '00001',
      lugar: 'Christine Brooks',
      servicio: 'Electric',
      cantidad: '5',
      fecha: '2024-05-01',
    },
    { id: '00002', lugar: 'Rosie Pearson', servicio: 'Book', cantidad: '10', fecha: '2024-05-02' },
    {
      id: '00003',
      lugar: 'Michael Johnson',
      servicio: 'Water',
      cantidad: '7',
      fecha: '2024-05-03',
    },
    { id: '00004', lugar: 'Sarah Williams', servicio: 'Gas', cantidad: '3', fecha: '2024-05-04' },
    {
      id: '00005',
      lugar: 'David Brown',
      servicio: 'Internet',
      cantidad: '12',
      fecha: '2024-05-05',
    },
  ];

  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'lugar', label: 'Lugar' },
    { key: 'servicio', label: 'Servicio' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'fecha', label: 'Fecha' },
  ];

  onViewItem(row: any) {
    console.log('onViewItem recibido:', row);
    this.router.navigate(['/service-consumption/', row.id, 'view']);
  }

  onEditItem(row: any) {
    console.log('onEditItem recibido:', row);
    this.router.navigate(['/service-consumption/', row.id, 'edit']);
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
