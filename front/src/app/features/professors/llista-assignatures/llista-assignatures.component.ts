import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AssignaturesManagerService } from '../../../shared/services/assignatures/assignatures-manager.service';

@Component({
  selector: 'app-llista-assignatures',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './llista-assignatures.component.html',
  styleUrl: './llista-assignatures.component.css',
})
export class LlistaAssignaturesComponent implements OnInit {
  private assignaturesManager = inject(AssignaturesManagerService);

  // Signals per al formulari de creació
  novaAssignaturaNom = signal<string>('');
  novaAssignaturaDataInici = signal<string>('');
  novaAssignaturaDataFi = signal<string>('');
  novaAssignaturaExempcio = signal<boolean>(false);

  ngOnInit(): void {
    // Carreguem les dades només entrar a la pantalla
    this.assignaturesManager.carregarAssignatures();
  }

  // Llista d'assignatures per a la llista
  assignaturesLlista = computed(() => {
    const dadesManager = this.assignaturesManager.assignatures();
    const arrayResultat = [];

    // Bucle per copiar les dades
    for (let i = 0; i < dadesManager.length; i++) {
      arrayResultat.push(dadesManager[i]);
    }

    // Ordenem per nom per tenir la llista endreçada
    arrayResultat.sort((a, b) => a.nom.localeCompare(b.nom));

    return arrayResultat;
  });

  // Getter per a l'estat de càrrega (per a l'HTML)
  get isLoading() { return this.assignaturesManager.isLoading(); }
  get error() { return this.assignaturesManager.error(); }

  crearAssignatura(): void {
    const nom = this.novaAssignaturaNom();
    const inici = this.novaAssignaturaDataInici();
    const fi = this.novaAssignaturaDataFi();
    const exempcio = this.novaAssignaturaExempcio();

    if (!nom) {
      alert("El nom de l'assignatura és obligatori.");
      return;
    }

    const requestData: any = { nom, exempcio };

    // Si hi ha dates, creem el format JSON que espera el seeder/base de dades
    if (inici && fi) {
      requestData.interval = JSON.stringify([{ data_ini: inici, data_fi: fi }]);
    }

    this.assignaturesManager.afegirAssignatura(requestData)
      .then(() => {
        this.novaAssignaturaNom.set('');
        this.novaAssignaturaDataInici.set('');
        this.novaAssignaturaDataFi.set('');
        this.novaAssignaturaExempcio.set(false);
      })
      .catch(err => {
        console.error('Error al crear l\'assignatura', err);
        alert('No s\'ha pogut crear l\'assignatura.');
      });
  }

  // Converteix el format JSON de la base de dades a un text llegible (DD/MM/YYYY)
  formatarInterval(intervalRaw: any): string {
    if (!intervalRaw) return 'No definit';

    try {
      // Intentem parsejar si ens arriba com a text
      let dades = intervalRaw;
      if (typeof intervalRaw === 'string') {
        dades = JSON.parse(intervalRaw);
      }

      // Si tenim un array amb dades, processem la primera data
      if (Array.isArray(dades) && dades.length > 0) {
        const item = dades[0];
        if (item.data_ini && item.data_fi) {

          // Formatem la data d'inici (YYYY-MM-DD -> DD/MM/YYYY)
          const inici = item.data_ini;
          const pInici = inici.split('-');
          let iniciFormatat = inici;
          if (pInici.length === 3) iniciFormatat = pInici[2] + '/' + pInici[1] + '/' + pInici[0];

          // Formatem la data de fi (YYYY-MM-DD -> DD/MM/YYYY)
          const fi = item.data_fi;
          const pFi = fi.split('-');
          let fiFormatat = fi;
          if (pFi.length === 3) fiFormatat = pFi[2] + '/' + pFi[1] + '/' + pFi[0];

          return iniciFormatat + ' - ' + fiFormatat;
        }
      }
      return String(intervalRaw);
    } catch (e) {
      return String(intervalRaw);
    }
  }

  eliminarAssignatura(id: number): void {
    if (confirm('Estàs segur d\'esborrar aquesta assignatura?')) {
      this.assignaturesManager.esborrarAssignatura(id)
        .catch(err => {
          console.error('Error al eliminar l\'assignatura', err);
        });
    }
  }

}
