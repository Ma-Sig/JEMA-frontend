import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';

@Component({
  selector: 'app-statistics-dashboard',
  standalone: true,
  imports: [CommonModule, BarChartComponent, LineChartComponent],
  templateUrl: './statistics-dashboard.component.html',
  styleUrl: './statistics-dashboard.component.css',
})
export class StatisticsDashboardComponent {}
