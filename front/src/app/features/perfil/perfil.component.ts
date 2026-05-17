import { Component, inject, signal, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService, InfoAdicional } from '../../shared/services/perfil/perfil.service';
import { AuthService } from '../../services/auth.service';
import { Usuari } from '../../shared/models/usuaris.model';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AlumnesComponent } from '../alumnes/alumnes.component';
import { SidebarAlumneComponent } from '../../shared/components/sidebar/alumnes/sidebarAlumne.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCog8Tooth, heroXMark, heroArrowLeftOnRectangle } from '@ng-icons/heroicons/outline';
import { SidebarAdminComponent } from '../../shared/components/sidebaradmin/sidebar.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    SidebarAlumneComponent,
    SidebarAdminComponent,
    NgIconComponent,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
  viewProviders: [provideIcons({ heroCog8Tooth, heroXMark, heroArrowLeftOnRectangle })],
})
export class PerfilComponent implements OnInit {
  private perfilService = inject(PerfilService);
  private authService = inject(AuthService);

  @Input() id?: string;

  currentUser = signal<Usuari | null>(null);
  user = signal<Usuari | null>(null);
  infoAdicional = signal<InfoAdicional | null>(null);
  mode = signal<'read' | 'edit'>('read');
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);

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

  async onSubmit() {
    const targetUser = this.user();
    if (!targetUser) return;

    this.isSaving.set(true);
    const perfilId = this.id || targetUser.id;
    const trySubmit = await this.perfilService.updatePerfil(perfilId, this.editedData());
    this.isSaving.set(false);

    if (trySubmit) {
      this.mode.set('read');
      window.location.reload();
    }
  }

  toggleMode() {
    if (this.mode() === 'read') {
      const u = this.user();
      if (u) {
        this.editedData.set({
          nom: u.nom,
          cognom: u.cognom,
          email_pares: u.email_pares ?? undefined,
          data_naixement: u.data_naixement ?? undefined,
        });
      }
      this.mode.set('edit');
    } else {
      this.mode.set('read');
    }
  }

  get isAlumne(): boolean {
    return this.user()?.rol === 'Alumne';
  }

  get isProfe(): boolean {
    const rol = this.currentUser()?.rol;
    return rol === 'Profe';
  }

  get isAdmin(): boolean {
    return this.currentUser()?.rol === 'Admin';
  }

  get mostarRueda(): boolean {
    const userLogueado = this.currentUser();
    if (!userLogueado) return false;

    return userLogueado.rol === 'Profe' || userLogueado.rol === 'Admin';
  }

  logout() {
    this.authService.logout();
  }
}
