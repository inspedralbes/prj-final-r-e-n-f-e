import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarAdminComponent } from '../../../shared/components/sidebaradmin/sidebar.component';
import { ClassesManagerService } from '../../../shared/services/classes/classes-manager.service';
import { CursosManagerService } from '../../../shared/services/cursos/cursos-manager.service';
import { UsuarisManagerService } from '../../../shared/services/usuaris/usuaris-manager.service';
import { Classe } from '../../../shared/models/classe.model';

@Component({
    selector: 'app-admin-classes',
    imports: [CommonModule, FormsModule, SidebarAdminComponent],
    templateUrl: './admin-classes.component.html',
    styleUrl: './admin-classes.component.css'
})
export class AdminClassesComponent implements OnInit {
  private classesManager = inject(ClassesManagerService);
  private cursosManager = inject(CursosManagerService);
  private usuarisManager = inject(UsuarisManagerService);

  public classes = this.classesManager.classes;
  public isLoading = this.classesManager.isLoading;
  public cursos = this.cursosManager.cursos;
  
  // Filtra manualment la llista completa d'usuaris per retenir només els "Professors" (requerit pel select de tutors)
  public professors = computed(() => {
    let listadoProfessores = [];
    let todosUsuarios = this.usuarisManager.usuaris();
    for (let i = 0; i < todosUsuarios.length; i++) {
      if (todosUsuarios[i].rol === 'Professor') {
        listadoProfessores.push(todosUsuarios[i]);
      }
    }
    return listadoProfessores;
  });

  // Gestió de visibilitat i contingut del modal d'edició/creació
  public isModalOpen = false;
  public isEditing = false;
  public classeActual: Partial<Classe> = {};

  ngOnInit(): void {
    // Instància a l'inici totes les dades necessàries des de l'API (Classes, Cursos relacionats i els Usuaris globals)
    this.classesManager.carregarClasses();
    this.cursosManager.carregarCursos();
    this.usuarisManager.carregarUsuaris();
  }

  // Busca iterativament el Nom associat a una ID per humanitzar les cel·les de la taula
  obtenirNomCurs(id_curs: number): string {
    let curs = null;
    let todosCursos = this.cursos();
    for (let i = 0; i < todosCursos.length; i++) {
      if (todosCursos[i].id == id_curs) {
        curs = todosCursos[i];
        break;
      }
    }
    return curs ? curs.nom : 'Desconegut';
  }

  obtenirNomTutor(id_tutor: number): string {
    let tutor = null;
    let todosProfesores = this.professors();
    for (let i = 0; i < todosProfesores.length; i++) {
      if (todosProfesores[i].id == id_tutor) {
        tutor = todosProfesores[i];
        break;
      }
    }
    return tutor ? `${tutor.nom} ${tutor.cognom}` : 'Sense Tutor';
  }

  obrirModal(classe?: Classe) {
    if (classe) {
      this.isEditing = true;
      this.classeActual = { ...classe };
    } else {
      this.isEditing = false;
      this.classeActual = { nom: '', id_curs: 0, id_tutor: 0 };
    }
    this.isModalOpen = true;
  }

  tancarModal() {
    this.isModalOpen = false;
    this.classeActual = {};
  }

  async guardarClasse() {
    this.isLoading.set(true);
    try {
      if (this.isEditing && this.classeActual.id) {
        await this.classesManager.actualitzarClasse(this.classeActual.id, this.classeActual);
      } else {
        await this.classesManager.afegirClasse(this.classeActual);
      }
      this.tancarModal();
    } catch (error) {
      console.error("Error al guardar la classe", error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async esborrarClasse(id: number) {
    if (confirm("Estàs segur que vols esborrar aquesta classe de forma permanent?")) {
      this.isLoading.set(true);
      try {
        await this.classesManager.esborrarClasse(id);
      } catch (error) {
        console.error("Error a l'esborrar la classe", error);
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
