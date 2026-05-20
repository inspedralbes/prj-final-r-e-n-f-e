import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarAdminComponent } from '../../../shared/components/sidebaradmin/sidebar.component';
import { CursosManagerService } from '../../../shared/services/cursos/cursos-manager.service';
import { UsuarisManagerService } from '../../../shared/services/usuaris/usuaris-manager.service';
import { PeriodesManagerService } from '../../../shared/services/periodes/periodes-manager.service';
import { Curs } from '../../../shared/models/curs.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroPencilSquare,
  heroTrash,
  heroPlus,
  heroRectangleGroup,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-admin-cursos',
  imports: [CommonModule, FormsModule, SidebarAdminComponent, NgIconComponent],
  providers: [
    provideIcons({ heroPencilSquare, heroTrash, heroPlus, heroRectangleGroup }),
  ],
  templateUrl: './admin-cursos.component.html',
  styleUrl: './admin-cursos.component.css',
})
export class AdminCursosComponent implements OnInit {
  private cursosManager = inject(CursosManagerService);
  private usuarisManager = inject(UsuarisManagerService);
  private periodesManager = inject(PeriodesManagerService);

  public cursos = this.cursosManager.cursos;
  public isLoading = this.cursosManager.isLoading;

  public professors = computed(() => {
    const tots = this.usuarisManager.usuaris();
    const llista = [];
    for (let i = 0; i < tots.length; i++) {
      const rol = (tots[i].rol || '').toString().toLowerCase();
      if (rol.startsWith('prof')) {
        llista.push(tots[i]);
      }
    }
    return llista;
  });

  public periodes = this.periodesManager.periodes;

  public isModalOpen = false;
  public isEditing = false;
  public cursActual: Partial<Curs> = {};
  public isSaving = signal<boolean>(false);

  ngOnInit(): void {
    this.cursosManager.carregarCursos();
    this.usuarisManager.carregarUsuaris();
    this.periodesManager.carregarPeriodes();
  }

  obtenirNomTutor(id_tutor: number | null | undefined): string {
    if (!id_tutor) return 'Sense Tutor';
    const tots = this.professors();
    for (let i = 0; i < tots.length; i++) {
      if (tots[i].id == id_tutor) {
        const cognom = tots[i].cognom ? ` ${tots[i].cognom}` : '';
        return `${tots[i].nom}${cognom}`;
      }
    }
    return 'Sense Tutor';
  }

  obtenirNomPeriode(id_periode: number | null | undefined): string {
    if (!id_periode) return 'Sense Període';
    const tots = this.periodes();
    for (let i = 0; i < tots.length; i++) {
      if (tots[i].id == id_periode) {
        return tots[i].nom;
      }
    }
    return 'Sense Període';
  }

  obrirModal(curs?: Curs) {
    if (curs) {
      this.isEditing = true;
      this.cursActual = { ...curs };
    } else {
      this.isEditing = false;
      this.cursActual = { tipus: 'GM', nom: '', id_tutor: null, id_periode: null };
    }
    this.isModalOpen = true;
  }

  tancarModal() {
    this.isModalOpen = false;
    this.cursActual = {};
  }

  async guardarCurs() {
    this.isSaving.set(true);
    try {
      if (this.isEditing && this.cursActual.id) {
        await this.cursosManager.actualitzarCurs(this.cursActual.id, this.cursActual);
      } else {
        await this.cursosManager.afegirCurs(this.cursActual);
      }
      this.tancarModal();
    } catch (error) {
      console.error('Error al guardar el curs', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async esborrarCurs(id: number) {
    if (confirm('Estàs segur que vols esborrar aquest curs de forma permanent?')) {
      this.isLoading.set(true);
      try {
        await this.cursosManager.esborrarCurs(id);
      } catch (error) {
        console.error("Error a l'esborrar el curs", error);
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
