import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../../shared/table/table.component';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InventoryService, InventoryItemResponse } from '../services/inventories.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

interface InventoryTableData {
  id_item: number;
  codigo: string;
  nombre: string;
  marca: string;
  categoria: string;
  lugar: string;
  estado: string;
}

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [TableComponent, RouterModule, CommonModule],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css'],
})
export class InventoryListComponent implements OnInit {
  inventoryData: InventoryTableData[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  inventoryColumns = [
    { key: 'id_item', label: 'ID Item', type: 'number' },
    { key: 'codigo', label: 'Código', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'marca', label: 'Marca', type: 'text' },
    { key: 'categoria', label: 'Categoría', type: 'text' },
    { key: 'lugar', label: 'Ubicación', type: 'text' },
    { key: 'estado', label: 'Estado', type: 'text' },
  ];

  constructor(private router: Router, private inventoryService: InventoryService) {}

  async ngOnInit(): Promise<void> {
    await this.loadInventoryItems();
  }

  async loadInventoryItems(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';

      // Obtener items de inventario
      const inventoryItems = await firstValueFrom(this.inventoryService.getAllInventoryItems());

      // Obtener datos adicionales para mapear lugares y estados
      const [lugares, estados] = await Promise.all([
        firstValueFrom(this.inventoryService.getAllLugares()),
        firstValueFrom(this.inventoryService.getAllEstados()),
      ]);

      // Mapear los datos para la tabla
      this.inventoryData = inventoryItems.map((item: InventoryItemResponse) => {
        const lugar = lugares.find((l) => l.id_lugar === item.id_lugar);
        const estado = estados.find((e) => e.id_item_estado === item.id_item_estado);

        return {
          id_item: item.id_item,
          codigo: item.codigo,
          nombre: item.caracteristicas.nombre,
          marca: item.caracteristicas.marca,
          categoria: item.caracteristicas.categoria,
          lugar: lugar?.nombre || 'Sin ubicación',
          estado: estado?.estado || 'Sin estado',
        };
      });
    } catch (error) {
      console.error('Error al cargar items de inventario:', error);
      this.errorMessage = 'No se pudieron cargar los items del inventario. Inténtalo de nuevo.';

      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los items del inventario.',
        icon: 'error',
        confirmButtonText: 'Reintentar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadInventoryItems();
        }
      });
    } finally {
      this.isLoading = false;
    }
  }

  onViewInventoryItem(row: InventoryTableData): void {
    console.log('Ver item de inventario:', row);
    this.router.navigate(['/inventory/inventories', row.id_item, 'view']);
  }

  onEditInventoryItem(row: InventoryTableData): void {
    console.log('Editar item de inventario:', row);
    this.router.navigate(['/inventory/inventories', row.id_item, 'edit']);
  }

  async onDeleteInventoryItem(row: InventoryTableData): Promise<void> {
    console.log('Eliminar item de inventario:', row);

    const confirmed = await this.confirmDeletion(row.nombre, row.codigo);

    if (confirmed) {
      try {
        await firstValueFrom(this.inventoryService.deleteInventoryItem(row.id_item));

        // Actualizar la lista local
        this.inventoryData = this.inventoryData.filter((item) => item.id_item !== row.id_item);

        Swal.fire({
          title: 'Eliminado!',
          text: `El item "${row.nombre}" (${row.codigo}) ha sido eliminado correctamente del inventario.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error al eliminar item de inventario:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el item del inventario. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Entendido',
        });
      }
    }
  }

  private async confirmDeletion(itemName: string, itemCode: string): Promise<boolean> {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `¿Deseas eliminar el item <strong>"${itemName}"</strong> con código <strong>"${itemCode}"</strong> del inventario?<br><small>Esta acción no se puede deshacer.</small>`,
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
  async refreshInventory(): Promise<void> {
    await this.loadInventoryItems();
  }

  // Método para navegar a crear nuevo item de inventario
  createNewInventoryItem(): void {
    this.router.navigate(['/inventory/inventories/new']);
  }
}
