import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { PerfilService } from '../../services/perfil/perfil.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroHome, heroBookOpen, heroUsers, heroCalendarDays, heroAcademicCap, heroUserCircle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-sidebaradmin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIconComponent],
  providers: [provideIcons({ heroHome, heroBookOpen, heroUsers, heroCalendarDays, heroAcademicCap, heroUserCircle })],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarAdminComponent {
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
