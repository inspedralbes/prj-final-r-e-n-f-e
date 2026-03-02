import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuariService } from '../services/usuari.service';

@Component({
  selector: 'app-gestio-usuaris',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestio-usuaris.component.html',
  styleUrls: ['./gestio-usuaris.component.css']
})
export class GestioUsuarisComponent implements OnInit {
  usuaris: any[] = [];
  carregant: boolean = true;

  constructor(private usuariService: UsuariService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarUsuaris();
  }

  carregarUsuaris() {
    this.carregant = true;
    this.usuariService.getUsuaris().subscribe({
      next: (dades) => {
        this.usuaris = dades.data || dades;
        this.carregant = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error carregant usuaris', err);
        this.carregant = false;
        this.cdr.detectChanges();
      }
    });
  }

  esborrarUsuari(id: number) {
    if (confirm(`Estàs segur que vols eliminar aquest usuari?`)) {
      this.usuariService.eliminarUsuari(id).subscribe({
        next: () => {
          alert('Usuari eliminat correctament');
          this.carregarUsuaris();
        },
        error: (err) => alert('Error al eliminar')
      });
    }
  }
}