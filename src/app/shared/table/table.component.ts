import { Component } from '@angular/core';

interface TableData {
  id: string;
  lugar: string;
  servicio: string;
  cantidad: string;
  fecha: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  tableData: TableData[] = [
    { id: '00001', lugar: 'Christine Brooks', servicio: '089 Kutch Green Apt. 448', cantidad: '14 Feb 2019', fecha: 'Electric' },
    { id: '00002', lugar: 'Rosie Pearson', servicio: '979 Immanuel Ferry Suite 526', cantidad: '14 Feb 2019', fecha: 'Book' },
    { id: '00003', lugar: 'Michael Johnson', servicio: '123 Main Street Apt. 101', cantidad: '15 Feb 2019', fecha: 'Water' },
    { id: '00004', lugar: 'Sarah Williams', servicio: '456 Oak Avenue', cantidad: '16 Feb 2019', fecha: 'Gas' },
    { id: '00005', lugar: 'David Brown', servicio: '789 Pine Road Suite 202', cantidad: '17 Feb 2019', fecha: 'Internet' },
    { id: '00006', lugar: 'Emily Davis', servicio: '321 Maple Lane', cantidad: '18 Feb 2019', fecha: 'Phone' },
    { id: '00007', lugar: 'Robert Wilson', servicio: '654 Cedar Court Apt. 303', cantidad: '19 Feb 2019', fecha: 'Cable' },
    { id: '00008', lugar: 'Jennifer Taylor', servicio: '987 Birch Street', cantidad: '20 Feb 2019', fecha: 'Maintenance' },
    { id: '00009', lugar: 'Thomas Anderson', servicio: '159 Spruce Avenue Suite 404', cantidad: '21 Feb 2019', fecha: 'Security' },
    { id: '00010', lugar: 'Lisa Martinez', servicio: '753 Elm Boulevard', cantidad: '22 Feb 2019', fecha: 'Cleaning' },
  ];

  searchQuery = '';
  currentPage = 1;
  rowsPerPage = 10;

  get filteredData(): TableData[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.tableData;
    return this.tableData.filter(item =>
      Object.values(item).some(value =>
        value.toLowerCase().includes(query)
      )
    );
  }

  get paginatedData(): TableData[] {
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
