import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CiclesManagerService } from '../../../shared/services/cicles/cicles-manager.service';
import { CrearCicleComponent } from '../crear-cicle/crear-cicle.component';

@Component({
  selector: 'app-gestio-cicles',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CrearCicleComponent],
  templateUrl: './gestio-cicles.component.html',
  styleUrls: ['./gestio-cicles.component.css']
})
export class GestioCiclesComponent implements OnInit {
  
cicles: any[] = [];
  carregant: boolean = true;
  termeCerca: string = '';
  mostrarModal: boolean = false;
  idCursSeleccionat: number | null = null;

  get ciclesFiltrats() {
    if (!this.termeCerca) {
      return this.cicles; 
    }
    
    return this.cicles.filter(c => 
      c.nom.toLowerCase().includes(this.termeCerca.toLowerCase())
    );
  }

constructor(
  private cicleService: CiclesManagerService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.carregarCursos();
    } else {
      this.carregant = false;
    }
  }

  obrirModalCrear() {
    this.idCursSeleccionat = null;
    this.mostrarModal = true;
  }

  obrirModalEditar(id: number) {
    this.idCursSeleccionat = id; 
    this.mostrarModal = true;
  }

  gestionarTancamentModal(calActualitzar: boolean) {
    this.mostrarModal = false;
    if (calActualitzar) {
      this.carregarCursos(); 
    }
  }


  async carregarCursos() {
    this.carregant = true;
    try {
      const dades = await this.cicleService.getCursos();
      this.cicles = dades;
    } catch (err) {
      console.error('Error al cargar cursos', err);
    } finally {
      this.carregant = false;
      this.cdr.detectChanges();
    }
  }

  async esborrarCurs(id: number, nom: string) {
    if (confirm(`Estàs segur que vols eliminar el curs "${nom}"?`)) {
      try {
        await this.cicleService.eliminarCurs(id);
        alert('Curs eliminat correctament');
        this.carregarCursos();
      } catch (err) {
        console.error('Error al eliminar', err);
        alert('Hi ha hagut un error al eliminar el curs');
      }
    }
  }
}