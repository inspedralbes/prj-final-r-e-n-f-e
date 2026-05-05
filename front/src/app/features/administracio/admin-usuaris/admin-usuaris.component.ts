import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarAdminComponent } from '../../../shared/components/sidebaradmin/sidebar.component';
import { UsuarisManagerService } from '../../../shared/services/usuaris/usuaris-manager.service';
import { Usuari } from '../../../shared/models/usuaris.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash, heroPlus, heroUser } from '@ng-icons/heroicons/outline';

@Component({
    selector: 'app-admin-usuaris',
    imports: [CommonModule, FormsModule, SidebarAdminComponent, NgIconComponent],
    providers: [provideIcons({ heroPencilSquare, heroTrash, heroPlus, heroUser })],
    templateUrl: './admin-usuaris.component.html',
    styleUrl: './admin-usuaris.component.css',
    styles: [`:host { display: block; animation: pageEnter 0.35s ease-out; }`]
})
export class AdminUsuarisComponent implements OnInit {
  private usuarisManager = inject(UsuarisManagerService);

  public usuaris = this.usuarisManager.usuaris;
  public isLoading = this.usuarisManager.isLoading;

  // Estat del Modal
  public isModalOpen = false;
  public isEditing = false;
  public usuariActual: Partial<Usuari> = {};
  public isSaving = signal<boolean>(false);

  ngOnInit(): void {
    this.usuarisManager.carregarUsuaris();
  }

  obrirModal(usuari?: Usuari) {
    if (usuari) {
      this.isEditing = true;
      // Fem una còpia de l'usuari perquè els canvis al form no afectin l'estat fins a guardar
      this.usuariActual = { ...usuari };
    } else {
      this.isEditing = false;
      this.usuariActual = { nom: '', cognom: '', email: '', rol: 'Alumne', password: '', id_classe: null };
    }
    this.isModalOpen = true;
  }

  tancarModal() {
    this.isModalOpen = false;
    this.usuariActual = {};
  }

  async guardarUsuari() {
    this.isSaving.set(true);
    try {
      if (this.isEditing && this.usuariActual.id) {
        await this.usuarisManager.actualitzarUsuari(this.usuariActual.id, this.usuariActual);
      } else {
        await this.usuarisManager.afegirUsuari(this.usuariActual);
      }
      this.tancarModal();
    } catch (error) {
      console.error("Error al guardar l'usuari", error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async esborrarUsuari(id: number) {
    if (confirm("Estàs segur que vols esborrar aquest usuari de forma permanent?")) {
      this.isLoading.set(true);
      try {
        await this.usuarisManager.esborrarUsuari(id);
      } catch (error) {
        console.error("Error a l'esborrar l'usuari", error);
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
