import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { PerfilService } from '../../../services/perfil/perfil.service';

@Component({
  selector: 'alumne-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebarAlumne.component.html',
  styleUrl: '../sidebar.component.css',
})
export class SidebarAlumneComponent {
  public sidebarService = inject(SidebarService);
  private perfilService = inject(PerfilService);

  userPhoto = signal<string | null>(null);

  constructor() {
    this.loadUserPhoto();
  }

  private async loadUserPhoto() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.id) {
        const perfil = await this.perfilService.getPerfil(String(user.id));
        if (perfil?.data?.user?.photo) {
          this.userPhoto.set(perfil.data.user.photo);
        }
      }
    }
  }
}
