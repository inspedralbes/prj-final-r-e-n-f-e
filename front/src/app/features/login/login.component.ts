import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  usuari = signal<string>('');
  error = signal<string>('');

  constructor(private router: Router) {}

  iniciarSessio() {
    const tipus = this.usuari().toLowerCase().trim();

    if (tipus === 'alumne') {
      this.router.navigate(['/alumnes']);
    } else if (tipus === 'professor') {
      this.router.navigate(['/professors']);
    } else if (tipus === 'admin') {
      this.router.navigate(['/administracio']);
    } else {
      this.error.set("Usuari no vàlid. Prova 'alumne', 'professor' o 'admin'.");
    }
  }
}
