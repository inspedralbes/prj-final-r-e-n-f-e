import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule } from '@ng-icons/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { JustificantsManagerService } from '../../../shared/services/justificants/justificants-manager.service';
import { Justificant, JustificantNet } from '../../../shared/models/justificants.model';
import { Usuari } from '../../../shared/models/usuaris.model';

@Component({
  selector: 'app-justificants',
  imports: [CommonModule, SidebarComponent, NgIconsModule],
  templateUrl: './justificants.component.html',
  styleUrl: './justificants.component.css',
})
export class JustificantsComponents implements OnInit {
  private justificantManager = inject(JustificantsManagerService);

  justificantsPendents = this.justificantManager.justificantsTutoria;
  isLoading = this.justificantManager.isLoading;
  alumneExpandit = signal<number | null>(null);
  modalObert = signal(false);
  justificantSeleccionat = signal<Justificant | null>(null);
  documentUrl = signal<string | null>(null);

  ngOnInit() {
    this.justificantManager.carregarJustificantsTutoria();
  }

  toggleAlumne(id: number | undefined) {
    if (id === undefined) return;
    this.alumneExpandit.set(this.alumneExpandit() === id ? null : id);
  }

  obtenirInicials(alumne: Partial<Usuari> | undefined | null): string {
    if (!alumne) return '?';
    const nom = alumne.nom?.[0] || '';
    const cognom = alumne.cognom?.[0] || '';
    return (nom + cognom).toUpperCase() || '?';
  }

  comptarEstat(justificants: Partial<Justificant>[], estat: string): number {
    if (!justificants) return 0;
    return justificants.filter((justificant) => {
      return justificant.estat == estat;
    }).length;
  }

  formatarData(data: string): string {
    if (!data) return '-';
    const date = new Date(data);
    return date.toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  obrirModal(justificant: Justificant, event: Event) {
    event.stopPropagation();
    this.justificantSeleccionat.set(justificant);

    if (justificant.document instanceof Blob) {
      const url = URL.createObjectURL(justificant.document);
      this.documentUrl.set(url);
    } else {
      this.documentUrl.set(null);
    }

    this.modalObert.set(true);
  }

  tancarModal() {
    if (this.documentUrl()) {
      URL.revokeObjectURL(this.documentUrl()!);
      this.documentUrl.set(null);
    }
    this.modalObert.set(false);
    this.justificantSeleccionat.set(null);
  }

  async acceptarJustificant(id: number) {
    try {
      await this.justificantManager.acceptarJustificant(id, true);
      this.tancarModal();
    } catch (error) {
      console.error('Error acceptant justificant:', error);
      alert('Error en acceptar el justificant.');
    }
  }

  async declinarJustificant(id: number) {
    try {
      await this.justificantManager.acceptarJustificant(id, false);
      this.tancarModal();
    } catch (error) {
      console.error('Error declinant justificant:', error);
      alert('Error en declinar el justificant.');
    }
  }
}
