import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { CicleService } from '../services/cicle.service';

@Component({
  selector: 'app-crear-cicle',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './crear-cicle.component.html',
  styleUrl: './crear-cicle.component.css'
})
export class CrearCicleComponent {
  private cicleService = inject(CicleService);

  formulariCicle = new FormGroup({
    nom: new FormControl('', Validators.required),
    tipus: new FormControl('', Validators.required),
    id_tutor: new FormControl('', Validators.required),
    id_periode: new FormControl('', Validators.required)
  });

  guardarCicle() {
    if (this.formulariCicle.valid) {
      const dades = this.formulariCicle.value;
      
      this.cicleService.crearCicle(dades).subscribe({
        
        next: (resposta) => {
          console.log('Resposta del servidor Laravel:', resposta);
          alert('Curs guardat a la Base de Dades amb èxit!');
          this.formulariCicle.reset(); 
        },
        
        error: (error) => {
          console.error('Error enviant al backend:', error);
          alert('Error en guardar. Revisa la consola per veure què ha fallat.');
        }
        
      });
      
    } else {
      alert("Si us plau, omple tots els camps obligatoris.");
    }
  }
}