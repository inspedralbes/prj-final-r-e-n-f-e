import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'alumne-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebarAlumne.component.html',
  styleUrl: '../sidebar.component.css',
})
export class SidebarAlumneComponent {
  public sidebarService = inject(SidebarService);
}
