import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuari = signal<string>('');
  error = signal<string>('');

  constructor(private router: Router, private authService: AuthService) { }

  async iniciarSessio() {
    const camp = this.usuari().trim();

    if (!camp) {
      this.error.set("Introdueix un nom o correu.");
      return;
    }

    // Netejem errors anteriors
    this.error.set('');

    // Fem la crida a l'AuthService
    const loginReeixit = await this.authService.login(camp);

    if (loginReeixit) {
      // Obtenim l'usuari guardat i el seu rol
      const loggedUser = this.authService.currentUser();
      const rol = loggedUser?.rol.toLowerCase();

      // Naveguem segons el rol de la BD
      if (rol === 'alumne') {
        this.router.navigate(['/alumnes']);
      } else if (rol === 'profe') {
        this.router.navigate(['/professors']);
      } else if (rol === 'admin') {
        this.router.navigate(['/administracio']);
      } else {
        this.error.set("Rol d'usuari no reconegut: " + rol);
      }
    } else {
      this.error.set("Usuari no trobat a la base de dades.");
    }
  }
}
