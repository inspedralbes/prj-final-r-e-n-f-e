import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import { CicleService } from '../services/cicle.service';

@Component({
  selector: 'app-crear-cicle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-cicle.component.html',
  styleUrl: './crear-cicle.component.css'
})
export class CrearCicleComponent implements OnInit {
  
  cicle = { nom: '', tipus: '', id_tutor: null, id_periode: null };
  esEdicio: boolean = false;
  idCursActual: number | null = null;

  constructor(
    private cicleService: CicleService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.esEdicio = true;
      this.idCursActual = Number(idParam);
      
      this.cicleService.getCurs(this.idCursActual).subscribe({
        next: (dades) => this.cicle = dades,
        error: (err) => console.error('Error al cargar los datos', err)
      });
    }
  }

  guardarCicle() {
    if (this.esEdicio && this.idCursActual) {
      this.cicleService.actualitzarCurs(this.idCursActual, this.cicle).subscribe({
        next: () => {
          alert('Cicle actualitzat correctament!');
          this.router.navigate(['/administracio/gestio-cicles']);
        },
        error: (err) => alert('Error al actualitzar')
      });
    } else {
      this.cicleService.crearCicle(this.cicle).subscribe({
        next: () => {
          alert('Cicle creat correctament!');
          this.router.navigate(['/administracio/gestio-cicles']);
        },
        error: (err) => alert('Error al crear')
      });
    }
  }
}