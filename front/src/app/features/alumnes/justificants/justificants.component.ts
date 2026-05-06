import { Component, inject, OnInit, signal } from '@angular/core';
import { SidebarAlumneComponent } from '../../../shared/components/sidebar/alumnes/sidebarAlumne.component';
import { JustificantsManagerService } from '../../../shared/services/justificants/justificants-manager.service';
import { AuthService } from '../../../services/auth.service';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-justificants',
  standalone: true,
  imports: [SidebarAlumneComponent, DatePipe, CommonModule],
  templateUrl: './justificants.component.html',
  styleUrl: './justificants.component.css',
})
export class JustificantsComponent implements OnInit {
  justificantsManager = inject(JustificantsManagerService);
  authService = inject(AuthService);

  justificants = this.justificantsManager.justificants;
  isLoading = this.justificantsManager.isLoading;
  showModal = signal(false);
  selectedFile: File | null = null;

  ngOnInit(): void {
    const idAlumne = this.authService.usuarioInfo?.id;
    if (idAlumne) {
      this.justificantsManager.carregarJustificantsPerAlumne(idAlumne);
    }
  }

  openJustificacioModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  private obtenirValorText(formData: FormData, camp: string): string {
    const valor = formData.get(camp);
    return typeof valor === 'string' ? valor : '';
  }

  async enviarJustificant(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const nouJustificant = {
      id_alum: Number(this.authService.usuarioInfo?.id),
      fecha_inici: this.obtenirValorText(formData, 'fecha_inici'),
      fecha_fi: this.obtenirValorText(formData, 'fecha_fi'),
      comentari: this.obtenirValorText(formData, 'comentari'),
      estat: 'Pendent' as const,
    };

    try {
      await this.justificantsManager.afegirJustificant(nouJustificant, this.selectedFile);

      alert('Justificant enviat correctament');
      this.closeModal();
    } catch (error) {
      console.error('Error enviant justificant:', error);
      alert('Error en enviar el justificant.');
    }
  }
}
