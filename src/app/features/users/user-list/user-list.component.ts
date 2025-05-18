import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/table/table.component';
import { Router, RouterLink } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  imports: [TableComponent, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  constructor(private router: Router) {}

  inventoryData = [
    {
      nombres: 'Christine',
      apellidos: 'Brooks',
      cedula: '0109383728',
      email: 'c@brooks.com',
      usuario: 'cbrooks',
    },
    {
      nombres: 'Rosie',
      apellidos: 'Pearson',
      cedula: '0302910923',
      email: 'r@pearson.com',
      usuario: 'rpearson',
    },
    {
      nombres: 'Michael',
      apellidos: 'Johnson',
      cedula: '0103928392',
      email: 'm@johnson.com',
      usuario: 'mjohnson',
    },
    {
      nombres: 'Sarah',
      apellidos: 'Williams',
      cedula: '0108378783',
      email: 's@williams@.com',
      usuario: 'swilliams',
    },
    {
      nombres: 'David',
      apellidos: 'Brown',
      cedula: '0509383472',
      email: 'd@brown.com',
      usuario: 'dbrown',
    },
  ];

  inventoryColumns = [
    { key: 'nombres', label: 'Nombre' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'email', label: 'E-mail' },
    { key: 'usuario', label: 'Usuario' },
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
      this.inventoryData = this.inventoryData.filter((item) => item.apellidos !== row.id);
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
