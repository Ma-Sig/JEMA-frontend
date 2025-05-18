import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/table/table.component';
import { RouterModule, Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [TableComponent,RouterModule],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.css'
})
export class LoanListComponent {
  constructor(private router: Router) {}


  inventoryColumns = [
    { key: 'id', label: 'Código' },
    { key: 'lugarO', label: 'Lugar Origen' },
    { key: 'lugarD', label: 'Lugar Destino' },
    { key: 'item', label: 'Item' },
  ];
  inventoryData = [
    {
      id: '00001',
      lugarO: 'Christine Brooks',
      lugarD: 'Rosie Pearson',
      item: 'Electric',
    },
    {
      id: '00002',
      lugarO: 'Michael Johnson',
      lugarD: 'Sarah Williams',
      item: 'Book',
    },
    {
      id: '00003',
      lugarO: 'David Brown',
      lugarD: 'Christine Brooks',
      item: 'Water',
    },
  ]
  onViewItem(row: any) {
      console.log('onViewItem recibido:', row);
      this.router.navigate(['/loans-folder/loans', row.id, 'view']);
    }
  
    onEditItem(row: any) {
      console.log('onEditItem recibido:', row);
      this.router.navigate(['/loans-folder/loans', row.id, 'edit']);
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
