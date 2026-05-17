import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { InscritsManagerService } from '../../../shared/services/inscrits/inscrits-manager.service';
import { AssistenciesManagerService } from '../../../shared/services/assistencies/assistencies-manager.service';
import { HorarisManagerService } from '../../../shared/services/horaris/horaris-manager.service';
import { SocketService } from '../../../services/socket.service';
import { getSimbolAssistencia } from '../../../shared/utils/assistencia-utils';
import { Horari } from '../../../shared/models/horaris.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUser } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-llista-classe',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroUser })],
  templateUrl: './llista-classe.component.html',
  styleUrl: './llista-classe.component.css',
})
export class LlistaClasseComponent implements OnInit {
  private inscritsManager = inject(InscritsManagerService);
  private assistenciesManager = inject(AssistenciesManagerService);
  private horarisManager = inject(HorarisManagerService);
  private socketService = inject(SocketService);
  private route = inject(ActivatedRoute);

  diesSetmana = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'];
  datesSetmana: string[] = []; // Formatat per mostrar (DD/MM)
  datesRealsLaravel: string[] = []; // Formatat per a la BD (YYYY-MM-DD)

  // Noves variables per a la Fase 2 descarregades només sota demanda
  sessionsProfessorData = signal<Horari[]>([]);
  alumnesAmbAssistencia = signal<any[]>([]);
  sessioSeleccionadaId = signal<number | null>(null);
  isSaving = signal(false);

  carregantDades = computed(() => this.assistenciesManager.isLoading() || this.horarisManager.isLoading());

  // Ordenem el llistat per a l'HTML
  sessionsProfessor = computed(() => {
    const llista = this.sessionsProfessorData();
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
    const index = lletraMap[sessio.codi_hora.charAt(0).toUpperCase()] ?? -1;
    console.log(`[DIA_ACTIU] Sessió seleccionada id=${idSessio}, codi_hora="${sessio.codi_hora}", índex dia=${index}`);
    return index;
  });

  ngOnInit() {
    this.calcularDatesSetmana();
    console.log('[INIT] Dates de la setmana (UI):', this.datesSetmana);
    console.log('[INIT] Dates per a la BD (Laravel):', this.datesRealsLaravel);

    const usuariLoguejat = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('[INIT] Usuari del localStorage (clau "user"):', usuariLoguejat);

    // Escoltador del Socket
    this.socketService.listenToEvent('assistencia_updated').subscribe((data: any) => {
      console.log('[SOCKET] assistencia_updated rebut!', data);
      const idSessioActual = this.sessioSeleccionadaId();
      if (idSessioActual) {
        console.log('[SOCKET] Recarregant graella per a sessio:', idSessioActual);
        this.carregarGraellaPerALaSessio(idSessioActual);
      }
    });

    if (usuariLoguejat && usuariLoguejat.id) {
      console.log(`[INIT] Carregant context per al professor id=${usuariLoguejat.id}...`);

      this.horarisManager.getContextAssistencia(usuariLoguejat.id).then(context => {
        console.log('[INIT] Context rebut del servidor:', context);

        if (!context) {
          console.warn('[INIT] ⚠️ El context és null. Comprova que /horaris/professor/:id/context retorna dades.');
          return;
        }

        console.log('[INIT] Sessions del professor:', context.sessions);
        console.log('[INIT] Sessió per defecte (default_id):', context.default_id);

        this.sessionsProfessorData.set(context.sessions);

        this.route.queryParams.subscribe(async (params) => {
          const sessioIdParam = params['sessioId'];
          console.log('[INIT] Paràmetre URL (sessioId):', sessioIdParam);

          const idASeleccionar = sessioIdParam ? Number(sessioIdParam) : context.default_id;
          console.log('[INIT] ID de sessió a carregar:', idASeleccionar);

          if (idASeleccionar) {
            this.sessioSeleccionadaId.set(idASeleccionar);
            await this.carregarGraellaPerALaSessio(idASeleccionar);
          } else {
            console.warn('[INIT] ⚠️ No hi ha sessió per seleccionar (ni URL ni default_id). El professor pot no tenir sessió activa ara.');
          }
        });
      });
    } else {
      console.error('[INIT] ❌ No hi ha usuari autenticat al localStorage (clau "usuari").');
    }
  }

  async carregarGraellaPerALaSessio(idSessio: number) {
    console.log(`[GRAELLA] ── Carregant graella per a la sessió id=${idSessio} ──`);
    this.alumnesAmbAssistencia.set([]);

    const dataIniciBD = this.datesRealsLaravel[0];
    const dataFiBD = this.datesRealsLaravel[4];
    console.log(`[GRAELLA] Rang de dates: ${dataIniciBD} → ${dataFiBD}`);

    const llistaDinsBack = await this.assistenciesManager.getAssistenciaSetmanal(
      idSessio,
      dataIniciBD,
      dataFiBD,
    );

    console.log('[GRAELLA] Resposta crua del servidor:', llistaDinsBack);

    const resultatFinal: any[] = [];
    const totesLesAssistenciesDelGrup: any[] = [];

    if (llistaDinsBack && Array.isArray(llistaDinsBack)) {
      console.log(`[GRAELLA] Total inscrits rebuts: ${llistaDinsBack.length}`);

      for (let i = 0; i < llistaDinsBack.length; i++) {
        const inscrit = llistaDinsBack[i];
        const alumne = inscrit.alumne;

        if (!alumne) {
          console.warn(`[GRAELLA] ⚠️ Inscrit id=${inscrit.id} no té dades d'alumne!`, inscrit);
          continue;
        }

        // Inicialitzem totes les cel·les en blanc
        const assistenciaNativa: any = {};
        for (let j = 0; j < this.datesSetmana.length; j++) {
          assistenciaNativa[this.datesSetmana[j]] = '';
        }

        const assistenciesDades = inscrit.assistencies;
        console.log(`[GRAELLA] Alumne "${alumne.nom} ${alumne.cognom}" (inscrit_id=${inscrit.id}) té ${assistenciesDades?.length ?? 0} assistències:`, assistenciesDades);

        if (assistenciesDades && Array.isArray(assistenciesDades)) {
          for (let a = 0; a < assistenciesDades.length; a++) {
            const assisInfo = assistenciesDades[a];
            totesLesAssistenciesDelGrup.push(assisInfo);
            const dataFormatCurta = assisInfo.data.substring(0, 10);

            let indexDia = -1;
            for (let k = 0; k < this.datesRealsLaravel.length; k++) {
              if (this.datesRealsLaravel[k] === dataFormatCurta) {
                indexDia = k;
                break;
              }
            }

            if (indexDia >= 0) {
              const diaVisible = this.datesSetmana[indexDia];
              const simbol = getSimbolAssistencia(assisInfo.estat, !!assisInfo.justificat);
              assistenciaNativa[diaVisible] = simbol;
              console.log(`[GRAELLA]   ✔ data="${dataFormatCurta}" → dia="${diaVisible}", estat="${assisInfo.estat}", símbol="${simbol}"`);
            } else {
              console.warn(`[GRAELLA]   ⚠️ data="${dataFormatCurta}" no coincideix amb cap dia de la setmana actual (${this.datesRealsLaravel.join(', ')})`);
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
    } else {
      console.warn('[GRAELLA] ⚠️ La resposta del servidor no és un array:', llistaDinsBack);
    }

    console.log('[GRAELLA] Resultat final per a la UI:', resultatFinal);
    console.log(`[GRAELLA] Store d'assistències actualitzat amb ${totesLesAssistenciesDelGrup.length} registres.`);

    this.alumnesAmbAssistencia.set(resultatFinal);
    this.assistenciesManager.assistencies.set(totesLesAssistenciesDelGrup);
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

      const diaFormatat =
        dia.getDate().toString().padStart(2, '0') +
        '/' +
        (dia.getMonth() + 1).toString().padStart(2, '0');
      this.datesSetmana.push(diaFormatat);

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

  canviarSessioManualDirecte(nouIdRaw: any) {
    const nouId = Number(nouIdRaw);
    console.log(`[SESSIO] Professor canvia manualment a sessió id=${nouId}`);
    if (nouId) {
      this.sessioSeleccionadaId.set(nouId);
      this.carregarGraellaPerALaSessio(nouId);
    }
  }

  // Guarda o actualitza l'estat d'assistència a la Base de Dades
  async guardarAssistencia(alumne: any, dataVisible: string, nouEstat: string) {
    const indexDia = this.datesSetmana.indexOf(dataVisible);
    const dataBD = this.datesRealsLaravel[indexDia];

    console.log(`[GUARDAR] Alumne="${alumne.nom}" (inscripcio_id=${alumne.id_inscripcio_db}), dia="${dataVisible}"→"${dataBD}", estat="${nouEstat}"`);

    const llistaAssistencies = this.assistenciesManager.assistencies();
    let existent = null;

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

    console.log(`[GUARDAR] Registre existent a la BD:`, existent ? `id=${existent.id}, estat="${existent.estat}"` : 'cap (nou registre)');

    if (!nouEstat || nouEstat.trim() === '') {
      if (existent) {
        console.log(`[GUARDAR] 🗑 Esborrant assistència id=${existent.id}...`);
        await this.assistenciesManager.esborrarAssistencia(existent.id);
      }
      return;
    }

    const estatBD = this.mapejarSimbolAEstat(nouEstat);
    const dades = {
      id_inscripcio: alumne.id_inscripcio_db,
      data: dataBD,
      estat: estatBD,
      id_profe: JSON.parse(localStorage.getItem('user') || '{}').id,
    };

    console.log(`[GUARDAR] Dades a enviar:`, dades);

    if (existent) {
      console.log(`[GUARDAR] 🔄 PUT → Actualitzant assistència id=${existent.id}...`);
      await this.assistenciesManager.actualitzarAssistencia(existent.id, dades as any);
    } else {
      console.log(`[GUARDAR] ➕ POST → Creant nova assistència...`);
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

  async guardarTotaAssistencia() {
    const diaIndex = this.diaActivIndex();
    console.log(`[GUARDAR_TOT] ── Iniciant guardada massiva ──`);
    console.log(`[GUARDAR_TOT] Índex del dia actiu: ${diaIndex}`);

    if (diaIndex === -1) {
      console.warn('[GUARDAR_TOT] ⚠️ diaActivIndex = -1. Pot ser que la sessió seleccionada no tingui codi_hora vàlid (L/M/X/J/V).');
      alert("No hi ha cap sessió activa per avaluar.");
      return;
    }

    const diaVisible = this.datesSetmana[diaIndex];
    const dataBD = this.datesRealsLaravel[diaIndex];
    const alumnes = this.alumnesFiltrats();
    console.log(`[GUARDAR_TOT] Dia visible="${diaVisible}", data BD="${dataBD}", total alumnes=${alumnes.length}`);

    if (alumnes.length === 0) {
      alert("No hi ha alumnes per a aquesta sessió.");
      return;
    }

    const alumnesAmbValor = [];
    const alumnesSenseValor = [];
    for (let i = 0; i < alumnes.length; i++) {
      const a = alumnes[i];
      if (a.assistencia[diaVisible] && a.assistencia[diaVisible].trim() !== '') {
        alumnesAmbValor.push(a);
      } else {
        alumnesSenseValor.push(a);
      }
    }

    if (alumnesSenseValor.length > 0) {
      const nomsSenseValor = [];
      for (let j = 0; j < alumnesSenseValor.length; j++) {
        nomsSenseValor.push(alumnesSenseValor[j].nom);
      }
      console.warn(`[GUARDAR_TOT] ⚠️ Alumnes sense assistència marcada (${alumnesSenseValor.length}):`, nomsSenseValor);
    }

    this.isSaving.set(true);
    try {
      let guardats = 0;
      console.log(`[GUARDAR_TOT] Enviant dades per a ${alumnesAmbValor.length} alumnes amb assistència marcada...`);
      for (const alumne of alumnesAmbValor) {
        await this.guardarAssistencia(alumne, diaVisible, alumne.assistencia[diaVisible]);
        guardats++;
      }
      console.log(`[GUARDAR_TOT] Guardats ${guardats} registres correctament!`);
      alert(`Assistència desada! (${guardats} de ${alumnes.length} alumnes marcats)`);
    } catch (e) {
      console.error('[GUARDAR_TOT] ERROR en guardar:', e);
      alert("Hi ha hagut un error en guardar l'assistència.");
    } finally {
      this.isSaving.set(false);
    }
  }

  private mapejarSimbolAEstat(simbol: string): string {
    switch (simbol.toUpperCase()) {
      case '.': return 'Assistit';
      case 'F': return 'Falta';
      case 'R': return 'Retard';
      case 'FJ': return 'Justificada';
      default: return 'Assistit';
    }
  }
}
