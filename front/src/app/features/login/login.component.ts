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
  isGoogleLoading = signal<boolean>(false);

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  loginGoogle() {
    if (this.isLoading() || this.isGoogleLoading()) return;
    this.isGoogleLoading.set(true);
    this.authService.loginWithGoogle();
  }
}
