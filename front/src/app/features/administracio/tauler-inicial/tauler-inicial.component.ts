import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiManagerService } from '../../../shared/services/api/api-manager.service';

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

  constructor(private apiManager: ApiManagerService) {}

  ngOnInit(): void {
    this.apiManager.get<any>('/administracio/stats')
      .then((dades) => { this.estadistiques = dades; })
      .catch((err) => { console.error('Error', err); });
  }
}