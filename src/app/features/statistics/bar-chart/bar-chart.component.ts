import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

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

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent {
  public barChartType: ChartType = 'bar';

  public barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfico barras por meses',
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
          text: 'Ventas',
        },
      },
    },
  };

  public barChartData: ChartData<'bar'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: '2024',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: '#3B82F6',
      },
      {
        label: '2025',
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: '#10B981',
      },
    ],
  };
}
