import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { JustificantsManagerService } from '../../../shared/services/justificants/justificants-manager.service';

@Component({
  selector: 'app-justificants',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './justificants.component.html',
  styleUrl: './justificants.component.css',
})
export class JustificantsComponents implements OnInit {
  private justificantManager = inject(JustificantsManagerService);

  justificantsPendents = signal(this.justificantManager.justificantsTutoria());

  ngOnInit() {
    this.justificantManager.carregarJustificantsTutoria();
  }
}
