import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarAdminComponent } from '../../../shared/components/sidebaradmin/sidebar.component';
import { AssignaturesManagerService } from '../../../shared/services/assignatures/assignatures-manager.service';
import { InscritsManagerService } from '../../../shared/services/inscrits/inscrits-manager.service';
import { UsuarisManagerService } from '../../../shared/services/usuaris/usuaris-manager.service';
import { Assignatura } from '../../../shared/models/assignatura.model';
import { Usuari } from '../../../shared/models/usuaris.model';

@Component({
  selector: 'app-admin-assignatures',
  imports: [CommonModule, FormsModule, SidebarAdminComponent],
  templateUrl: './admin-assignatures.component.html',
  styleUrl: './admin-assignatures.component.css',
})
export class AdminAssignaturesComponent implements OnInit {
  private assignaturesManager = inject(AssignaturesManagerService);
  private inscritsManager = inject(InscritsManagerService);
  private usuarisManager = inject(UsuarisManagerService);

  public assignatures = this.assignaturesManager.assignatures;
  public isLoading = this.assignaturesManager.isLoading;

  // Lògica d'estat del formulari CRUD
  public isModalOpen = false;
  public isEditing = false;
  // Només necessitem l'identificador buit (0) perquè id_classe_projecte la requerirà l'API si escau. Aquí utilitzem 0 per defecte
  public assignaturaActual: Partial<Assignatura> = {}; 

  // Lògica d'estat del Modal Mestre-Detall (Inscrits)
  public isInscritsModalOpen = false;
  public assignaturaSeleccionada: Assignatura | null = null;
  public estudiantsInscritsLlista: Usuari[] = [];

  ngOnInit(): void {
    // Sincronitza tots els models des de Laravel necessaris per pintar relacions
    this.assignaturesManager.carregarAssignatures();
    this.inscritsManager.carregarInscrits();
    this.usuarisManager.carregarUsuaris();
  }

  // Obre el modal per Crear (sense paràmetre) o Editar (rebent objecte)
  obrirModalCRUD(assignatura?: Assignatura) {
    if (assignatura) {
      this.isEditing = true;
      this.assignaturaActual = { ...assignatura };
    } else {
      this.isEditing = false;
      this.assignaturaActual = { nom: '', id_classe_projecte: 1 }; // Valor per defecte segons el model requerit
    }
    this.isModalOpen = true;
  }

  tancarModalCRUD() {
    this.isModalOpen = false;
    this.assignaturaActual = {};
  }

  // Desa de forma HTTP les dades al backend depenent del modus
  async guardarAssignatura() {
    this.isLoading.set(true);
    try {
      if (this.isEditing && this.assignaturaActual.id) {
        await this.assignaturesManager.actualitzarAssignatura(
          this.assignaturaActual.id,
          this.assignaturaActual
        );
      } else {
        await this.assignaturesManager.afegirAssignatura(this.assignaturaActual);
      }
      this.tancarModalCRUD();
    } catch (error) {
      console.error("Error aplicant canvis de l'assignatura:", error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Petició d'esborrament a l'API
  async esborrarAssignatura(id: number) {
    if (confirm("Segur que vols eliminar completament aquesta assignatura?")) {
      this.isLoading.set(true);
      try {
        await this.assignaturesManager.esborrarAssignatura(id);
      } catch (error) {
        console.error("No hem pogut suprimir l'assignatura:", error);
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  // Mètode clau pel Master-Detail (Recull de dades i obertura Modal Inscrits)
  obrirModalInscrits(assignatura: Assignatura) {
    this.assignaturaSeleccionada = assignatura;
    let llistaDAlumnesVinculats = [];
    
    // Obtenim en format cru els llistats complets des dels Signals (zero funcions avançades)
    const totsInscrits = this.inscritsManager.inscrits();
    const totsUsuaris = this.usuarisManager.usuaris();

    for (let i = 0; i < totsInscrits.length; i++) {
        // Si trobem que alguna matricula pertany a la nostra assignatura
        if (totsInscrits[i].id_assignatura === assignatura.id) {
            
            // Llavors iterem l'estat d'usuaris per cercar quin usuari li correspon la clau
            for (let j = 0; j < totsUsuaris.length; j++) {
                if (totsUsuaris[j].id === totsInscrits[i].id_alumne) {
                    llistaDAlumnesVinculats.push(totsUsuaris[j]);
                    break;
                }
            }
            
        }
    }
    
    this.estudiantsInscritsLlista = llistaDAlumnesVinculats;
    this.isInscritsModalOpen = true;
  }

  tancarModalInscrits() {
    this.isInscritsModalOpen = false;
    this.assignaturaSeleccionada = null;
    this.estudiantsInscritsLlista = [];
  }
}
