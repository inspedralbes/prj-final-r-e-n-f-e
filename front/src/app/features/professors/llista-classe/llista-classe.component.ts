import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { InscritsManagerService } from '../../../shared/services/inscrits/inscrits-manager.service';
import { AssistenciesManagerService } from '../../../shared/services/assistencies/assistencies-manager.service';
import { HorarisManagerService } from '../../../shared/services/horaris/horaris-manager.service';
import { getSimbolAssistencia } from '../../../shared/utils/assistencia-utils';
import { Horari } from '../../../shared/models/horaris.model';

@Component({
  selector: 'app-llista-classe',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: './llista-classe.component.html',
  styleUrl: './llista-classe.component.css',
})
export class LlistaClasseComponent implements OnInit {
  private inscritsManager = inject(InscritsManagerService);
  private assistenciesManager = inject(AssistenciesManagerService);
  private horarisManager = inject(HorarisManagerService);

  diesSetmana = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'];
  datesSetmana: string[] = []; // Formatat per mostrar (DD/MM)
  datesRealsLaravel: string[] = []; // Formatat per a la BD (YYYY-MM-DD)

  // Sessions del professor: filtrem els horaris per l'usuari loguejat
  sessionsProfessor = computed(() => {
    const totsElsHoraris = this.horarisManager.horaris();
    const usuariLoguejat = JSON.parse(localStorage.getItem('usuari') || '{}');
    const llistaFiltrada: Horari[] = [];

    // Bucle per trobar només les sessions d'aquest professor
    for (let i = 0; i < totsElsHoraris.length; i++) {
      const h = totsElsHoraris[i];
      if (h.id_professor === usuariLoguejat.id) {
        llistaFiltrada.push(h);
      }
    }

    // Ordenem per hora (exemple: L1, L2, L3...)
    llistaFiltrada.sort((a: Horari, b: Horari) => a.codi_hora.localeCompare(b.codi_hora));

    return llistaFiltrada;
  });

  sessioSeleccionadaId = signal<number | null>(null);

  async ngOnInit() {
    this.inscritsManager.carregarInscrits();
    this.assistenciesManager.carregarAssistencies();
    await this.horarisManager.carregarHoraris();

    this.calcularDatesSetmana();

    // Seleccionem la primera sessió si n'hi ha
    const sessions = this.sessionsProfessor();
    if (sessions.length > 0) {
      this.sessioSeleccionadaId.set(sessions[0].id ?? null);
    }
  }

  // Calcula els 5 dies de la setmana laboral actual (Dilluns-Divendres)
  calcularDatesSetmana() {
    const avui = new Date();
    const diaSetmana = avui.getDay() || 7; // Diumenge(0) -> 7
    const dilluns = new Date(avui);
    dilluns.setDate(avui.getDate() - diaSetmana + 1);

    for (let i = 0; i < 5; i++) {
      const dia = new Date(dilluns);
      dia.setDate(dilluns.getDate() + i);

      // Formatem per a la UI (Exemple: 15/03)
      const diaFormatat = dia.getDate().toString().padStart(2, '0') + '/' + (dia.getMonth() + 1).toString().padStart(2, '0');
      this.datesSetmana.push(diaFormatat);

      // Formatem per a la Base de Dades (Exemple: 2024-03-15)
      const anyBD = dia.getFullYear();
      const mesBD = (dia.getMonth() + 1).toString().padStart(2, '0');
      const diaBD = dia.getDate().toString().padStart(2, '0');
      this.datesRealsLaravel.push(`${anyBD}-${mesBD}-${diaBD}`);
    }
  }

  // Obté els alumnes de la sessió escollida i el seu estat per a cada dia de la setmana
  alumnesFiltrats = computed(() => {
    const idSessio = this.sessioSeleccionadaId();
    if (!idSessio) return [];

    const totsElsInscrits = this.inscritsManager.inscrits();
    const totesAssistencies = this.assistenciesManager.assistencies();
    const resultat = [];

    // 1. Busquem quins alumnes estan inscrits en aquesta sessió (Horari)
    for (let i = 0; i < totsElsInscrits.length; i++) {
      const inscripcio = totsElsInscrits[i];

      if (inscripcio.id_horari === idSessio) {
        const assistenciaSetmanal: any = {};

        // 2. Per a cada alumne trobat, mirem la seva falta per a cada dia de la setmana (Dilluns a Divendres)
        for (let j = 0; j < this.datesSetmana.length; j++) {
          const diaVisible = this.datesSetmana[j];
          const dataBD = this.datesRealsLaravel[j];

          // 3. Busquem si hi ha un registre de falta per a aquest Alumne + Dia concrete
          let asis = null;
          for (let k = 0; k < totesAssistencies.length; k++) {
            const a = totesAssistencies[k];
            if (a.id_inscripcio === inscripcio.id && a.data && a.data.substring(0, 10) === dataBD) {
              asis = a;
              break; // Aturem la cerca al primer que trobem
            }
          }

          // Guardem el símbol (., F, R) o es queda buit si no hi ha dades
          assistenciaSetmanal[diaVisible] = asis ? getSimbolAssistencia(asis.estat, !!asis.justificat) : '';
        }

        // 4. Afegim tota la informació de l'alumne procesat a la llista final
        resultat.push({
          id: inscripcio.id_alumne,
          id_inscripcio_db: inscripcio.id,
          nom: (inscripcio.alumne?.nom || '') + ' ' + (inscripcio.alumne?.cognom || ''),
          avatar: this.obtenirInicialsAlumne(inscripcio.alumne),
          assistencia: assistenciaSetmanal
        });
      }
    }

    return resultat;
  });

  obtenirInicialsAlumne(alumne: any): string {
    if (!alumne) return '??';
    const nom = alumne.nom?.charAt(0) || '';
    const cognom = alumne.cognom?.charAt(0) || '';
    return (nom + cognom).toUpperCase();
  }

  canviarSessio(event: any) {
    this.sessioSeleccionadaId.set(Number(event.target.value));
  }

  // Guarda o actualitza l'estat d'assistència a la Base de Dades
  async guardarAssistencia(alumne: any, dataVisible: string, nouEstat: string) {
    const indexDia = this.datesSetmana.indexOf(dataVisible);
    const dataBD = this.datesRealsLaravel[indexDia];

    if (!nouEstat) return;

    // Preparem les dades per a l'api de Laravel
    const dades = {
      id_inscripcio: alumne.id_inscripcio_db,
      data: dataBD,
      estat: this.mapejarSimbolAEstat(nouEstat),
      id_profe: JSON.parse(localStorage.getItem('usuari') || '{}').id
    };

    const llistaAssistencies = this.assistenciesManager.assistencies();
    let existent = null;

    // Bucle per trobar si l'assistència d'aquest dia ja es va crear abans
    for (let i = 0; i < llistaAssistencies.length; i++) {
      const a = llistaAssistencies[i];
      if (a.id_inscripcio === alumne.id_inscripcio_db && a.data && a.data.substring(0, 10) === dataBD) {
        existent = a;
        break;
      }
    }

    // Si ja existia, la modifiquem. Si no, en creem una de nova.
    if (existent) {
      await this.assistenciesManager.actualitzarAssistencia(existent.id, dades as any);
    } else {
      await this.assistenciesManager.afegirAssistencia(dades as any);
    }
  }

  moureFocus(filaIndex: number, colIndex: number) {
    if (colIndex === this.datesSetmana.length - 1) {
      const seguentFilaCol0 = document.getElementById(`input-${filaIndex + 1}-0`);
      if (seguentFilaCol0) seguentFilaCol0.focus();
    } else {
      const seguentCol = document.getElementById(`input-${filaIndex}-${colIndex + 1}`);
      if (seguentCol) seguentCol.focus();
    }
  }

  private mapejarSimbolAEstat(simbol: string): string {
    switch (simbol.toUpperCase()) {
      case '.': return 'Assistit';
      case 'F': return 'Falta';
      case 'R': return 'Retard';
      default: return 'Assistit';
    }
  }
}
