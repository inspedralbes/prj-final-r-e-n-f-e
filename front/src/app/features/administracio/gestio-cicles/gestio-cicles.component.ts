import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CicleService } from '../services/cicle.service';

@Component({
  selector: 'app-gestio-cicles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestio-cicles.component.html',
  styleUrls: ['./gestio-cicles.component.css']
})
export class GestioCiclesComponent implements OnInit {
  
  cursos: any[] = [];
  carregant: boolean = true; 

  constructor(private cicleService: CicleService) { }

  ngOnInit(): void {
    this.carregarCursos();
  }

  carregarCursos() {
    this.cicleService.getCursos().subscribe({
      next: (dades) => {
        this.cursos = dades;
        this.carregant = false;
      },
      error: (err) => console.error('Error al cargar cursos', err)
    });
    this.carregant = false;
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