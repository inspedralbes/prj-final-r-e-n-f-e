import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PeriodesManagerService } from '../../../shared/services/periodes/periodes-manager.service';
import { CrearPeriodeComponent } from '../crear-periode/crear-periode.component';

@Component({
  selector: 'app-gestio-periodes',
  standalone: true,
  imports: [CommonModule, RouterModule, CrearPeriodeComponent],
  templateUrl: './gestio-periodes.component.html',
  styleUrls: ['./gestio-periodes.component.css']
})
export class GestioPeriodesComponent implements OnInit {
  
  periodes: any[] = [];
  carregant: boolean = true;

  mostrarModal: boolean = false;
  idPeriodeSeleccionat: number | null = null;

  constructor(
    private periodeService: PeriodesManagerService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.carregarPeriodes();
    } else {
      this.carregant = false;
    }
  }

  obrirModalCrear() {
    this.idPeriodeSeleccionat = null; 
    this.mostrarModal = true;
  }

  obrirModalEditar(id: number) {
    this.idPeriodeSeleccionat = id; 
    this.mostrarModal = true;
  }

  gestionarTancamentModal(calActualitzar: boolean) {
    this.mostrarModal = false;
    if (calActualitzar) {
      this.carregarPeriodes(); 
    }
  }


  async carregarPeriodes() {
    this.carregant = true;
    try {
      const dades = await this.periodeService.getPeriodes();
      this.periodes = dades;
    } catch (err) {
      console.error('Error carregant períodes', err);
    } finally {
      this.carregant = false;
      this.cdr.detectChanges();
    }
  }

  async esborrarPeriode(id: number) {
    if (confirm(`Estàs segur que vols eliminar aquest període?`)) {
      try {
        await this.periodeService.eliminarPeriode(id);
        alert('Període eliminat correctament');
        this.carregarPeriodes();
      } catch (err) {
        alert('Hi ha hagut un error al eliminar');
      }
    }
  }
}