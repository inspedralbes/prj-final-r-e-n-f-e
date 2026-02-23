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
  // Inyectamos nuestro manager
  assignaturesManager = inject(AssignaturesManagerService);

  novaAssignaturaNom = signal<string>('');

  ngOnInit(): void {
    this.assignaturesManager.carregarAssignatures();

  }

  crearAssignatura(): void {
    const nom = this.novaAssignaturaNom();
    if (!nom) {
      return;
    }
    this.assignaturesManager.afegirAssignatura({ nom })
      .then(() => {
        this.novaAssignaturaNom.set('');
      })
      .catch(err => {
        console.error('Error al crear l\'assignatura', err);
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
