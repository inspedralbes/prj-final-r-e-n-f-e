import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBookOpen, heroAcademicCap, heroClipboardDocumentList, heroHome, heroClock, heroCalendarDays, heroUserCircle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIconComponent],
  providers: [provideIcons({ heroBookOpen, heroAcademicCap, heroClipboardDocumentList, heroHome, heroClock, heroCalendarDays, heroUserCircle })],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  public sidebarService = inject(SidebarService);
  public esTutor = true;
}
