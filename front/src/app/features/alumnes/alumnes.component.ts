import { Component, inject, OnInit, signal } from '@angular/core';
import { InscritsManagerService } from '../../shared/services/inscrits/inscrits-manager.service';
import { AuthService } from '../../services/auth.service';
import { SidebarAlumneComponent } from '../../shared/components/sidebar/alumnes/sidebarAlumne.component'; 
import { SocketService } from '../../services/socket.service';

export interface assistenciaPerUsuari {
  nom_assignatura: { nom: string }[];
  retards: number;
  faltes: number;
  justificades: number;
  percentatge: number;
}

@Component({
  selector: 'app-alumnes',
  imports: [SidebarAlumneComponent],
  templateUrl: './alumnes.component.html',
  styleUrl: './alumnes.component.css',
})
export class AlumnesComponent implements OnInit {
  inscritsManager = inject(InscritsManagerService);
  authService = inject(AuthService);
  socketService = inject(SocketService);

  indexActual = signal(0);
  showDespegable = signal(false);
  inscritsPerUsuari = this.inscritsManager.inscritsPerUsuari;
  isLoading = this.inscritsManager.isLoading;

  setIndex(index: number) {
    this.indexActual.set(index);
  }

  showAssignaturas() {
    this.showDespegable.set(!this.showDespegable());
  }

  ngOnInit(): void {
    const idAlumne = String(this.authService.usuarioInfo?.id);
    this.inscritsManager.carregarInscritAlumne(idAlumne);

    this.socketService.listenToEvent('assistencia_updated').subscribe(() => {
      console.log('[SOCKET] assistencia_updated rebut, recarregant dades...');
      this.inscritsManager.carregarInscritAlumne(idAlumne);
    });
  }
}
