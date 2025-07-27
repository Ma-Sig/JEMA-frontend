import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../../shared/table/table.component';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ItemService, CaracteristicasItemResponse } from '../services/items.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

interface ItemTableData {
  id_caracteristicas_item: number;
  nombre: string;
  marca: string;
  descripcion: string;
  imagen: string | null;
}

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [TableComponent, RouterModule, CommonModule],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent implements OnInit {
  inventoryData: ItemTableData[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  inventoryColumns = [
    { key: 'id_caracteristicas_item', label: 'ID', type: 'number' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'marca', label: 'Marca', type: 'text' },
    { key: 'descripcion', label: 'Descripción', type: 'text' },
  ];

  constructor(private router: Router, private itemService: ItemService) {}

  async ngOnInit(): Promise<void> {
    await this.loadItems();
  }

  async loadItems(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';

      const items = await firstValueFrom(this.itemService.getAllItems());
      this.inventoryData = items;
    } catch (error) {
      console.error('Error al cargar items:', error);
      this.errorMessage = 'No se pudieron cargar los items. Inténtalo de nuevo.';

      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los items.',
        icon: 'error',
        confirmButtonText: 'Reintentar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadItems();
        }
      });
    } finally {
      this.isLoading = false;
    }
  }

  onViewItem(row: ItemTableData): void {
    console.log('Ver item:', row);
    this.router.navigate(['/inventory/items', row.id_caracteristicas_item, 'view']);
  }

  onEditItem(row: ItemTableData): void {
    console.log('Editar item:', row);
    this.router.navigate(['/inventory/items', row.id_caracteristicas_item, 'edit']);
  }

  async onDeleteItem(row: ItemTableData): Promise<void> {
    console.log('Eliminar item:', row);

    const confirmed = await this.confirmDeletion(row.nombre);

    if (confirmed) {
      try {
        await firstValueFrom(this.itemService.deleteItem(row.id_caracteristicas_item));

        // Actualizar la lista local
        this.inventoryData = this.inventoryData.filter(
          (item) => item.id_caracteristicas_item !== row.id_caracteristicas_item
        );

        Swal.fire({
          title: 'Eliminado!',
          text: `El item "${row.nombre}" ha sido eliminado correctamente.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error al eliminar item:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el item. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Entendido',
        });
      }
    }
  }

  private async confirmDeletion(itemName: string): Promise<boolean> {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `¿Deseas eliminar el item <strong>"${itemName}"</strong>?<br><small>Esta acción no se puede deshacer.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
    });

    return result.isConfirmed;
  }

  // Método para refrescar la lista
  async refreshItems(): Promise<void> {
    await this.loadItems();
  }

  // Método para navegar a crear nuevo item
  createNewItem(): void {
    this.router.navigate(['/inventory/items/new']);
  }
}
