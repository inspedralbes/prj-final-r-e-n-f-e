import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CiclesManagerService } from '../../../shared/services/cicles/cicles-manager.service';

@Component({
  selector: 'app-crear-cicle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-cicle.component.html',
  styleUrl: './crear-cicle.component.css'
})
export class CrearCicleComponent implements OnInit {
  
  @Input() idCursEditar: number | null = null; 
  
  @Output() tancarModal = new EventEmitter<boolean>(); 

  cicle = {
    nom: '', tipus: '', id_tutor: null, id_periode: null
  };

  erroresServidor: string[] = [];
  esEdicio: boolean = false; 

  constructor(
    private cicleService: CiclesManagerService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.idCursEditar) {
      this.esEdicio = true;
      try {
        const dades = await this.cicleService.getCurs(this.idCursEditar);
        this.cicle = (dades.data || dades);
        this.cdr.detectChanges();
      } catch (err) {
        console.error('Error al cargar', err);
      }
    }
  }

  async guardarCicle() {
    this.erroresServidor = [];

    try {
      if (this.esEdicio && this.idCursEditar) {
        await this.cicleService.actualitzarCurs(this.idCursEditar, this.cicle);
        alert('Cicle actualitzat!');
        this.tancarModal.emit(true);
      } else {
        await this.cicleService.crearCicle(this.cicle);
        alert('Cicle creat!');
        this.tancarModal.emit(true);
      }
    } catch (err) {
      this.gestionarError(err);
    }
  }

  cancelar() {
    this.tancarModal.emit(false);
  }

  gestionarError(err: any) {
    if (err.status === 422 && err.error.errors) {
      this.erroresServidor = Object.values(err.error.errors).flat() as string[];
    } else {
      this.erroresServidor = ['Hi ha hagut un error inesperat.'];
    }
  }
}