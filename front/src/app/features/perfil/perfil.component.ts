import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService, PerfilData } from '../../shared/services/perfil/perfil.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  private perfilService = inject(PerfilService);

  user = signal<PerfilData | null>(null);
  mode = signal<'read' | 'edit'>('read');
  isLoading = signal<boolean>(false);

  editedData = signal<Partial<PerfilData>>({});

  async ngOnInit() {
    this.isLoading.set(true);
    const data = await this.perfilService.getPerfil();
    if (data) {
      this.user.set(data);
      this.editedData.set({
        nom: data.nom,
        cognom: data.cognom,
        email_pares: data.email_pares,
        data_naixement: data.data_naixement,
      });
    }
    this.isLoading.set(false);
  }

  toggleMode() {
    if (this.mode() === 'read') {
      this.mode.set('edit');
    } else {
      this.mode.set('read');
      const data = this.user();
      if (data) {
        this.editedData.set({
          nom: data.nom,
          cognom: data.cognom,
          email_pares: data.email_pares,
          data_naixement: data.data_naixement,
        });
      }
    }
  }

  get isAlumne(): boolean {
    return this.user()?.rol === 'Alumne';
  }

  get isProfeOrAdmin(): boolean {
    const rol = this.user()?.rol;
    return rol === 'Profe' || rol === 'Admin';
  }
}