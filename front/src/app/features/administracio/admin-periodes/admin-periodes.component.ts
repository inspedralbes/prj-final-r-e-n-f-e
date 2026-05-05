import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarAdminComponent } from '../../../shared/components/sidebaradmin/sidebar.component';
import { PeriodesManagerService, Periode } from '../../../shared/services/periodes/periodes-manager.service';

@Component({
  selector: 'app-admin-periodes',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarAdminComponent],
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
        trimestre_1_ini: periode.trimestre_1_ini,
        trimestre_1_fi: periode.trimestre_1_fi,
        trimestre_2_ini: periode.trimestre_2_ini,
        trimestre_2_fi: periode.trimestre_2_fi,
        trimestre_3_ini: periode.trimestre_3_ini,
        trimestre_3_fi: periode.trimestre_3_fi
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
    if (this.isEditing && this.periodeActual.id) {
      this.periodesManager.actualitzarPeriode(this.periodeActual.id, this.periodeActual)
        .then(() => {
          this.tancarModal();
        })
        .catch(err => console.error('Error actualitzant periode:', err));
    } else {
      this.periodesManager.crearPeriode(this.periodeActual)
        .then(() => {
          this.tancarModal();
        })
        .catch(err => console.error('Error creant periode:', err));
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
}
