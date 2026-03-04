import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AssistenciesManagerService } from '../../../shared/services/assistencies/assistencies-manager.service';

@Component({
  selector: 'app-llista-faltes',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './llista-faltes.component.html',
  styleUrl: './llista-faltes.component.css',
})
export class LlistaFaltesComponent implements OnInit {
  assistenciesManager = inject(AssistenciesManagerService);

  ngOnInit() {
    this.assistenciesManager.carregarAssistencies();
  }

  faltas = '';

  assitenciesRanking = computed(() => {
    const llistaAssis = this.assistenciesManager.assistencies();

    const acumulador: any = {};

    for (const assis of llistaAssis) {
      if (assis.estat === 'Falta') {
        const nomAssig = assis.inscripcio?.assignatura?.nom || 'Sense Asignatura';
        const nomAlumne = assis.inscripcio?.alumne?.nom || 'Anònim';

        if (!acumulador[nomAssig]) {
          acumulador[nomAssig] = {};
        }
        if (!acumulador[nomAssig][nomAlumne]) {
          acumulador[nomAssig][nomAlumne] = 0;
        }
      
        acumulador[nomAssig][nomAlumne]++;
      }
    }

    return acumulador;
  });
}
