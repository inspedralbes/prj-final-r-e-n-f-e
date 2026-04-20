import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <img src="/loading.gif" alt="loading">
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Extraer el código de los query params
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const error = params['error'];

      if (error) {
        console.error('Error de Google:', error);
        this.router.navigate(['/']);
        return;
      }

      if (code) {
        // Enviar el código al backend
        this.authService.handleGoogleCallback(code);
      } else {
        console.error('No se recibió código de Google');
        this.router.navigate(['/']);
      }
    });
  }
}
