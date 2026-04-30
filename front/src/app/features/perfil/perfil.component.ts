import { Component, inject, signal, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PerfilService,
  InfoAdicional,
} from '../../shared/services/perfil/perfil.service';
import { Usuari } from '../../shared/models/usuaris.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})

export class PerfilComponent implements OnInit {
  private perfilService = inject(PerfilService);

  @Input() id?: string;

  currentUser = signal<Usuari | null>(null)
  user = signal<Usuari | null>(null);
  infoAdicional = signal<InfoAdicional | null>(null);
  mode = signal<'read' | 'edit'>('read');
  isLoading = signal<boolean>(false);

  editedData = signal<Partial<Usuari>>({});

  async ngOnInit() {
    this.isLoading.set(true);
    
    const userString = localStorage.getItem('user');
    let currentUserId = null;
    if (userString) {
      const userJSON = JSON.parse(userString!);
      currentUserId = userJSON.id;
      this.currentUser.set(userJSON);
    }
    
    const perfilId = this.id || currentUserId;
    
    const rawData = await this.perfilService.getPerfil(perfilId);
    const data = rawData?.data;
    if (data) {
      this.user.set(data.user);
      this.infoAdicional.set(data.info);
    }
    this.isLoading.set(false);
  }

  toggleMode() {
    if (this.mode() === 'read') {
      this.mode.set('edit');
    } else {
      this.mode.set('read');
    }
  }

  get isAlumne(): boolean {
    return this.user()?.rol === 'Alumne';
  }

  get isProfeOrAdmin(): boolean {
    const rol = this.user()?.rol;
    return rol === 'Profe' || rol === 'Admin';
  }

  get mostarRueda(): boolean {
    const userLogueado = this.currentUser();
    if (!userLogueado) return false;
    
    return userLogueado.rol === 'Profe' || userLogueado.rol === 'Admin';
  }
}
