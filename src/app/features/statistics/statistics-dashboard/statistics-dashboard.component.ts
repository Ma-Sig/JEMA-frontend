import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { CheckListComponent } from '../../../shared/check-list/check-list.component';

@Component({
  selector: 'app-statistics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BarChartComponent,
    LineChartComponent,
    DropdownComponent,
    CheckListComponent,
  ],
  templateUrl: './statistics-dashboard.component.html',
  styleUrl: './statistics-dashboard.component.css',
})
export class StatisticsDashboardComponent implements OnInit {
  selectedLocation = '';
  locations: string[] = [];
  selectedItem = '';
  items: string[] = [];
  itemsPerLocationXLabels: string[] = [];
  itemsPerLocationDatasets: any[] = [];

  ngOnInit(): void {
    this.loadSystemData();
    this.itemsPerLocationXLabels.push('Ene');
    this.itemsPerLocationXLabels.push('Feb');
    this.itemsPerLocationXLabels.push('Mar');
    this.itemsPerLocationXLabels.push('Abr');
    this.itemsPerLocationXLabels.push('May');
    this.itemsPerLocationXLabels.push('Jun');
    this.itemsPerLocationXLabels.push('Jul');

    this.itemsPerLocationDatasets = [
      {
        label: 'Computadora',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        label: 'Proyector',
        data: [28, 48, 40, 19, 86, 27, 90],
      },
    ];
  }

  loadSystemData() {
    this.locations.push('Aula 1');
    this.locations.push('Aula 2');
    this.locations.push('Aula 3');

    this.items.push('Computadora');
    this.items.push('Proyector');
    this.items.push('Silla');
  }

  onLocationChange(value: string) {
    console.log('Estado seleccionado:', value);
    this.selectedLocation = value;
  }

  onItemChange(value: string) {
    console.log('Tipo seleccionado:', value);
    this.selectedItem = value;
  }
}
