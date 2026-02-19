import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-llista-classe',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './llista-classe.component.html',
  styleUrl: './llista-classe.component.css',
})
export class LlistaClasseComponent {}
