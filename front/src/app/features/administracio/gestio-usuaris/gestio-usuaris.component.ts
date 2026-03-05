import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarisManagerService } from '../../../shared/services/usuaris/usuaris-manager.service';
import { CrearUsuariComponent } from '../crear-usuari/crear-usuari.component';

@Component({
  selector: 'app-gestio-usuaris',
  standalone: true,
  imports: [CommonModule, RouterModule, CrearUsuariComponent],
  templateUrl: './gestio-usuaris.component.html',
  styleUrls: ['./gestio-usuaris.component.css']
})
export class GestioUsuarisComponent implements OnInit {
  mostrarModal: boolean = false;
  idUsuariSeleccionat: number | null = null;
  usuaris: any[] = [];
  carregant: boolean = true;

  constructor(private usuariService: UsuarisManagerService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarUsuaris();
  }

  obrirModalCrear() {
    this.idUsuariSeleccionat = null;
    this.mostrarModal = true;
  }

  obrirModalEditar(id: number) {
    this.idUsuariSeleccionat = id;
    this.mostrarModal = true;
  }

  gestionarTancamentModal(calActualitzar: boolean) {
    this.mostrarModal = false;
    if (calActualitzar) {
      this.carregarUsuaris();
    }
  }

  async carregarUsuaris() {
    this.carregant = true;
    try {
      await this.usuariService.carregarUsuaris();
      this.usuaris = this.usuariService.usuaris();
    } catch (err) {
      console.error('Error carregant usuaris', err);
    } finally {
      this.carregant = false;
      this.cdr.detectChanges();
    }
  }

  async esborrarUsuari(id: number) {
    if (confirm(`Estàs segur que vols eliminar aquest usuari?`)) {
      try {
        await this.usuariService.esborrarUsuari(id);
        alert('Usuari eliminat correctament');
        this.carregarUsuaris();
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  }
}