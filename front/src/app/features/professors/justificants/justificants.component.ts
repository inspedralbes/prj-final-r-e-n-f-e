import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { heroChevronDown, heroEye, heroCheck, heroXMark, heroClipboardDocumentList, heroDocumentText } from '@ng-icons/heroicons/outline';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { JustificantsManagerService } from '../../../shared/services/justificants/justificants-manager.service';
import { Justificant, JustificantNet } from '../../../shared/models/justificants.model';
import { Usuari } from '../../../shared/models/usuaris.model';

@Component({
  selector: 'app-justificants',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NgIconsModule],
  providers: [provideIcons({ heroChevronDown, heroEye, heroCheck, heroXMark, heroClipboardDocumentList, heroDocumentText })],
  templateUrl: './justificants.component.html',
  styleUrl: './justificants.component.css',
})
export class JustificantsComponents implements OnInit {
  private justificantManager = inject(JustificantsManagerService);
  private sanitizer = inject(DomSanitizer);

  justificantsPendents = this.justificantManager.justificantsTutoria;
  isLoading = this.justificantManager.isLoading;
  alumneExpandit = signal<number | null>(null);
  modalObert = signal(false);
  justificantSeleccionat = signal<Justificant | null>(null);
  alumneSeleccionat = signal<Partial<Usuari> | null>(null);
  documentUrl = signal<string | null>(null);
  isProcessing = signal(false);
  mostrarSoloPendents = signal(false);
  filteredJustificants = computed(() => {
    const justificantList = this.justificantsPendents();
    if (!this.mostrarSoloPendents()) {
      return justificantList;
    }
    return justificantList
      .map(caseAlumne => ({
        ...caseAlumne,
        justificants: caseAlumne.justificants.filter(j => j.estat === 'Pendent')
      }))
      .filter(caseAlumne => caseAlumne.justificants.length > 0);
  });

  isPdf(url: string | null): boolean {
    if (!url) return false;
    if (url.startsWith('data:')) {
      return url.includes('application/pdf');
    }
    return url.toLowerCase().endsWith('.pdf');
  }

  getDocumentSrc(path: string | null): SafeResourceUrl | null {
    if (!path) return null;
    if (path.startsWith('data:')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(path);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:8000/back/${path}`);
  }

  getDocumentUrl(path: string | null): string {
    if (!path) return '';
    if (path.startsWith('data:')) {
      return path;
    }
    return `http://localhost:8000/back/${path}`;
  }

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

  obrirModal(justificant: Justificant, alumne: Partial<Usuari>, event: Event) {
    event.stopPropagation();
    this.justificantSeleccionat.set(justificant);
    this.alumneSeleccionat.set(alumne);
    this.documentUrl.set(justificant.document);
    this.modalObert.set(true);
  }

  tancarModal() {
    this.modalObert.set(false);
    this.justificantSeleccionat.set(null);
    this.alumneSeleccionat.set(null);
    this.documentUrl.set(null);
  }

  async acceptarJustificant(id: number) {
    if (this.isProcessing()) return;
    this.isProcessing.set(true);
    try {
      await this.justificantManager.acceptarJustificant(id, true);
      this.tancarModal();
    } catch (error) {
      console.error('Error acceptant justificant:', error);
      alert('Error en acceptar el justificant.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  async declinarJustificant(id: number) {
    if (this.isProcessing()) return;
    this.isProcessing.set(true);
    try {
      await this.justificantManager.acceptarJustificant(id, false);
      this.tancarModal();
    } catch (error) {
      console.error('Error declinant justificant:', error);
      alert('Error en declinar el justificant.');
    } finally {
      this.isProcessing.set(false);
    }
  }
}
