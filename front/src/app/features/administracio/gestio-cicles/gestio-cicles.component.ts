import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CicleService } from '../services/cicle.service';

@Component({
  selector: 'app-gestio-cicles',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gestio-cicles.component.html',
  styleUrls: ['./gestio-cicles.component.css']
})
export class GestioCiclesComponent implements OnInit {
  
cicles: any[] = [];
  carregant: boolean = true;
  
  termeCerca: string = '';

  get ciclesFiltrats() {
    if (!this.termeCerca) {
      return this.cicles; 
    }
    
    return this.cicles.filter(c => 
      c.nom.toLowerCase().includes(this.termeCerca.toLowerCase())
    );
  }

constructor(
    private cicleService: CicleService,
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

  carregarCursos() {
    this.carregant = true;
    this.cicleService.getCursos().subscribe({
      next: (dades) => {
        this.cicles = dades;
        this.carregant = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar cursos', err);
        this.carregant = false;
        this.cdr.detectChanges();
      }
    });
  }

  esborrarCurs(id: number, nom: string) {
    if (confirm(`Estàs segur que vols eliminar el curs "${nom}"?`)) {
      this.cicleService.eliminarCurs(id).subscribe({
        next: () => {
          alert('Curs eliminat correctament');
          this.carregarCursos(); 
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('Hi ha hagut un error al eliminar el curs');
        }
      });
    }
  }
}