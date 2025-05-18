import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/table/table.component';
import { RouterModule, Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [TableComponent, RouterModule],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css'],
})
export class InventoryListComponent {
  constructor(private router: Router) {}

  inventoryData = [
    {
      id: '00001',
      lugar: 'Christine Brooks',
      item: 'Electric',
      cantidad: '5',
      fecha: '2024-05-01',
      estado: 'Activo', // Agregar estado
    },
    {
      id: '00002',
      lugar: 'Rosie Pearson',
      item: 'Book',
      cantidad: '10',
      fecha: '2024-05-02',
      estado: 'Activo', // Agregar estado
    },
    {
      id: '00003',
      lugar: 'Michael Johnson',
      item: 'Water',
      cantidad: '7',
      fecha: '2024-05-03',
      estado: 'Activo', // Agregar estado
    },
    {
      id: '00004',
      lugar: 'Sarah Williams',
      item: 'Gas',
      cantidad: '3',
      fecha: '2024-05-04',
      estado: 'Activo', // Agregar estado
    },
    {
      id: '00005',
      lugar: 'David Brown',
      item: 'Internet',
      cantidad: '12',
      fecha: '2024-05-05',
      estado: 'Activo', // Agregar estado
    },
  ];

  inventoryColumns = [
    { key: 'id', label: 'Código' },
    { key: 'lugar', label: 'Lugar' },
    { key: 'item', label: 'Item' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'estado', label: 'Estado' },
  ];

  onViewItem(row: any) {
    console.log('onViewItem recibido:', row);
    this.router.navigate(['/inventory/inventories', row.id, 'view']);
  }

  onEditItem(row: any) {
    console.log('onEditItem recibido:', row);
    this.router.navigate(['/inventory/inventories', row.id, 'edit']);
  }

  async onDeleteItem(row: any) {
    console.log('onDeleteItem recibido:', row);

    const confirmed = await this.confirmDeletion();

    if (confirmed) {
      this.inventoryData = this.inventoryData.filter((item) => item.id !== row.id);
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
