import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], fileName: string) {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
