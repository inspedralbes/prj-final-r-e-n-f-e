import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PeriodeService } from '../services/periode.service';

@Component({
  selector: 'app-crear-periode',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-periode.component.html',
  styleUrls: ['./crear-periode.component.css']
})
export class  CrearPeriodeComponent implements OnInit {

  periode = {
    trimestre_1_ini: '', trimestre_1_fi: '',
    trimestre_2_ini: '', trimestre_2_fi: '',
    trimestre_3_ini: '', trimestre_3_fi: ''
  };

 erroresServidor: string[] = [];
  esEdicio: boolean = false; 
  idPeriodeActual: number | null = null;

  constructor(
    private periodeService: PeriodeService, 
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef 
  ) 
  {

  }
  
ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.esEdicio = true;
      this.idPeriodeActual = Number(idParam);
      
      this.periodeService.getPeriode(this.idPeriodeActual).subscribe({
        next: (dades) => {
          
          const formatData = (data: string) => data ? data.substring(0, 10) : '';

          this.periode = {
            trimestre_1_ini: formatData(dades.trimestre_1_ini),
            trimestre_1_fi: formatData(dades.trimestre_1_fi),
            trimestre_2_ini: formatData(dades.trimestre_2_ini),
            trimestre_2_fi: formatData(dades.trimestre_2_fi),
            trimestre_3_ini: formatData(dades.trimestre_3_ini),
            trimestre_3_fi: formatData(dades.trimestre_3_fi)
          };

          this.cdr.detectChanges(); 
        },
        error: (err) => console.error('Error al cargar datos del periodo', err)
      });
    }
  }

guardarPeriode() {
    this.erroresServidor = [];

    if (this.esEdicio && this.idPeriodeActual) {
      this.periodeService.actualitzarPeriode(this.idPeriodeActual, this.periode).subscribe({
        next: () => {
          alert('Període actualitzat correctament!');
          this.router.navigate(['/administracio/gestio-periodes']);
        },
        error: (err) => this.gestionarError(err)
      });
    } else {
      this.periodeService.crearPeriode(this.periode).subscribe({
        next: () => {
          alert('Període creat correctament!');
          this.router.navigate(['/administracio/gestio-periodes']);
        },
        error: (err) => this.gestionarError(err)
      });
    }
  }

  gestionarError(err: any) {
    alert('Hi ha hagut un error! Revisa les dates del formulari.');


    if (err.status === 422 && err.error.errors) {
      this.erroresServidor = Object.values(err.error.errors).flat() as string[];
    } else {
      this.erroresServidor = ['Hi ha hagut un error inesperat al servidor.'];
    }


    window.scrollTo({ top: 0, behavior: 'smooth' });
  
  }}