import { Component } from '@angular/core';
import { SidebarAdminComponent } from '../../shared/components/sidebaradmin/sidebar.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-administracio',
  standalone: true,
  imports: [SidebarAdminComponent, BaseChartDirective],
  templateUrl: './administracio.component.html',
  styleUrl: './administracio.component.css',
})
export class AdministracioComponent {

  // --- GRÀFIC DE BARRES: Assistència mensual ---

  // Les etiquetes de l'eix X (cada barra)
  barLabels: string[] = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny'];

  // Les dades: cada objecte dins de "datasets" és una sèrie de dades
  barData: ChartData<'bar'> = {
    labels: this.barLabels,
    datasets: [
      {
        label: 'Assistències',
        data: [120, 98, 135, 110, 142, 88],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',   // --primary-color amb opacitat
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8,                               // Cantons arrodonits a les barres
      },
      {
        label: 'Faltes',
        data: [15, 22, 10, 18, 8, 30],
        backgroundColor: 'rgba(244, 114, 182, 0.7)',   // --accent-color amb opacitat
        borderColor: 'rgba(244, 114, 182, 1)',
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  // Opcions visuals del gràfic
  barOptions: ChartOptions<'bar'> = {
    responsive: true,           // S'adapta a l'amplada del contenidor
    maintainAspectRatio: false, // Permet controlar l'alçada amb CSS
    plugins: {
      legend: {
        position: 'top',        // La llegenda apareix a dalt
      }
    },
    scales: {
      y: {
        beginAtZero: true,      // L'eix Y comença des de 0
      }
    }
  };

}
