import { Component, OnInit, inject, signal } from '@angular/core';
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
  assignaturesManager = inject(AssignaturesManagerService);

  novaAssignaturaNom = signal<string>('');
  novaAssignaturaInterval = signal<number | null>(null);
  novaAssignaturaExempcio = signal<boolean>(false);

  ngOnInit(): void {
    this.assignaturesManager.carregarAssignatures();

  }

  crearAssignatura(): void {
    const nom = this.novaAssignaturaNom();
    const interval = this.novaAssignaturaInterval();
    const exempcio = this.novaAssignaturaExempcio();
    
    if (!nom) {
      alert("El nom de l'assignatura és obligatori.");
      return;
    }
    
    const requestData: any = { nom, exempcio };
    if (interval !== null && interval !== undefined) {
      requestData.interval = interval;
    }
    
    this.assignaturesManager.afegirAssignatura(requestData)
      .then(() => {
        this.novaAssignaturaNom.set('');
        this.novaAssignaturaInterval.set(null);
        this.novaAssignaturaExempcio.set(false);
      })
      .catch(err => {
        console.error('Error al crear l\'assignatura', err);
        alert('No s\'ha pogut crear l\'assignatura.');
      });
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
