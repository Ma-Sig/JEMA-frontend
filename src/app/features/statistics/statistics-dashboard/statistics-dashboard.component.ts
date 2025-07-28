import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { StatisticsService } from '../services/statistics.service';
import { ButtonComponent } from '../../../shared/button/button.component';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

import * as tf from '@tensorflow/tfjs';
import Swal from 'sweetalert2';

interface LugarPadre {
  id_lugar: number;
  nombre: string;
}

interface Lugar {
  id_lugar: number;
  id_lugar_padre: number;
  nombre: string;
  descripcion: string;
  lugarPadre: LugarPadre;
}

interface Unit {
  id_unidad: number;
  nombre: string;
}
interface Service {
  id_servicio: number;
  id_unidad: number;
  nombre: string;
  precio: number;
  unidades: Unit;
}
@Component({
  selector: 'app-statistics-dashboard',
  standalone: true,
  imports: [CommonModule, DropdownComponent, ButtonComponent, BaseChartDirective],
  templateUrl: './statistics-dashboard.component.html',
  styleUrl: './statistics-dashboard.component.css',
})
export class StatisticsDashboardComponent implements OnInit {
  months: any[] = [];

  locations: Lugar[] = [];
  items: any[] = [];

  s1SelectedLocation: Lugar | null = null;
  s1FilteredItems: any = null;

  s2InitialMonthSelected: any = null;
  s2FinalMonthSelected: any = null;
  nextServiceConsumption: number | null = null;

  s3CompesumptionByService: any[] = [];

  // ================ Datos para Bar Chart ================
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [], // categorías
    datasets: [], // cantidad por categoría
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad de ítems',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Categorías',
        },
      },
    },
  };

  public barChartLegend = true;
  //================================================

  // ========= Consumo de servicios general =========
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Consumo (€)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Meses',
        },
      },
    },
  };

  public lineChartLegend = true;

  // ================================================

  constructor(private statisticsService: StatisticsService) {}

  async ngOnInit(): Promise<void> {
    this.months = [
      { id: 1, name: 'Enero' },
      { id: 2, name: 'Febrero' },
      { id: 3, name: 'Marzo' },
      { id: 4, name: 'Abril' },
      { id: 5, name: 'Mayo' },
      { id: 6, name: 'Junio' },
      { id: 7, name: 'Julio' },
      { id: 8, name: 'Agosto' },
      { id: 9, name: 'Septiembre' },
      { id: 10, name: 'Octubre' },
      { id: 11, name: 'Noviembre' },
      { id: 12, name: 'Diciembre' },
    ];

    await this.loadSystemData();
  }

  private async loadSystemData() {
    this.locations = await this.statisticsService.getLugares();

    const year = new Date().getFullYear();
    this.s3CompesumptionByService = await this.statisticsService.getConsumptionByService(year);
    console.log('Consumo por servicio:', this.s3CompesumptionByService);
  }

  // ============== Seccion de items por lugar =============
  public async onS1SelectedLocationChange(value: Lugar) {
    this.s1SelectedLocation = value;
    this.s1FilteredItems = await this.statisticsService.getItemsByLocation(value.id_lugar);
    this.processBarChartData(this.s1FilteredItems);
  }

  private processBarChartData(items: any[]) {
    // Contar ítems por categoría
    const categoryCounts: { [key: string]: number } = {};

    items.forEach((item) => {
      const categoria = item.caracteristicas?.categoria || 'Sin Categoría';
      categoryCounts[categoria] = (categoryCounts[categoria] || 0) + 1;
    });

    // Crear etiquetas y datos para el gráfico
    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Cantidad de ítems',
          data: data,
          backgroundColor: 'rgba(79, 70, 229, 0.7)', // color de las barras
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 1,
        },
      ],
    };
  }

  // ============== Seccion de consumo de servicios =============
  public onS2InitialMonthSelectedChange(value: any) {
    this.s2InitialMonthSelected = value;
  }

  public onS2FinalMonthSelectedChange(value: any) {
    this.s2FinalMonthSelected = value;
  }

  public async getGeneralServiceConsumption() {
    if (!this.s2InitialMonthSelected || !this.s2FinalMonthSelected) {
      Swal.fire('Error', 'Por favor, selecciona un rango de meses.', 'error');
      return;
    }

    const year = new Date().getFullYear();
    const response = await this.statisticsService.getServicesConsumption(
      year,
      this.s2InitialMonthSelected.id,
      this.s2FinalMonthSelected.id
    );
    console.log('Consumo de servicios general:', response);
    this.processChartData(response);
    // this.nextServiceConsumption =
  }

  private processChartData(responseData: any[]) {
    const monthNames = this.months.map((m) => m.name);

    // Ordenar los datos por mes numérico
    const sortedData = [...responseData].sort((a, b) => parseInt(a.mes) - parseInt(b.mes));

    // Crear etiquetas (nombres de meses)
    const labels = sortedData.map((item) => {
      const monthIndex = parseInt(item.mes) - 1;
      return monthNames[monthIndex] || `Mes ${item.mes}`;
    });

    // Crear dataset
    const dataset = {
      data: sortedData.map((item) => item.total_mensual),
      label: 'Consumo General',
      fill: true,
      tension: 0.3,
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      pointBackgroundColor: '#4f46e5',
    };

    // Actualizar los datos del gráfico
    this.lineChartData = {
      labels: labels,
      datasets: [dataset],
    };
  }
}
