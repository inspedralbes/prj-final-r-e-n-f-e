import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UsuarisManagerService } from '../../../shared/services/usuaris/usuaris-manager.service';

@Component({
  selector: 'app-crear-usuari',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-usuari.component.html',
  styleUrls: ['./crear-usuari.component.css']
})
export class CrearUsuariComponent implements OnInit {
  
  usuari = {
    nom: '', cognom: '', rol: '', email: '', 
    email_pares: '', password: '', nfc_id: '', horari_guardies: ''
  };

  erroresServidor: string[] = [];
  esEdicio: boolean = false; 
  idUsuariActual: number | null = null;

  constructor(
    private usuariService: UsuarisManagerService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    if (id !== null && !isNaN(id)) {
      this.esEdicio = true;
      this.idUsuariActual = id;
      try {
        await this.usuariService.carregarUsuaris();
        const usuariRecuperat = this.usuariService.usuaris().find(u => u.id === id);
        if (usuariRecuperat) {
          this.usuari = {
            nom: usuariRecuperat.nom || '',
            cognom: usuariRecuperat.cognom || '',
            rol: usuariRecuperat.rol || '',
            email: usuariRecuperat.email || '',
            email_pares: usuariRecuperat.email_pares || '',
            password: '',
            nfc_id: usuariRecuperat.nfc_id || '',
            horari_guardies: usuariRecuperat.horari_guardies || ''
          };
        }
        this.cdr.detectChanges();
      } catch (err) {
        console.error('Error al cargar usuari', err);
      }
    }
  }

  async guardarUsuari() {
    this.erroresServidor = [];
    try {
      if (this.esEdicio && this.idUsuariActual) {
        await this.usuariService.actualitzarUsuari(this.idUsuariActual, this.usuari);
        alert('Usuari actualitzat!');
        this.router.navigate(['/administracio/gestio-usuaris']);
      } else {
        await this.usuariService.afegirUsuari(this.usuari);
        alert('Usuari creat!');
        this.router.navigate(['/administracio/gestio-usuaris']);
      }
    } catch (err) {
      this.gestionarError(err);
    }
  }

  gestionarError(err: any) {
    if (err.status === 422 && err.error.errors) {
      this.erroresServidor = Object.values(err.error.errors).flat() as string[];
    } else {
      this.erroresServidor = ['Hi ha hagut un error inesperat.'];
    }
  }
}