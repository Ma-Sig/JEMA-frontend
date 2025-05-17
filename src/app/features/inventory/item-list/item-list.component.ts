import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/table/table.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [TableComponent, RouterModule],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent {
  inventoryData = [
    { id: '00001', lugar: 'Christine Brooks', servicio: 'Electric', cantidad: '5', fecha: '2024-05-01' },
    { id: '00002', lugar: 'Rosie Pearson', servicio: 'Book', cantidad: '10', fecha: '2024-05-02' },
    { id: '00003', lugar: 'Michael Johnson', servicio: 'Water', cantidad: '7', fecha: '2024-05-03' },
    { id: '00004', lugar: 'Sarah Williams', servicio: 'Gas', cantidad: '3', fecha: '2024-05-04' },
    { id: '00005', lugar: 'David Brown', servicio: 'Internet', cantidad: '12', fecha: '2024-05-05' },
  ];

  inventoryColumns = [
    { key: 'id', label: 'ID' },
    { key: 'lugar', label: 'Lugar' },
    { key: 'servicio', label: 'Servicio' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'fecha', label: 'Fecha' },
  ];

  onViewItem(row: any) {
    console.log('onViewItem recibido:', row); // Añadir log para depuración
  }

  onEditItem(row: any) {
    console.log('onEditItem recibido:', row); // Añadir log para depuración
  }

  onDeleteItem(row: any) {
    console.log('onDeleteItem recibido:', row); // Añadir log para depuración
  }
}
