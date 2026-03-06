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
  private assistenciesManager = inject(AssistenciesManagerService);

  ngOnInit() {
    this.assistenciesManager.carregarAssistencies();
  }

  faltas = '';

  assitenciesRanking = computed(() => {
    const llistaAssis = this.assistenciesManager.assistencies();

    // Primer de tot, ens quedem només amb els que han faltat
    const totesLesFaltes = [];

    for (let i = 0; i < llistaAssis.length; i++) {
      if (llistaAssis[i].estat === 'Falta') {
        totesLesFaltes.push(llistaAssis[i]);
      }
    }

    // Els agruparem per alumne i assignatura: comptem quantes faltes té cada nen per cada assignatura.
    // Format de la llista:
    // [ { nomAlumne: 'Joan', nomAssignatura: 'Matemàtiques', totalFaltes: 3 } ]

    const diccionariAlumnesAssignatures: any = {};

    for (let i = 0; i < totesLesFaltes.length; i++) {
      const assis = totesLesFaltes[i];

      // 1. Obtenim el nom de l'alumne (Nom + Cognom)
      // Si la informació d'inscripció o alumne no existeix, posem un valor per defecte.
      let nomAlumne = 'Alumne Desconegut';
      if (assis.inscripcio && assis.inscripcio.alumne) {
        const nom = assis.inscripcio.alumne.nom || '';
        const cognom = assis.inscripcio.alumne.cognom || '';
        nomAlumne = (nom + ' ' + cognom).trim();
      }

      // 2. Obtenim el nom de l'assignatura
      let nomAssignatura = 'Assignatura Desconeguda';
      if (assis.inscripcio && assis.inscripcio.assignatura) {
        nomAssignatura = assis.inscripcio.assignatura.nom;
      }

      // 3. Creem una clau única que identifiqui la combinació Alumne-Assignatura
      // Això ens permetrà agrupar totes les faltes d'un mateix alumne en una mateixa assignatura.
      const clauUnica = nomAlumne + '|||' + nomAssignatura;

      // 4. Si és la primera vegada que trobem aquesta combinació, inicialitzem l'objecte al diccionari.
      if (!diccionariAlumnesAssignatures[clauUnica]) {
        diccionariAlumnesAssignatures[clauUnica] = {
          alumne: nomAlumne,
          assignatura: nomAssignatura,
          faltes: 0 // Comencem el comptador a zero
        };
      }

      // 5. Incrementem el comptador de faltes per a aquest Alumne i Assignatura concrets.
      diccionariAlumnesAssignatures[clauUnica].faltes++;
    }

    // Passem el diccionari a una llista (array) ordenadeta per l'HTML
    const rankingArray = [];
    for (const clau in diccionariAlumnesAssignatures) {
      rankingArray.push({
        nomAlumne: diccionariAlumnesAssignatures[clau].alumne,
        nomAssignatura: diccionariAlumnesAssignatures[clau].assignatura,
        totalFaltes: diccionariAlumnesAssignatures[clau].faltes
      });
    }

    // Finalment, ho endrecem amb els alumnes amb més faltes primer
    rankingArray.sort((a, b) => b.totalFaltes - a.totalFaltes);

    return rankingArray;
  });
}
