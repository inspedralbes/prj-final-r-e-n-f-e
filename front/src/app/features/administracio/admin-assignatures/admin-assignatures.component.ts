import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarAdminComponent } from '../../../shared/components/sidebaradmin/sidebar.component';
import { AssignaturesManagerService } from '../../../shared/services/assignatures/assignatures-manager.service';
import { InscritsManagerService } from '../../../shared/services/inscrits/inscrits-manager.service';
import { UsuarisManagerService } from '../../../shared/services/usuaris/usuaris-manager.service';
import { Assignatura } from '../../../shared/models/assignatura.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash, heroPlus, heroEye, heroBookOpen, heroUser } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-admin-assignatures',
  imports: [CommonModule, FormsModule, SidebarAdminComponent, NgIconComponent],
  providers: [provideIcons({ heroPencilSquare, heroTrash, heroPlus, heroEye, heroBookOpen, heroUser })],
  templateUrl: './admin-assignatures.component.html',
  styleUrl: './admin-assignatures.component.css'
})
export class AdminAssignaturesComponent implements OnInit {
  private assignaturesManager = inject(AssignaturesManagerService);
  private inscritsManager = inject(InscritsManagerService);
  private usuarisManager = inject(UsuarisManagerService);

  public assignatures = this.assignaturesManager.assignatures;
  public isLoading = this.assignaturesManager.isLoading;

  // Estat del Modal d'Edició/Creació
  public isModalOpen = false;
  public isEditing = false;
  public assignaturaActual: Partial<Assignatura> = {};
  public dataInici: string = '';
  public dataFi: string = '';

  // Estat del Modal d'Alumnes Inscrits
  public isAlumnesModalOpen = false;
  public assignaturaSeleccionada: Assignatura | null = null;
  public alumnesInscritsLlista: any[] = [];

  ngOnInit(): void {
    // Carreguem tota la informació necessària
    this.assignaturesManager.carregarAssignatures();
    this.inscritsManager.carregarInscrits();
    this.usuarisManager.carregarUsuaris();
  }

  obrirModal(assignatura?: Assignatura) {
    if (assignatura) {
      this.isEditing = true;
      this.assignaturaActual = { ...assignatura };
      
      // Parsejar JSON de l'interval per separar les dates
      try {
        if (assignatura.interval) {
          let parsed = JSON.parse(assignatura.interval);
          this.dataInici = parsed.inici || '';
          this.dataFi = parsed.fi || '';
        } else {
          this.dataInici = '';
          this.dataFi = '';
        }
      } catch(e) {
        // En cas que l'interval no sigui un JSON vàlid o ja fos text lliure
        this.dataInici = '';
        this.dataFi = '';
      }
    } else {
      this.isEditing = false;
      this.assignaturaActual = { nom: '', id_classe_projecte: 0, exempcio: false, interval: '' };
      this.dataInici = '';
      this.dataFi = '';
    }
    this.isModalOpen = true;
  }

  tancarModal() {
    this.isModalOpen = false;
    this.assignaturaActual = {};
  }

  async guardarAssignatura() {
    this.isLoading.set(true);
    try {
      // Ajustos per defecte si es deixen en blanc
      if (!this.assignaturaActual.id_classe_projecte) {
         this.assignaturaActual.id_classe_projecte = 1; // Valor segur per defecte
      }
      
      // Construeix el JSON amb les dates
      if (this.dataInici || this.dataFi) {
         this.assignaturaActual.interval = JSON.stringify({ inici: this.dataInici, fi: this.dataFi });
      } else {
         this.assignaturaActual.interval = '';
      }
      
      if (this.isEditing && this.assignaturaActual.id) {
        await this.assignaturesManager.actualitzarAssignatura(this.assignaturaActual.id, this.assignaturaActual);
      } else {
        await this.assignaturesManager.afegirAssignatura(this.assignaturaActual);
      }
      this.tancarModal();
    } catch (error) {
      console.error("Error al guardar l'assignatura", error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async esborrarAssignatura(id: number) {
    if (confirm("Estàs segur que vols esborrar aquesta assignatura permanentment?")) {
      this.isLoading.set(true);
      try {
        await this.assignaturesManager.esborrarAssignatura(id);
      } catch (error) {
        console.error("Error a l'esborrar l'assignatura", error);
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  // --- Lògica per veure els alumnes inscrits ---
  
  obrirModalAlumnes(assignatura: Assignatura) {
    this.assignaturaSeleccionada = assignatura;
    let alumnesTrobats = [];
    
    // Obtenim llistats bruts
    let totsInscrits = this.inscritsManager.inscrits();
    let totsUsuaris = this.usuarisManager.usuaris();
    
    // Iterem mitjançant bucle primitiu
    for (let i = 0; i < totsInscrits.length; i++) {
       if (totsInscrits[i].id_assignatura === assignatura.id) {
           // Hem trobat un inscrit, ara busquem qui és a la llista d'usuaris
           let idAlumne = totsInscrits[i].id_alumne;
           
           for (let j = 0; j < totsUsuaris.length; j++) {
               if (totsUsuaris[j].id === idAlumne) {
                   alumnesTrobats.push(totsUsuaris[j]);
                   break; // Sortim del bucle intern ja que hem trobat l'alumne
               }
           }
       }
    }
    
    this.alumnesInscritsLlista = alumnesTrobats;
    this.isAlumnesModalOpen = true;
  }

  tancarModalAlumnes() {
    this.isAlumnesModalOpen = false;
    this.assignaturaSeleccionada = null;
    this.alumnesInscritsLlista = [];
  }
}
