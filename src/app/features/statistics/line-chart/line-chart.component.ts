import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

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

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent {
  public lineChartType: ChartType = 'line';

  public lineChartOptions: ChartOptions = {
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
        text: 'Gráfico de líneas dinámico e interactivo',
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Meses',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valores',
        },
      },
    },
  };

  public lineChartData: ChartData<'line'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Ventas 2024',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: '#3B82F6',
        backgroundColor: '#BFDBFE',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'Ventas 2025',
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: '#10B981',
        backgroundColor: '#A7F3D0',
        fill: false,
        tension: 0.3,
      },
    ],
  };
}
