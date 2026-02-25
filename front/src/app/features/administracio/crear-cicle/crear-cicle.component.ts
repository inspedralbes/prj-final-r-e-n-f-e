import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CicleService } from '../services/cicle.service';

@Component({
  selector: 'app-crear-cicle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-cicle.component.html',
  styleUrl: './crear-cicle.component.css'
})
export class CrearCicleComponent {
  
  cicle = { nom: '', tipus: '', id_tutor: null, id_periode: null };

  constructor(private cicleService: CicleService, private router: Router) {}

  crearCicle() {
    this.cicleService.crearCicle(this.cicle).subscribe({
      next: () => {
        alert('Cicle creat correctament!');
        this.router.navigate(['/administracio/gestio-cicles']); 
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear el cicle');
      }
    });
  }
}