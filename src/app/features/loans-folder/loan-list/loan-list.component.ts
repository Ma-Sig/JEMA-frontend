import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../../shared/table/table.component';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrestamoService, Prestamo } from '../services/loans.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

interface PrestamoTableData {
  id_prestamo: number;
  id_usuario: number;
  lugar_origen: string;
  lugar_destino: string;
  fecha: string;
  total_items?: number;
}

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [TableComponent, RouterModule, CommonModule],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css'],
})
export class LoanListComponent implements OnInit {
  loanData: PrestamoTableData[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  loanColumns = [
    { key: 'id_prestamo', label: 'ID Préstamo', type: 'number' },
    { key: 'id_usuario', label: 'Usuario', type: 'number' },
    { key: 'lugar_origen', label: 'Lugar Origen', type: 'text' },
    { key: 'lugar_destino', label: 'Lugar Destino', type: 'text' },
    { key: 'fecha', label: 'Fecha', type: 'date' },
    { key: 'total_items', label: 'Items', type: 'number' },
  ];

  constructor(private router: Router, private prestamoService: PrestamoService) {}

  async ngOnInit(): Promise<void> {
    await this.loadLoans();
  }

  async loadLoans(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';

      const prestamos = await firstValueFrom(this.prestamoService.getPrestamos());

      // Transformar los datos para la tabla
      this.loanData = prestamos.map((prestamo) => ({
        id_prestamo: prestamo.id_prestamo,
        id_usuario: prestamo.id_usuario,
        lugar_origen: prestamo.origen
          ? prestamo.origen.lugarPadre
            ? `${prestamo.origen.lugarPadre.nombre} - ${prestamo.origen.nombre}`
            : prestamo.origen.nombre
          : 'No especificado',
        lugar_destino: prestamo.destino
          ? prestamo.destino.lugarPadre
            ? `${prestamo.destino.lugarPadre.nombre} - ${prestamo.destino.nombre}`
            : prestamo.destino.nombre
          : 'No especificado',
        fecha: prestamo.fecha,
        total_items: prestamo.items ? prestamo.items.length : 0,
      }));
    } catch (error) {
      console.error('Error al cargar préstamos:', error);
      this.errorMessage = 'No se pudieron cargar los préstamos. Inténtalo de nuevo.';

      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los préstamos.',
        icon: 'error',
        confirmButtonText: 'Reintentar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadLoans();
        }
      });
    } finally {
      this.isLoading = false;
    }
  }

  onViewLoan(row: PrestamoTableData): void {
    console.log('Ver préstamo:', row);
    this.router.navigate(['/loans', row.id_prestamo, 'view']);
  }

  onEditLoan(row: PrestamoTableData): void {
    console.log('Editar préstamo:', row);
    this.router.navigate(['/loans', row.id_prestamo, 'edit']);
  }

  async onDeleteLoan(row: PrestamoTableData): Promise<void> {
    console.log('Eliminar préstamo:', row);

    const confirmed = await this.confirmDeletion(row.id_prestamo);

    if (confirmed) {
      try {
        await firstValueFrom(this.prestamoService.eliminarPrestamo(row.id_prestamo));

        // Actualizar la lista local
        this.loanData = this.loanData.filter((loan) => loan.id_prestamo !== row.id_prestamo);

        Swal.fire({
          title: 'Eliminado!',
          text: `El préstamo #${row.id_prestamo} ha sido eliminado correctamente.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error al eliminar préstamo:', error);

        const errorMessage = this.prestamoService.handleError(error);

        Swal.fire({
          title: 'Error al eliminar',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Entendido',
        });
      }
    }
  }

  private async confirmDeletion(prestamoId: number): Promise<boolean> {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `¿Deseas eliminar el préstamo <strong>#${prestamoId}</strong>?<br><small>Esta acción no se puede deshacer y eliminará todos los items asociados.</small>`,
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
  async refreshLoans(): Promise<void> {
    await this.loadLoans();
  }

  // Método para navegar a crear nuevo préstamo
  createNewLoan(): void {
    this.router.navigate(['/loans/new']);
  }
}
