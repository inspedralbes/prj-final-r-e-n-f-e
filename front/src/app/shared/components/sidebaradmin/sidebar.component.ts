import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
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
}
