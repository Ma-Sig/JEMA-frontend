import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent implements OnChanges {
  @Input() title = 'Gráfico de barras';
  @Input() xAxisLabel = 'Meses';
  @Input() yAxisLabel = 'Cantidad';
  @Input() xLabels: string[] = [];
  @Input() datasets: any[] = [];

  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartOptions = {};
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datasets'] || changes['xLabels']) {
      if (this.datasets?.length && this.xLabels?.length) {
        console.log('✅ Actualizando gráfico con datasets:', this.datasets);
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
          datasets: this.datasets.map((d, i) => ({
            ...d,
            backgroundColor: this.getColor(i),
          })),
        };
      } else {
        console.warn('⚠️ Datasets o xLabels vacíos, se ignora actualización');
      }
    }
  }

  private getColor(index: number): string {
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
    return colors[index % colors.length];
  }
}
