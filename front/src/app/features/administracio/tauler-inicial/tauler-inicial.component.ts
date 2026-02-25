import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministracioService } from '../services/administracio.service';

@Component({
  selector: 'app-tauler-inicial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tauler-inicial.component.html',
  styleUrls: ['./tauler-inicial.component.css']
})
export class TaulerInicialComponent implements OnInit {
  estadistiques: any = {
    total_estudiantes: 0,
    docentes_activos: 0,
    asistencia_media: 0
  };

  constructor(private adminService: AdministracioService) {}

  ngOnInit(): void {
    this.adminService.getEstadistiques().subscribe({
      next: (dades) => { this.estadistiques = dades; },
      error: (err) => { console.error('Error', err); }
    });
  }
}