import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AssignaturesManagerService } from '../../shared/services/assignatures/assignatures-manager.service';
import { HorarisManagerService } from '../../shared/services/horaris/horaris-manager.service';
import { ImparteixManagerService } from '../../shared/services/imparteix/imparteix-manager.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-professors',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './professors.component.html',
  styleUrl: './professors.component.css',
})
export class ProfessorsComponent implements OnInit {
  private assignaturesManager = inject(AssignaturesManagerService);
  private horarisManager = inject(HorarisManagerService);
  private imparteixManager = inject(ImparteixManagerService);
  private authService = inject(AuthService);

  carregantDades = computed(() => this.horarisManager.isLoading());

  // Dades de la classe actual connectada a la Base de Dades
  classeActual = computed(() => {
    // Escoltem la resposta que ens ha deixat el Backend a classeActualApi
    // (Aquesta resposta s'aconsegueix quan cridem a getClasseActual() a l'ngOnInit)
    const classeApi = this.horarisManager.classeActualApi();

    // Si la resposta és null (perquè estàs de pati, o ja has plegat, o és cap de setmana)
    // posem un text genèric dient que no hi ha classe ara mateix.
    if (!classeApi) {
      return {
        nom: 'Cap assignatura assignada ara mateix',
        estat: "A L'ESPERA",
        horaInici: '--:--',
        horaFi: '--:--',
        aula: '-',
      };
    }

    // Si el Laravel HA TROBAT classe a l'hora actual, l'ensenyem tal qual
    // (el Laravel ens envia l'objecte amb nom, estat, horaInici, horaFi i aula)
    return classeApi;
  });

  franjaHoraria = signal<'AM' | 'PM'>('AM');

  diesSetmana = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'];

  // Retorna l'horari segons la franja seleccionada
  horariActual = computed(() => {
    // 1. Agafem l'horari
    const diesCalendari = this.horarisManager.horarisAssignaturaNet();
    // 2. Mapegem cada dia usant un for clàssic
    const mapa: { [dia: string]: (string | null)[] } = {};
    for (let i = 0; i < diesCalendari.length; i++) {
      const diaCalendari = diesCalendari[i];
      mapa[diaCalendari.dia.toLowerCase()] = diaCalendari.assignatures;
    }
    const unDia = ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres'];
    const esMati = this.franjaHoraria() === 'AM';
    // 3. Construïm la graella de presentació
    let graella: any[] = [];

    if (esMati) {
      // Preparem les files del matí
      const horesMati = ['08:00', '09:00', '10:00', '11:00', '11:30', '12:30', '13:30'];
      for (let fila = 0; fila < horesMati.length; fila++) {
        const h = horesMati[fila];
        if (h === '11:00') {
          graella.push({
            hora: h,
            assignatures: ['ESBARJO', 'ESBARJO', 'ESBARJO', 'ESBARJO', 'ESBARJO'],
          });
        } else {
          graella.push({ hora: h, assignatures: ['', '', '', '', ''] });
        }
      }
      // Omplim les assignatures a cada columna comprovant-ho una a una
      for (let col = 0; col < unDia.length; col++) {
        const diaString = unDia[col];
        const llistaAssignaturesDia = mapa[diaString];

        if (llistaAssignaturesDia) {
          // Índex 0 del Laravel -> 08:00 (fila 0)
          if (llistaAssignaturesDia[0]) graella[0].assignatures[col] = llistaAssignaturesDia[0];
          // Índex 1 del Laravel -> 09:00 (fila 1)
          if (llistaAssignaturesDia[1]) graella[1].assignatures[col] = llistaAssignaturesDia[1];
          // Índex 2 del Laravel -> 10:00 (fila 2)
          if (llistaAssignaturesDia[2]) graella[2].assignatures[col] = llistaAssignaturesDia[2];
          // La fila 3 és l'esbarjo, ens la saltem
          // Índex 3 del Laravel -> 11:30 (fila 4)
          if (llistaAssignaturesDia[3]) graella[4].assignatures[col] = llistaAssignaturesDia[3];
          // Índex 4 del Laravel -> 12:30 (fila 5)
          if (llistaAssignaturesDia[4]) graella[5].assignatures[col] = llistaAssignaturesDia[4];
          // Índex 5 del Laravel -> 13:30 (fila 6)
          if (llistaAssignaturesDia[5]) graella[6].assignatures[col] = llistaAssignaturesDia[5];
        }
      }
    } else {
      // Tardes
      const horesTarda = ['15:00', '16:00', '17:00', '18:00', '18:30', '19:30'];
      for (let fila = 0; fila < horesTarda.length; fila++) {
        const h = horesTarda[fila];
        if (h === '18:00') {
          graella.push({
            hora: h,
            assignatures: ['ESBARJO', 'ESBARJO', 'ESBARJO', 'ESBARJO', 'ESBARJO'],
          });
        } else {
          graella.push({ hora: h, assignatures: ['', '', '', '', ''] });
        }
      }
      for (let col = 0; col < unDia.length; col++) {
        const diaString = unDia[col];
        const llistaAssignaturesDia = mapa[diaString];

        if (llistaAssignaturesDia) {
          // Índex 6 del Laravel -> 15:00 (fila 0)
          if (llistaAssignaturesDia[6]) graella[0].assignatures[col] = llistaAssignaturesDia[6];
          // Índex 7 del Laravel -> 16:00 (fila 1)
          if (llistaAssignaturesDia[7]) graella[1].assignatures[col] = llistaAssignaturesDia[7];
          // Índex 8 del Laravel -> 17:00 (fila 2)
          if (llistaAssignaturesDia[8]) graella[2].assignatures[col] = llistaAssignaturesDia[8];
          // La fila 3 és l'esbarjo
          // Índex 9 del Laravel -> 18:30 (fila 4)
          if (llistaAssignaturesDia[9]) graella[4].assignatures[col] = llistaAssignaturesDia[9];
          // Índex 10 del Laravel -> 19:30 (fila 5)
          if (llistaAssignaturesDia[10]) graella[5].assignatures[col] = llistaAssignaturesDia[10];
        }
      }
    }
    // 4. Esborrem files del final si estan totalment buides usant un bucle
    while (graella.length > 0) {
      const ultimaFila = graella[graella.length - 1];

      let teContingut = false;
      for (let i = 0; i < ultimaFila.assignatures.length; i++) {
        const assig = ultimaFila.assignatures[i];
        if (assig !== '' && assig !== 'ESBARJO') {
          teContingut = true;
          break; // Trenquem el bucle intern
        }
      }
      if (!teContingut) {
        graella.pop(); // Traiem la fila perquè està buida
      } else {
        break; // Trenquem el while perquè hi ha assignatures
      }
    }
    return graella;
  });

  commutarFranja() {
    this.franjaHoraria.update((valor) => (valor === 'AM' ? 'PM' : 'AM'));
  }

  // Implementación del método ngOnInit, esto pide a Laravel todas las asignaturas cuando el profe entra a su pantalla
  ngOnInit() {
    this.horarisManager.getHorari();
    this.horarisManager.getClasseActual();
  }
}
