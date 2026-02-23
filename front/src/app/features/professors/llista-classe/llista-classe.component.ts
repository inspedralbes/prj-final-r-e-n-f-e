import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { InscritsManagerService } from '../../../shared/services/inscrits/inscrits-manager.service';
import { AssistenciesManagerService } from '../../../shared/services/assistencies/assistencies-manager.service';

@Component({
  selector: 'app-llista-classe',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: './llista-classe.component.html',
  styleUrl: './llista-classe.component.css',
})
export class LlistaClasseComponent implements OnInit {
  inscritsManager = inject(InscritsManagerService);
  assistenciesManager = inject(AssistenciesManagerService);

  diesSetmana = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'];
  datesSetmana: string[] = [];
  datesRealsLaravel: string[] = []; 

  ngOnInit() {
    this.inscritsManager.carregarInscrits();
    this.assistenciesManager.carregarAssistencies();

    // Calcular els 5 dies de la setmana actual (de dilluns a divendres)
    const avui = new Date();
    const diaSetmana = avui.getDay() || 7; // Convertim Diumenge(0) a 7
    avui.setDate(avui.getDate() - diaSetmana + 1); // Ens posem a Dilluns

    for (let i = 0; i < 5; i++) {
      const diaMates = new Date(avui);
      diaMates.setDate(avui.getDate() + i);

      const diaFormatat = diaMates.getDate().toString().padStart(2, '0') + '/' +
        (diaMates.getMonth() + 1).toString().padStart(2, '0');

      this.datesSetmana.push(diaFormatat);

      const anyBD = diaMates.getFullYear();
      const mesBD = (diaMates.getMonth() + 1).toString().padStart(2, '0');
      const diaBD = diaMates.getDate().toString().padStart(2, '0');
      this.datesRealsLaravel.push(`${anyBD}-${mesBD}-${diaBD}`);
    }
  }

  // Aquest Signal recalcula la llista cada cop que canvien les dades del servidor
  alumnes = computed(() => {
    // 1. Obtenim tots els inscrits de l'institut
    const totsElsInscrits = this.inscritsManager.inscrits();
    const totesAssistencies = this.assistenciesManager.assistencies();

    // 2. Definim de quina assignatura volem passar llista (Temporalment la 1)
    const idAssignaturaActual = 1;

    // 3. Preparem la llista buida
    const alumnesDestaClasse: any[] = [];

    // 4. Busquem amb un bucle tradicional quins alumnes pertanyen a aquesta assignatura
    for (let i = 0; i < totsElsInscrits.length; i++) {
      const inscripcio = totsElsInscrits[i];

      if (inscripcio.id_assignatura === idAssignaturaActual) {
        // Si la inscripció té les dades de l'alumne (el "with" de Laravel), l'afegim
        if (inscripcio.alumne && inscripcio.alumne.nom) {

          // Preparem les caselles d'assistència per a la setmana actual
          const assistenciaSetmana: any = {};

          for (let d = 0; d < this.datesSetmana.length; d++) {
            const dataMostrar = this.datesSetmana[d];      // Format: 18/11
            const dataLaravel = this.datesRealsLaravel[d]; // Format: 2026-11-18

            // Por defecte el quadre estarà buit
            let estatCasella = '';

            // Busquem si hi ha alguna assistència guardada per aquest alumne aquest dia
            for (let a = 0; a < totesAssistencies.length; a++) {
              const asis = totesAssistencies[a];

              // Comprovem id_inscripcio i si la data coincideix amb YYYY-MM-DD
              if (asis.id_inscripcio === inscripcio.id &&
                asis.data && asis.data.substring(0, 10) === dataLaravel) {

                // Traduïm l'estat amagat de Laravel als codis visuals F, FJ, R, .
                if (asis.estat === 'present') {
                  estatCasella = '.';
                } else if (asis.estat === 'retard') {
                  estatCasella = 'R';
                } else if (asis.estat === 'absent') {
                  if (asis.justificat) {
                    estatCasella = 'FJ';
                  } else {
                    estatCasella = 'F';
                  }
                }
                break; // Un cop trobada no cal buscar més
              }
            }

            assistenciaSetmana[dataMostrar] = estatCasella;
          }

          alumnesDestaClasse.push({
            id: inscripcio.id_alumne,
            id_inscripcio_db: inscripcio.id, // Per si ho necessitem si enviem coses al post
            nom: inscripcio.alumne.nom + ' ' + inscripcio.alumne.cognom,
            assistencia: assistenciaSetmana // Assignem l'objecte resolt
          });
        }
      }
    }

    return alumnesDestaClasse;
  });

  // Funció per moure el focus amb l'Enter, tal com tenies en la teva versió original
  moureFocus(filaIndex: number, colIndex: number) {
    if (colIndex === this.datesSetmana.length - 1) {
      const seguentFilaCol0 = document.getElementById(`input-${filaIndex + 1}-0`);
      if (seguentFilaCol0) seguentFilaCol0.focus();
    } else {
      const seguentCol = document.getElementById(`input-${filaIndex}-${colIndex + 1}`);
      if (seguentCol) seguentCol.focus();
    }
  }

}
