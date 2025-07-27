import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TableColumn {
  key: string;
  label: string;
  type?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() showActions = true;
  @Input() actions = {
    view: true,
    edit: true,
    delete: true,
  };

  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  searchQuery = '';
  currentPage = 1;
  rowsPerPage = 10;

  get filteredData(): any[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.data;
    return this.data.filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(query))
    );
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredData.slice(start, start + this.rowsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.rowsPerPage);
  }

  get paginationInfo(): string {
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(start + this.rowsPerPage - 1, this.filteredData.length);
    return `Mostrando ${start}-${end} de ${this.filteredData.length} registros`;
  }

  onView(row: any) {
    console.log('onView emitido con: ', row); // Añadir log para depuración
    this.view.emit(row);
  }

  onEdit(row: any) {
    console.log('onEdit emitido con: ', row); // Añadir log para depuración
    this.edit.emit(row);
  }

  onDelete(row: any) {
    console.log('onDelete emitido con: ', row); // Añadir log para depuración
    this.delete.emit(row);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }
}
