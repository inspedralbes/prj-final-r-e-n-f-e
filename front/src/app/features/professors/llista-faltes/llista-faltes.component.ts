import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroDocumentText,
  heroUser,
  heroAcademicCap,
  heroUserGroup,
  heroIdentification,
} from '@ng-icons/heroicons/outline';
import { AssistenciesManagerService } from '../../../shared/services/assistencies/assistencies-manager.service';
import { ClassesManagerService } from '../../../shared/services/classes/classes-manager.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Inscrit } from '../../../shared/models/inscrits.model';

@Component({
  selector: 'app-llista-faltes',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NgIconComponent],
  providers: [
    provideIcons({
      heroDocumentText,
      heroUser,
      heroAcademicCap,
      heroUserGroup,
      heroIdentification,
    }),
  ],
  templateUrl: './llista-faltes.component.html',
  styleUrl: './llista-faltes.component.css',
})
export class LlistaFaltesComponent implements OnInit {
  private assistenciesManager = inject(AssistenciesManagerService);
  private classesManager = inject(ClassesManagerService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estats reactius
  isTutor = signal<boolean>(false);
  modeTutor = signal<boolean>(false);

  // Rànquings separats
  professorRanking = signal<any[]>([]);
  tutorRanking = signal<any[]>([]);

  showThresholdPopup = signal<boolean>(false);

  private selectedAlumneId: number | null = null;
  private idClasseTutor: number | null = null;

  get isLoading() {
    return this.assistenciesManager.isLoading();
  }

  async ngOnInit() {
    // 1. Carregar rànquing de professor (optimitzat)
    this.carregarRankingProfessor();

    // 2. Comprovar si l'usuari és tutor
    const user = this.authService.usuarioInfo;
    if (user && user.id) {
      try {
        const classe = await this.classesManager.obtenirClasseTutor(user.id);
        if (classe) {
          this.isTutor.set(true);
          this.idClasseTutor = classe.id;
        }
      } catch (error) {
        console.error('Error comprovant estat de tutor:', error);
      }
    }
  }

  async carregarRankingProfessor() {
    try {
      const data = await this.assistenciesManager.getRankingProfessor();
      this.professorRanking.set(data || []);
    } catch (error) {
      console.error('Error carregant rànquing de professor:', error);
    }
  }

  toggleModeTutor() {
    this.modeTutor.update((v) => !v);
    if (this.modeTutor() && this.idClasseTutor) {
      this.carregarRankingTutor();
    } else {
      this.carregarRankingProfessor();
    }
  }

  async carregarRankingTutor() {
    if (!this.idClasseTutor) return;
    try {
      const ranking = await this.assistenciesManager.getRankingClasse(this.idClasseTutor);
      this.tutorRanking.set(ranking || []);
    } catch (error) {
      console.error('Error carregant rànquing de tutor:', error);
    }
  }

  // Redirecció a la ruta de generació de cartes
  anarAGenerarCarta(idAlumne: number) {
    this.router.navigate(['/generar-carta', idAlumne]);
  }

  anarAPerfil(idAlumne: number) {
    this.router.navigate(['/profile', idAlumne]);
  }

  openThresholdPopup(idAlumne: number) {
    this.selectedAlumneId = idAlumne;
    this.showThresholdPopup.set(true);
  }

  closeThresholdPopup() {
    this.showThresholdPopup.set(false);
    this.selectedAlumneId = null;
  }

  async confirmGenerarInforme(threshold: number) {
    if (!this.selectedAlumneId) return;

    try {
      const pdfBlob = await this.assistenciesManager.generarInformeFaltes(
        this.selectedAlumneId,
        threshold,
      );

      const url = globalThis.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `carta_faltes_${threshold}_${this.selectedAlumneId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      globalThis.URL.revokeObjectURL(url);

      this.closeThresholdPopup();
    } catch (error) {
      console.error('Error al generar informe de faltes:', error);
    }
  }

  // Ara fem servir directament el rànquing que ve del backend
  assitenciesRanking = computed(() => {
    return this.professorRanking().map((item) => ({
      nomAlumne: `${item.nomAlumne} ${item.cognomAlumne}`.trim(),
      nomAssignatura: item.nomAssignatura,
      totalFaltes: item.totalFaltes,
    }));
  });
}
