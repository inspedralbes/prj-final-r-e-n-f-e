import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { ClassesManagerService } from '../../../shared/services/classes/classes-manager.service';
import { HorarisManagerService } from '../../../shared/services/horaris/horaris-manager.service';
import { AssignaturesManagerService } from '../../../shared/services/assignatures/assignatures-manager.service';
import { AulesManagerService } from '../../../shared/services/aules/aules-manager.service';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Classe } from '../../../shared/models/classe.model';
import { UsuarisManagerService } from '../../../shared/services/usuaris/usuaris-manager.service';
import { Usuari } from '../../../shared/models/usuaris.model';
import { Horari } from '../../../shared/models/horaris.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlus, heroUser, heroXMark } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-horari-alumnes',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroPlus, heroUser, heroXMark })],
  templateUrl: './horari-alumnes.component.html',
  styleUrl: './horari-alumnes.component.css',
})
export class HorariAlumnesComponent implements OnInit {
  // Injecció de serveis en mode privat per a ús intern
  serveiClasses = inject(ClassesManagerService);
  serveiHoraris = inject(HorarisManagerService);
  serveiAssignatures = inject(AssignaturesManagerService);
  serveiAules = inject(AulesManagerService);
  serveiAuth = inject(AuthService);
  serveiUsuaris = inject(UsuarisManagerService);

  // Nou estat segur (Fase 2) carregat exclusivament del backend
  laMevaClasse = signal<Classe | null>(null);
  alumnesDelaClasseSegur = signal<Usuari[]>([]);
  professorsDisponiblesSegur = signal<Usuari[]>([]);
  horarisDelaClasseSegur = signal<Horari[]>([]);

  isLoading = computed(() => 
    this.serveiHoraris.isLoading() || 
    this.serveiClasses.isLoading() || 
    this.serveiUsuaris.isLoading()
  );

  async ngOnInit() {
    // 1. Obtenim la classe on és tutor
    const usuariLoguejat = this.serveiAuth.usuarioInfo;
    if (usuariLoguejat && usuariLoguejat.id) {
        const classe = await this.serveiClasses.obtenirClasseTutor(usuariLoguejat.id);
        this.laMevaClasse.set(classe);

        if (classe) {
            // 2. Carreguem nomes els alumnes de la classe, els horaris d'aquesta classe
            // i tots els usuaris que són profes directament filtrats al Laravel.
            const [alumnes, horaris, profes] = await Promise.all([
                this.serveiClasses.getAlumnesClasse(classe.id),
                this.serveiHoraris.getHorarisClasse(classe.id),
                this.serveiUsuaris.getUsuarisPerRol('Profe')
            ]);
            
            this.alumnesDelaClasseSegur.set(alumnes);
            this.horarisDelaClasseSegur.set(horaris);
            this.professorsDisponiblesSegur.set(profes);
        }
    }
    
    // Carreguem llistats per als modals d'assignatures o aules
    // d'Assignatures i Aules disponibles al centre per posar-les al <select> del HTML
    this.serveiAssignatures.carregarAssignatures();
    this.serveiAules.carregarAules();
  }

  // Compatibilitat amb l'HTML actual
  alumnesDelaClasse = computed(() => this.alumnesDelaClasseSegur());
  professorsDisponibles = computed(() => this.professorsDisponiblesSegur());
  horariDelaClasse = computed(() => this.horarisDelaClasseSegur());

  // Graella visual (Estructura de dades per al Grid)
  quadreHorari = computed(() => {
    const elsMeusHoraris = this.horariDelaClasse();

    // Cada fila normal té sempre exactament 5 sessions (una per dia).
    // La fila d'esbarjo té esEsbarjo=true i sessions buides (no s'itera).
    const graella: any[] = [
      { hora: '08:00', esEsbarjo: false, sessions: [null, null, null, null, null] },
      { hora: '09:00', esEsbarjo: false, sessions: [null, null, null, null, null] },
      { hora: '10:00', esEsbarjo: false, sessions: [null, null, null, null, null] },
      { hora: '11:00', esEsbarjo: true, sessions: [] },
      { hora: '11:30', esEsbarjo: false, sessions: [null, null, null, null, null] },
      { hora: '12:30', esEsbarjo: false, sessions: [null, null, null, null, null] },
      { hora: '13:30', esEsbarjo: false, sessions: [null, null, null, null, null] },
    ];

    if (elsMeusHoraris && Array.isArray(elsMeusHoraris)) {
      for (let i = 0; i < elsMeusHoraris.length; i++) {
        const horari = elsMeusHoraris[i];
        if (!horari || !horari.codi_hora) continue;

        const lletraDia = horari.codi_hora.charAt(0).toUpperCase();
        const numeroHora = parseInt(horari.codi_hora.substring(1), 10);

        const dies: { [key: string]: number } = { L: 0, M: 1, X: 2, J: 3, V: 4 };
        const indexColumna = dies[lletraDia] ?? -1;

        if (indexColumna === -1 || isNaN(numeroHora)) continue;

        // H1–H3 → files 0,1,2 | H4–H6 → files 4,5,6 (la 3 és l'esbarjo)
        let indexFila = -1;
        if (numeroHora >= 1 && numeroHora <= 3) indexFila = numeroHora - 1;
        else if (numeroHora >= 4 && numeroHora <= 6) indexFila = numeroHora;

        if (indexFila !== -1 && graella[indexFila] && !graella[indexFila].esEsbarjo) {
          graella[indexFila].sessions[indexColumna] = horari;
        }
      }
    }

    return graella;
  });

  trackByHora(_index: number, fila: any): string {
    return fila.hora;
  }

  trackByDiaIndex(index: number): number {
    return index;
  }

  // Mètodes auxiliars per a l'HTML
  obtenirNomAssig(cell: any): string {
    if (!cell || cell === 'ESBARJO') return '';
    return cell.assignatura?.nom || 'Matèria';
  }

  obtenirNomAula(cell: any): string {
    if (!cell || cell === 'ESBARJO') return '';
    return cell.aula?.nom || 'Sense Aula';
  }

  obtenirNomProfe(cell: any): string {
    if (!cell || cell === 'ESBARJO') return '';
    if (cell.professor) return `${cell.professor.nom ?? ''} ${cell.professor.cognom ?? ''}`.trim();
    return 'Professor';
  }

  obtenirInicialsProfe(cell: any): string {
    if (!cell || cell === 'ESBARJO' || !cell.professor) return '??';
    const nom = cell.professor.nom?.charAt(0) || '';
    const cognom = cell.professor.cognom?.charAt(0) || '';
    return (nom + cognom).toUpperCase();
  }

  obtenirInicialsAlumne(alumne: Usuari): string {
    const nom = alumne.nom?.charAt(0) || '';
    const cognom = alumne.cognom?.charAt(0) || '';
    return (nom + cognom).toUpperCase();
  }

  totsSeleccionats(): boolean {
    const total = this.alumnesDelaClasse().length;
    const seleccionats = this.alumnesSeleccionatsIds().length;
    return total > 0 && total === seleccionats;
  }

  toggleTotsAlumnes() {
    if (this.totsSeleccionats()) {
      this.alumnesSeleccionatsIds.set([]);
    } else {
      const alumnes = this.alumnesDelaClasse();
      const totsIds: number[] = [];
      if (alumnes && Array.isArray(alumnes)) {
        for (let i = 0; i < alumnes.length; i++) {
          totsIds.push(alumnes[i].id);
        }
      }
      this.alumnesSeleccionatsIds.set(totsIds);
    }
  }

  // Estats per al modal
  mostrarModal = signal(false);
  codiHoraSeleccionada = signal('');
  idAssignaturaSeleccionada = signal<number | null>(null);
  idAulaSeleccionada = signal<number | null>(null);
  idProfeSeleccionat = signal<number | null>(null);
  alumnesSeleccionatsIds = signal<number[]>([]);
  isSaving = signal<boolean>(false);

  // Obre el modal de configuració al clicar una cel·la
  obrirModalEdicio(diaIndex: number, horaLlegible: string) {
    const lletres = ['L', 'M', 'X', 'J', 'V'];
    const lletra = lletres[diaIndex];

    // Calculem l'hora segons la fila
    let numHora = 1;
    if (horaLlegible === '09:00') numHora = 2;
    if (horaLlegible === '10:00') numHora = 3;
    if (horaLlegible === '11:30') numHora = 4;
    if (horaLlegible === '12:30') numHora = 5;
    if (horaLlegible === '13:30') numHora = 6;

    const codiActual = lletra + numHora;
    this.codiHoraSeleccionada.set(codiActual);

    const horaris = this.horariDelaClasse();
    let existent: Horari | null = null;
    if (horaris && Array.isArray(horaris)) {
      for (let i = 0; i < horaris.length; i++) {
        if (horaris[i].codi_hora === codiActual) {
          existent = horaris[i];
          break;
        }
      }
    }

    if (existent) {
      this.idAssignaturaSeleccionada.set(existent.id_assig);
      this.idAulaSeleccionada.set(existent.id_aula);
      this.idProfeSeleccionat.set(existent.id_professor || null);

      const idsJaInscrits: number[] = [];
      const inscritsRelacio = existent.inscrits;
      if (inscritsRelacio && Array.isArray(inscritsRelacio)) {
        for (let j = 0; j < inscritsRelacio.length; j++) {
          idsJaInscrits.push(inscritsRelacio[j].id_alumne);
        }
      }
      this.alumnesSeleccionatsIds.set(idsJaInscrits);
    } else {
      this.idAssignaturaSeleccionada.set(null);
      this.idAulaSeleccionada.set(null);
      this.idProfeSeleccionat.set(this.serveiAuth.usuarioInfo?.id || null);

      const alumnes = this.alumnesDelaClasse();
      const totsIds: number[] = [];
      if (alumnes && Array.isArray(alumnes)) {
        for (let k = 0; k < alumnes.length; k++) {
          totsIds.push(alumnes[k].id);
        }
      }
      this.alumnesSeleccionatsIds.set(totsIds);
    }

    this.mostrarModal.set(true);
  }

  // Selecciona o deselecciona un alumne de la llista
  toggleAlumne(id: number) {
    const llista = this.alumnesSeleccionatsIds();
    let trobat = false;
    for (let i = 0; i < llista.length; i++) {
      if (llista[i] === id) {
        trobat = true;
        break;
      }
    }

    const novaLlista: number[] = [];
    if (trobat) {
      // Si ja hi era, el llevem de la llista
      for (let i = 0; i < llista.length; i++) {
        if (llista[i] !== id) {
          novaLlista.push(llista[i]);
        }
      }
    } else {
      // Si no hi era, l'afegim
      for (let j = 0; j < llista.length; j++) {
        novaLlista.push(llista[j]);
      }
      novaLlista.push(id);
    }
    this.alumnesSeleccionatsIds.set(novaLlista);
  }

  // Mira si un alumne concret està seleccionat
  estaSeleccionat(id: number): boolean {
    const llista = this.alumnesSeleccionatsIds();
    for (let i = 0; i < llista.length; i++) {
      if (llista[i] === id) return true;
    }
    return false;
  }

  async desarCanvis() {
    console.log('[desarCanvis] inici');
    const classe = this.laMevaClasse();
    console.log('[desarCanvis] classe:', classe);
    console.log('[desarCanvis] usuariLoguejat:', this.serveiAuth.usuarioInfo);
    if (!classe) {
      alert(
        "No s'ha trobat cap classe assignada al teu usuari. Comprova que ets tutor d'una classe.",
      );
      return;
    }

    const asigId = this.idAssignaturaSeleccionada();
    const aulaId = this.idAulaSeleccionada();
    const profeId = this.idProfeSeleccionat();
    console.log('[desarCanvis] asigId:', asigId, '| aulaId:', aulaId, '| profeId:', profeId);

    if (asigId == null || aulaId == null || profeId == null) {
      alert('Si us plau, selecciona Assignatura, Aula i Professor.');
      return;
    }

    const dadesGranulars = {
      codi_hora: this.codiHoraSeleccionada(),
      id_classe: classe.id,
      id_assig: asigId,
      id_aula: aulaId,
      id_profe: profeId,
      alumnes_ids: this.alumnesSeleccionatsIds(),
    };

    try {
      this.isSaving.set(true);
      console.log('comienzo');
      await this.serveiHoraris.actualitzarHorariGranular(dadesGranulars);
      console.log('enviao');
      this.mostrarModal.set(false);
      alert('Horari i alumnes actualitzats correctament.');
    } catch (error) {
      console.error("Error desar l'horari granular", error);
      alert("S'ha produït un error al desar la configuració.");
    } finally {
      this.isSaving.set(false);
    }
  }
}
