import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroHome, heroCalendarDays, heroDocumentCheck, heroUserCircle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'alumne-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIconComponent],
  templateUrl: './sidebarAlumne.component.html',
  styleUrl: '../sidebar.component.css',
  viewProviders: [provideIcons({ heroHome, heroCalendarDays, heroDocumentCheck, heroUserCircle })],
})
export class SidebarAlumneComponent {
  public sidebarService = inject(SidebarService);
}
