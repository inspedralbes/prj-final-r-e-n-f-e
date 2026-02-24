import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdministracioService } from '../administracio/services/administracio.service';

@Component({
    selector: 'app-administracio',
    imports: [RouterLink],
    templateUrl: './administracio.component.html',
    styleUrl: './administracio.component.css'
})
export class AdministracioComponent implements OnInit {

    estadistiques: any = {
    total_estudiantes: 0,
    docentes_activos: 0,
    asistencia_media: 0
  };

  constructor(private adminService: AdministracioService) {}

  ngOnInit(): void {
    this.adminService.getEstadistiques().subscribe({
      next: (dades) => {
        this.estadistiques = dades;
      },
      error: (err) => {
        console.error('Error al cargar las estadísticas', err);
      }
    });
  }
}
