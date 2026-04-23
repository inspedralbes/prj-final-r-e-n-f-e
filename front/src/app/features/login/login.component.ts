import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  usuari = signal<string>('');
  error = signal<string>('');
  isLoading = signal<boolean>(false);

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  loginGoogle() {
    this.authService.loginWithGoogle();
  }

  iniciarSessio() {
    if (this.isLoading()) return;
    const email = this.usuari().toLowerCase().trim();

    if (!email.includes('@')) {
      // Suport temporal per a paraules clau si l'usuari no escriu un email
      if (email === 'alumne') { this.router.navigate(['/alumnes']); return; }
      if (email === 'professor') { this.router.navigate(['/professors']); return; }
      if (email === 'admin') { this.router.navigate(['/administracio']); return; }

      this.error.set("Introdueix un email vàlid de la base de dades.");
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    this.authService.loginTemporal(email).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.authService.guardarSessio(response.data);
          // Opcional: no quitamos isLoading aqui porque en teoría se navega a otra pantalla altiro
        } else {
          this.isLoading.set(false);
        }
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.error.set("Usuari no trobat a la base de dades.");
      }
    });
  }
}
