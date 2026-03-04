import { Component, inject, OnInit, signal } from '@angular/core';
import { InscritsManagerService } from '../../shared/services/inscrits/inscrits-manager.service';

export interface assistenciaPerUsuari {
  nom_assignatura: { nom: string }[];
  retards: string;
  faltes: string;
  justificades: string;
}

@Component({
  selector: 'app-alumnes',
  imports: [],
  templateUrl: './alumnes.component.html',
  styleUrl: './alumnes.component.css',
})
export class AlumnesComponent implements OnInit {
  inscritsManager = inject(InscritsManagerService);

  indexActual = signal(-1);
  showDespegable = signal(false);
  inscritsPerUsuari = this.inscritsManager.inscritsPerUsuari;

  setIndex(index: number) {
    this.indexActual.set(index);
  }

  showAssignaturas() {
    this.showDespegable.set(!this.showDespegable());
  }
  // cookie:id -> inscripcio:id -> assistencies / assignatures(llista)
  ngOnInit(): void {
    const idAlumne: number = Number(this.inscritsManager.idAlumne());
    this.inscritsManager.carregarInscritAlumne('3');
  }
}
