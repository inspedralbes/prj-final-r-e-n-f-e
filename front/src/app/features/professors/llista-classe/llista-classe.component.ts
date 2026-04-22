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

  // Noves variables per a la Fase 2 descarregades només sota demanda
  sessionsProfessorData = signal<Horari[]>([]);
  alumnesAmbAssistencia = signal<any[]>([]);
  sessioSeleccionadaId = signal<number | null>(null);

  // Ordenem el llistat per pintar al HTML
  sessionsProfessor = computed(() => {
    const llista = this.sessionsProfessorData();
    // primitive sort loop? No, sort in string is better.
    // Lògica primitiva deia el client
    llista.sort((a: Horari, b: Horari) => a.codi_hora.localeCompare(b.codi_hora));
    return llista;
  });

  // Índex de la columna (0=Dilluns ... 4=Divendres) que correspon a la sessió activa
  diaActivIndex = computed(() => {
    const idSessio = this.sessioSeleccionadaId();
    if (!idSessio) return -1;
    const sessions = this.sessionsProfessor();
    let sessio = null;
    for (let i = 0; i < sessions.length; i++) {
      if (sessions[i].id === idSessio) {
        sessio = sessions[i];
        break;
      }
    }
    if (!sessio) return -1;

    const lletraMap: { [key: string]: number } = { L: 0, M: 1, X: 2, J: 3, V: 4 };
    return lletraMap[sessio.codi_hora.charAt(0).toUpperCase()] ?? -1;
  });

  async ngOnInit() {
    this.calcularDatesSetmana();

    // Fase 2: Obtenim l'usuari profe i descarreguem NOMÉS els seus horaris
    const usuariLoguejat = JSON.parse(localStorage.getItem('usuari') || '{}');
    if (usuariLoguejat && usuariLoguejat.id) {
      const sessionsDelBackend = await this.horarisManager.getSessionsProfessor(usuariLoguejat.id);
      this.sessionsProfessorData.set(sessionsDelBackend);

      if (sessionsDelBackend && sessionsDelBackend.length > 0) {
        const primeraSessioId = sessionsDelBackend[0].id ?? null;
        this.sessioSeleccionadaId.set(primeraSessioId);
        await this.carregarGraellaPerALaSessio(primeraSessioId);
      }
    }
  }

  async carregarGraellaPerALaSessio(idSessio: number | null) {
    if (!idSessio) {
      this.alumnesAmbAssistencia.set([]);
      return;
    }

    const dataIniciBD = this.datesRealsLaravel[0];
    const dataFiBD = this.datesRealsLaravel[4];

    // La nova màgia de Fase 2. Només ens arribaran en un array els inscrits amb l'assistència d'aquella setmana!
    const llistaDinsBack = await this.assistenciesManager.getAssistenciaSetmanal(
      idSessio,
      dataIniciBD,
      dataFiBD,
    );

    const resultatFinal = [];
    if (llistaDinsBack && Array.isArray(llistaDinsBack)) {
      for (let i = 0; i < llistaDinsBack.length; i++) {
        const inscrit = llistaDinsBack[i];
        const alumne = inscrit.alumne;

        // Ara organitzarem les assistències que ens arriben per dies
        const assistenciaNativa: any = {};
        // Posem tots els dies buits per defecte
        for (let j = 0; j < this.datesSetmana.length; j++) {
          assistenciaNativa[this.datesSetmana[j]] = '';
        }

        // Omplim si n'hi ha. Les assistencies ja venen filtrades de Backend!
        const assistenciesDades = inscrit.assistencies;
        if (assistenciesDades && Array.isArray(assistenciesDades)) {
          for (let a = 0; a < assistenciesDades.length; a++) {
            const assisInfo = assistenciesDades[a];
            const dataFormatCurta = assisInfo.data.substring(0, 10);

            // Quin dia setmana toca (0..4) ?
            let indexDia = -1;
            for (let k = 0; k < this.datesRealsLaravel.length; k++) {
              if (this.datesRealsLaravel[k] === dataFormatCurta) {
                indexDia = k;
                break;
              }
            }
            if (indexDia >= 0) {
              const diaVisible = this.datesSetmana[indexDia];
              assistenciaNativa[diaVisible] = getSimbolAssistencia(
                assisInfo.estat,
                !!assisInfo.justificat,
              );
            }
          }
        }

        resultatFinal.push({
          id: alumne.id,
          id_inscripcio_db: inscrit.id,
          nom: (alumne.nom || '') + ' ' + (alumne.cognom || ''),
          avatar: this.obtenirInicialsAlumne(alumne),
          assistencia: assistenciaNativa,
        });
      }
    }

    this.alumnesAmbAssistencia.set(resultatFinal);
  }

  // Compatibilitat Html actual
  alumnesFiltrats = computed(() => this.alumnesAmbAssistencia());

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
      const diaFormatat =
        dia.getDate().toString().padStart(2, '0') +
        '/' +
        (dia.getMonth() + 1).toString().padStart(2, '0');
      this.datesSetmana.push(diaFormatat);

      // Formatem per a la Base de Dades (Exemple: 2024-03-15)
      const anyBD = dia.getFullYear();
      const mesBD = (dia.getMonth() + 1).toString().padStart(2, '0');
      const diaBD = dia.getDate().toString().padStart(2, '0');
      this.datesRealsLaravel.push(`${anyBD}-${mesBD}-${diaBD}`);
    }
  }

  obtenirInicialsAlumne(alumne: any): string {
    if (!alumne) return '??';
    const nom = alumne.nom?.charAt(0) || '';
    const cognom = alumne.cognom?.charAt(0) || '';
    return (nom + cognom).toUpperCase();
  }

  canviarSessio(event: any) {
    const nouId = Number(event.target.value);
    this.sessioSeleccionadaId.set(nouId);
    this.carregarGraellaPerALaSessio(nouId);
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
      id_profe: JSON.parse(localStorage.getItem('usuari') || '{}').id,
    };

    const llistaAssistencies = this.assistenciesManager.assistencies();
    let existent = null;

    // Bucle per trobar si l'assistència d'aquest dia ja es va crear abans
    for (let i = 0; i < llistaAssistencies.length; i++) {
      const a = llistaAssistencies[i];
      if (
        a.id_inscripcio === alumne.id_inscripcio_db &&
        a.data &&
        a.data.substring(0, 10) === dataBD
      ) {
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
      case '.':
        return 'Assistit';
      case 'F':
        return 'Falta';
      case 'R':
        return 'Retard';
      default:
        return 'Assistit';
    }
  }
}
