import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../../services/auth.service';
import { ClassesManagerService } from '../../services/classes/classes-manager.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBookOpen, heroAcademicCap, heroClipboardDocumentList, heroHome, heroClock, heroCalendarDays, heroUserCircle, heroDocumentText, heroArrowLeftOnRectangle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIconComponent],
  providers: [provideIcons({ heroBookOpen, heroAcademicCap, heroClipboardDocumentList, heroHome, heroClock, heroCalendarDays, heroUserCircle, heroDocumentText, heroArrowLeftOnRectangle })],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  public sidebarService = inject(SidebarService);
  private authService = inject(AuthService);
  private classesManager = inject(ClassesManagerService);
  
  public esTutor = computed(() => {
    const user = this.authService.usuarioInfo;
    if (user?.rol === 'Admin') return true;
    
    // Si és null (encara no s'ha carregat), per defecte mostrem fals per seguretat, 
    // però ja estarà guardat al service per a la següent navegació.
    return this.sidebarService.isTutor() === true;
  });
  
  isMenuOpen = signal(false);

  async ngOnInit() {
    const user = this.authService.usuarioInfo;
    
    // Si ja sabem si és tutor, no tornem a fer la petició
    if (this.sidebarService.isTutor() !== null) return;

    if (user?.rol === 'Profe' && user.id) {
      try {
        const classe = await this.classesManager.obtenirClasseTutor(user.id);
        this.sidebarService.setTutorStatus(!!classe);
      } catch (err) {
        this.sidebarService.setTutorStatus(false);
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }
}
