import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { PerfilService } from '../../../services/perfil/perfil.service';
import { AuthService } from '../../../../services/auth.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroHome, heroCalendarDays, heroDocumentCheck, heroUserCircle, heroArrowLeftOnRectangle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'alumne-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIconComponent],
  templateUrl: './sidebarAlumne.component.html',
  styleUrl: '../sidebar.component.css',
  viewProviders: [provideIcons({ heroHome, heroCalendarDays, heroDocumentCheck, heroUserCircle, heroArrowLeftOnRectangle })],
})
export class SidebarAlumneComponent {
  public sidebarService = inject(SidebarService);
  private perfilService = inject(PerfilService);
  private authService = inject(AuthService);

  isMenuOpen = signal(false);
  userPhoto = signal<string | null>(null);

  constructor() {
    this.loadUserPhoto();
  }
 
  toggleMenu() {
    this.isMenuOpen.update(v => !v);
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

  logout() {
    this.authService.logout();
  }
}
