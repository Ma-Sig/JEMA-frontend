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

  ngOnInit(): void {
    this.loadSystemData();
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
