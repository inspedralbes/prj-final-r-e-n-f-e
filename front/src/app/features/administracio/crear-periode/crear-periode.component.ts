import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PeriodeService } from '../services/periode.service';

@Component({
  selector: 'app-crear-periode',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-periode.component.html',
  styleUrls: ['./crear-periode.component.css']
})
export class CrearPeriodeComponent {

  periode = {
    trimestre_1_ini: '', trimestre_1_fi: '',
    trimestre_2_ini: '', trimestre_2_fi: '',
    trimestre_3_ini: '', trimestre_3_fi: ''
  };

  erroresServidor: string[] = [];

  constructor(private periodeService: PeriodeService, private router: Router) {}

  guardarPeriode() {
    this.erroresServidor = [];

    this.periodeService.crearPeriode(this.periode).subscribe({
      next: () => {
        alert('Període creat correctament!');
        this.router.navigate(['/administracio/gestio-cicles']);
      },
      error: (err) => {
        console.error('Error del backend:', err);
        if (err.status === 422 && err.error.errors) {
          this.erroresServidor = Object.values(err.error.errors).flat() as string[];
        } else {
          this.erroresServidor = ['Hi ha hagut un error inesperat. Revisa la consola.'];
        }
      }
    });
  }
}