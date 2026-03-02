import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UsuariService } from '../services/usuari.service';

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
    private usuariService: UsuariService, 
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.esEdicio = true;
      this.idUsuariActual = Number(idParam);
      
      this.usuariService.getUsuari(this.idUsuariActual).subscribe({
        next: (dades) => {
          const usuariRecuperat = dades.data || dades;
          this.usuari = usuariRecuperat;
          this.usuari.password = '';
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar usuari', err)
      });
    }
  }

  guardarUsuari() {
    this.erroresServidor = [];

    if (this.esEdicio && this.idUsuariActual) {
      this.usuariService.actualitzarUsuari(this.idUsuariActual, this.usuari).subscribe({
        next: () => {
          alert('Usuari actualitzat!');
          this.router.navigate(['/administracio/gestio-usuaris']);
        },
        error: this.gestionarError.bind(this)
      });
    } else {
      this.usuariService.crearUsuari(this.usuari).subscribe({
        next: () => {
          alert('Usuari creat!');
          this.router.navigate(['/administracio/gestio-usuaris']); 
        },
        error: this.gestionarError.bind(this)
      });
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