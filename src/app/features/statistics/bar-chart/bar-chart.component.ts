import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { TransferState } from '@angular/core';
import { makeStateKey } from '@angular/core';

import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  ChartType,
  ChartOptions,
  ChartData,
} from 'chart.js';

// Registrar los componentes que usará la gráfica
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

const DATA_KEY = makeStateKey<any>('my-data');

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent implements OnInit {
  @Input({ required: true }) title: string = 'Gráfico de barras';
  @Input({ required: true }) xAxisLabel: string = 'Meses';
  @Input({ required: true }) yAxisLabel: string = 'Cantidad';
  @Input({ required: true }) xLabels: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];
  @Input({ required: true }) datasets: { label: string; data: number[] }[] = [];

  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartOptions = {};
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  private data: any[] = [];
  colorPalette = [
    {
      borderColor: '#3B82F6', // blue-500
      backgroundColor: '#BFDBFE', // blue-200
    },
    {
      borderColor: '#10B981', // emerald-500
      backgroundColor: '#A7F3D0', // emerald-200
    },
    {
      borderColor: '#F59E0B', // amber-500
      backgroundColor: '#FDE68A', // amber-200
    },
    {
      borderColor: '#EF4444', // red-500
      backgroundColor: '#FCA5A5', // red-200
    },
    {
      borderColor: '#8B5CF6', // violet-500
      backgroundColor: '#DDD6FE', // violet-200
    },
    {
      borderColor: '#EC4899', // pink-500
      backgroundColor: '#FBCFE8', // pink-200
    },
    {
      borderColor: '#14B8A6', // teal-500
      backgroundColor: '#99F6E4', // teal-200
    },
  ];

  constructor(private transferState: TransferState) {}

  ngOnInit(): void {
    if (this.transferState.hasKey(DATA_KEY)) {
      this.data = this.transferState.get(DATA_KEY, null);
      this.transferState.remove(DATA_KEY); // Limpia si ya no es necesario
    } else {
      this.initChart();
    }
  }

  initChart(): void {
    this.barChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: this.title,
          font: { size: 20 },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: this.xAxisLabel,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: this.yAxisLabel,
          },
        },
      },
    };

    this.barChartData = {
      labels: this.xLabels,
      datasets: this.datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: this.colorPalette[index % this.colorPalette.length].borderColor,
      })),
    };
  }
}
