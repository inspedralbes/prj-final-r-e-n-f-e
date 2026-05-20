import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarAdminComponent } from '../../../shared/components/sidebaradmin/sidebar.component';
import { PeriodesManagerService, Periode } from '../../../shared/services/periodes/periodes-manager.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash, heroStar, heroPlus, heroCalendar } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-admin-periodes',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarAdminComponent, NgIconComponent],
  providers: [provideIcons({ heroPencilSquare, heroTrash, heroStar, heroPlus, heroCalendar })],
  templateUrl: './admin-periodes.component.html',
  styleUrls: ['./admin-periodes.component.css']
})
export class AdminPeriodesComponent implements OnInit {
  private periodesManager = inject(PeriodesManagerService);

  public periodes = this.periodesManager.periodes;
  public isLoading = this.periodesManager.isLoading;

  public isModalOpen = false;
  public isEditing = false;
  public periodeActual: Partial<Periode> = {};
  public isSaving = signal<boolean>(false);

  ngOnInit() {
    this.periodesManager.carregarPeriodes();
  }

  obrirModal(periode?: Periode) {
    if (periode) {
      this.isEditing = true;
      this.periodeActual = {
        id: periode.id,
        nom: periode.nom,
        actiu: periode.actiu,
        trimestre_1_ini: this.formatarDataInput(periode.trimestre_1_ini),
        trimestre_1_fi: this.formatarDataInput(periode.trimestre_1_fi),
        trimestre_2_ini: this.formatarDataInput(periode.trimestre_2_ini),
        trimestre_2_fi: this.formatarDataInput(periode.trimestre_2_fi),
        trimestre_3_ini: this.formatarDataInput(periode.trimestre_3_ini),
        trimestre_3_fi: this.formatarDataInput(periode.trimestre_3_fi)
      };
    } else {
      // En aquest cas, no esperem crear nous períodes, només editar els existents
      this.isEditing = false;
      this.periodeActual = {};
    }
    this.isModalOpen = true;
  }

  tancarModal() {
    this.isModalOpen = false;
    this.periodeActual = {};
  }

  guardarPeriode() {
    this.isSaving.set(true);
    if (this.isEditing && this.periodeActual.id) {
      this.periodesManager.actualitzarPeriode(this.periodeActual.id, this.periodeActual)
        .then(() => {
          this.tancarModal();
        })
        .catch(err => console.error('Error actualitzant periode:', err))
        .finally(() => this.isSaving.set(false));
    } else {
      this.periodesManager.crearPeriode(this.periodeActual)
        .then(() => {
          this.tancarModal();
        })
        .catch(err => console.error('Error creant periode:', err))
        .finally(() => this.isSaving.set(false));
    }
  }

  esborrarPeriode(id: number) {
    if (confirm('Estàs segur de voler eliminar aquest període?')) {
      this.periodesManager.esborrarPeriode(id)
        .catch(err => console.error('Error eliminant periode:', err));
    }
  }

  establirActiu(id: number) {
    if (confirm('Estàs segur de voler establir aquest com a període actual?')) {
      this.periodesManager.establirActiu(id)
        .catch(err => console.error('Error establint periode actiu:', err));
    }
  }

  // Converteix '2025-09-12T00:00:00.000000Z' → '12/09/2025'
  formatarData(dataIso: string | null | undefined): string {
    if (!dataIso) return '—';
    const data = new Date(dataIso);
    if (isNaN(data.getTime())) return dataIso;
    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    const any = data.getUTCFullYear();
    return `${dia}/${mes}/${any}`;
  }

  // Converteix '2025-09-12T00:00:00.000000Z' → '2025-09-12'
  formatarDataInput(dataIso: string | null | undefined): string {
    if (!dataIso) return '';
    const date = new Date(dataIso);
    if (isNaN(date.getTime())) return '';
    const dia = String(date.getUTCDate()).padStart(2, '0');
    const mes = String(date.getUTCMonth() + 1).padStart(2, '0');
    const any = date.getUTCFullYear();
    return `${any}-${mes}-${dia}`;
  }
}
