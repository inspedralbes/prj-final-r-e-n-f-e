import { Component, inject, computed, OnInit } from '@angular/core';
import { SidebarAdminComponent } from '../../shared/components/sidebaradmin/sidebar.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { UsuarisManagerService } from '../../shared/services/usuaris/usuaris-manager.service';
import { AssignaturesManagerService } from '../../shared/services/assignatures/assignatures-manager.service';
import { InscritsManagerService } from '../../shared/services/inscrits/inscrits-manager.service';
@Component({
  selector: 'app-administracio',
  standalone: true,
  imports: [SidebarAdminComponent, BaseChartDirective],
  templateUrl: './administracio.component.html',
  styleUrl: './administracio.component.css',
})
export class AdministracioComponent implements OnInit {
  private usuarisManager = inject(UsuarisManagerService);
  private assignaturesManager = inject(AssignaturesManagerService);
  private inscritsManager = inject(InscritsManagerService);

  public usuaris = this.usuarisManager.usuaris;
  public assignatures = this.assignaturesManager.assignatures;
  public inscrits = this.inscritsManager.inscrits;

  public professor: any[] = [];
  public alumne: any[] = [];
  public admin: any[] = [];
  public numInscrits: any = [];
  public assignatura: any = [];

  ngOnInit(): void {
    this.usuarisManager.carregarUsuaris();
    this.assignaturesManager.carregarAssignatures();
    this.inscritsManager.carregarInscrits();
  }

  graficUsuaris() {
    this.admin = [];
    this.professor = [];
    this.alumne = [];

    for (let i = 0; i < this.usuaris().length; i++) {
      if (this.usuaris()[i].rol === 'Admin') {
        this.admin.push(this.usuaris()[i]);
      } else if (this.usuaris()[i].rol === 'Profe') {
        this.professor.push(this.usuaris()[i]);
      } else {
        this.alumne.push(this.usuaris()[i]);
      }
    }
  }

  graficAssignaturesInscrits() {
    this.numInscrits = [];
    this.assignatura = [];

    for (let i = 0; i < this.assignatures().length; i++) {
      this.assignatura.push(this.assignatures()[i].nom);
      let cont = 0;
      for (let j = 0; j < this.inscrits().length; j++) {
        if (this.inscrits()[j].id_assignatura === this.assignatures()[i].id) {
          cont++;
        }
      }
      this.numInscrits.push(cont);
    }
  }

  // --- GRÀFIC DE BARRES: Assignatures ---

  barDataAssignatures = computed(() => {
    this.graficAssignaturesInscrits();
    return {
      labels: this.assignatura,
      datasets: [
        {
          label: "Nombre d'inscrits",
          data: this.numInscrits,
          backgroundColor: 'rgba(252, 142, 219, 1)',
          borderColor: 'rgba(241, 99, 194, 1)',
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 30,
        },
      ],
    };
  });

  barOptionsAssignatures: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // --- GRÀFIC DE BARRES: Usuaris ---

  barData = computed(() => {
    this.graficUsuaris();
    return {
      labels: ['Professors', 'Alumnes', 'Administradors'],
      datasets: [
        {
          label: "Nombre d'usuaris",
          data: [this.professor.length, this.alumne.length, this.admin.length],
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 30,
        },
      ],
    };
  });

  // Opcions visuals del gràfic
  barOptions: ChartOptions<'bar'> = {
    responsive: true, // S'adapta a l'amplada del contenidor
    maintainAspectRatio: false, // Permet controlar l'alçada amb CSS
    plugins: {
      legend: {
        position: 'top', // La llegenda apareix a dalt
      },
    },
    scales: {
      y: {
        beginAtZero: true, // L'eix Y comença des de 0
      },
    },
  };
}
