import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../../services/auth.service';
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
export class SidebarComponent {
  public sidebarService = inject(SidebarService);
  private authService = inject(AuthService);
  public esTutor = true;
  
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }
}
