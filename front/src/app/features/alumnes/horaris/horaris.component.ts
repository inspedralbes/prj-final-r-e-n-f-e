import { Component, inject, OnInit, computed } from '@angular/core';
import { HorarisManagerService } from '../../../shared/services/horaris/horaris-manager.service';
import { SidebarAlumneComponent } from '../../../shared/components/sidebar/alumnes/sidebarAlumne.component';

@Component({
  selector: 'horaris-alumne',
  imports: [SidebarAlumneComponent],
  templateUrl: './horaris.component.html',
  styleUrl: './horaris.component.css',
})
export class Horaris implements OnInit {
  horarisManager = inject(HorarisManagerService);
  calendari = this.horarisManager.horarisAssignaturaNet;

  ngOnInit() {
    this.horarisManager.getHorari();
  }

  // Construïm la graella sempre amb 5 dies × 7 franges (incl. esbarjo),
  // col·locant cada assignatura al seu slot correcte.
  calendariGraella = computed(() => {
    const diasCalendari = this.calendari();

    // Mapa per accés ràpid: "dilluns" → [null, "Prog", null, null, null, null]
    const mapa: { [dia: string]: (string | null)[] } = {};
    for (const diaCalendari of diasCalendari) {
      mapa[diaCalendari.dia.toLowerCase()] = diaCalendari.assignatures;
    }

    const diesSetmana = ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres'];
    const assignatura = (dia: string, idx: number): string | null =>
      mapa[dia] ? (mapa[dia][idx] ?? null) : null;

    return [
      {
        hora: '08:00',
        esEsbarjo: false,
        assignatures: diesSetmana.map((dia) => assignatura(dia, 0)),
      },
      {
        hora: '09:00',
        esEsbarjo: false,
        assignatures: diesSetmana.map((dia) => assignatura(dia, 1)),
      },
      {
        hora: '10:00',
        esEsbarjo: false,
        assignatures: diesSetmana.map((dia) => assignatura(dia, 2)),
      },
      { hora: '11:00', esEsbarjo: true, assignatures: [] },
      {
        hora: '11:30',
        esEsbarjo: false,
        assignatures: diesSetmana.map((dia) => assignatura(dia, 3)),
      },
      {
        hora: '12:30',
        esEsbarjo: false,
        assignatures: diesSetmana.map((dia) => assignatura(dia, 4)),
      },
      {
        hora: '13:30',
        esEsbarjo: false,
        assignatures: diesSetmana.map((dia) => assignatura(dia, 5)),
      },
    ];
  });
}
