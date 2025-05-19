import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { TransferState } from '@angular/core';
import { makeStateKey } from '@angular/core';

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartType,
  ChartOptions,
  ChartData,
} from 'chart.js';

// Registrar los componentes que usará la gráfica
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

const DATA_KEY = makeStateKey<any>('my-data');

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit {
  @Input({ required: true }) title: string = 'Gráfico de barras';
  @Input({ required: true }) xAxisLabel: string = 'Meses';
  @Input({ required: true }) yAxisLabel: string = 'Cantidad';
  @Input({ required: true }) xLabels: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];
  @Input({ required: true }) datasets: { label: string; data: number[] }[] = [];

  public lineChartType: ChartType = 'line';
  public lineChartOptions: ChartOptions = {};
  public lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
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

  private data: any[] = [];

  ngOnInit(): void {
    if (this.transferState.hasKey(DATA_KEY)) {
      this.data = this.transferState.get(DATA_KEY, null);
      this.transferState.remove(DATA_KEY);
    } else {
      this.initChart();
    }
  }

  initChart(): void {
    this.lineChartOptions = {
      responsive: true,
      interaction: {
        mode: 'nearest',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          onClick: (e, legendItem, legend) => {
            const datasetIndex = legendItem.datasetIndex;
            if (datasetIndex === undefined) return;
            const chart = legend.chart;
            const meta = chart.getDatasetMeta(datasetIndex);
            // Alterna visibilidad:
            meta.hidden =
              meta.hidden === null ? !chart.data.datasets[datasetIndex].hidden : !meta.hidden;
            chart.update();
          },
        },
        tooltip: {
          enabled: true,
          mode: 'nearest',
          intersect: false,
        },
        title: {
          display: true,
          text: this.title,
          font: {
            size: 20,
          },
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

    this.lineChartData = {
      labels: this.xLabels,
      datasets: this.datasets.map((dataset, index) => ({
        ...dataset,
        borderColor: this.colorPalette[index % this.colorPalette.length].borderColor,
        backgroundColor: this.colorPalette[index % this.colorPalette.length].backgroundColor,
        fill: false,
        tension: 0.3,
      })),
    };
  }
}
