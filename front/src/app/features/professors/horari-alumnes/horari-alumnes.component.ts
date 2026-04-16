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

@Component({
  selector: 'app-horari-alumnes',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule],
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

  ngOnInit() {
    // Carreguem totes les dades necessàries quan entrem a la pantalla
    this.serveiClasses.carregarClasses();
    this.serveiHoraris.carregarHoraris();
    this.serveiAssignatures.carregarAssignatures();
    this.serveiAules.carregarAules();
    this.serveiUsuaris.carregarUsuaris();
  }

  // Obtenim la classe on el professor loguejat és tutor
  laMevaClasse = computed(() => {
    const usuariLoguejat = this.serveiAuth.usuarioInfo;
    if (!usuariLoguejat || !usuariLoguejat.id) return null;

    const llistaClasses = this.serveiClasses.classes();
    if (llistaClasses && Array.isArray(llistaClasses)) {
      for (let i = 0; i < llistaClasses.length; i++) {
        if (Number(llistaClasses[i].id_tutor) === Number(usuariLoguejat.id)) {
          return llistaClasses[i];
        }
      }
    }
    return null;
  });

  // Alumnes que pertanyen a aquesta classe (Llista Maestra)
  alumnesDelaClasse = computed(() => {
    const classe = this.laMevaClasse();
    if (!classe) return [];

    const usuaris = this.serveiUsuaris.usuaris() as Usuari[];
    const result: Usuari[] = [];
    if (usuaris && Array.isArray(usuaris)) {
      for (let i = 0; i < usuaris.length; i++) {
        const u = usuaris[i];
        const rol = u.rol?.toLowerCase() || '';
        if (rol.includes('alumne') && u.id_classe === classe.id) {
          result.push(u);
        }
      }
    }
    return result;
  });

  // Tots els professors disponibles
  professorsDisponibles = computed(() => {
    const usuaris = this.serveiUsuaris.usuaris() as Usuari[];
    const result: Usuari[] = [];
    if (usuaris && Array.isArray(usuaris)) {
      for (let i = 0; i < usuaris.length; i++) {
        const u = usuaris[i];
        const rol = u.rol?.toLowerCase() || '';
        if (rol.includes('profe') || rol.includes('instr')) {
          result.push(u);
        }
      }
    }
    return result;
  });

  // Filtrem els horaris que pertanyen a aquesta classe
  horariDelaClasse = computed(() => {
    const classe = this.laMevaClasse();
    if (!classe) return [];

    const totsHoraris = this.serveiHoraris.horaris() as Horari[];
    const result: Horari[] = [];
    if (totsHoraris && Array.isArray(totsHoraris)) {
      for (let i = 0; i < totsHoraris.length; i++) {
        if (totsHoraris[i].id_classe === classe.id) {
          result.push(totsHoraris[i]);
        }
      }
    }
    return result;
  });

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

  // Funció per obrir el modal de configuració en clicar una cel·la buida o existent
  obrirModalEdicio(diaIndex: number, horaLlegible: string) {
    const lletres = ['L', 'M', 'X', 'J', 'V'];
    const lletra = lletres[diaIndex];

    // Calculem el número d'hora segons el text de la fila
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
      // Si ja hi era, el treiem (copiant tots menys ell)
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
      console.log('comienzo');
      await this.serveiHoraris.actualitzarHorariGranular(dadesGranulars);
      console.log('enviao');
      this.mostrarModal.set(false);
      alert('Horari i alumnes actualitzats correctament.');
    } catch (error) {
      console.error("Error desar l'horari granular", error);
      alert("S'ha produït un error al desar la configuració.");
    }
  }
}
