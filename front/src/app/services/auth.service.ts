import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface GoogleUser {
  user: {
    id: number;
    nom: string;
    email: string;
    rol: string;
  };
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticatedSignal = signal(false);
  private userDataSignal = signal<GoogleUser | null>(null);

  public isAuthenticated = computed(() => this.isAuthenticatedSignal());
  public userData = computed(() => this.userDataSignal());

  private apiUrl = environment.backendUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.verificarToken();
  }

  private verificarToken() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const token = localStorage.getItem('token') ?? undefined;
      this.userDataSignal.set({ user, token });
      this.isAuthenticatedSignal.set(true);
    }
  }

  /**
   * Obtenir URL de redirecció de Google des del backend
   */
  loginWithGoogle() {
    this.http
      .post<{ success: boolean; redirect_url: string }>(`${this.apiUrl}/auth/google/redirect`, {})
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Redirige al usuario a Google
            window.location.href = response.redirect_url;
          }
        },
        error: (error) => {
          console.error('Error obteniendo URL de Google:', error);
        },
      });
  }

  /**
   * Treballar amb el callback (se llama desde auth-callback.component)
   */
  handleGoogleCallback(code: string) {
    this.http
      .post<{ success: boolean; data: GoogleUser }>(`${this.apiUrl}/auth/google/callback`, { code })
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Guardar datos del usuario
            const userData = response.data;
            localStorage.setItem('user', JSON.stringify(userData.user));
            if (userData.token) {
              localStorage.setItem('token', userData.token);
            }

            this.userDataSignal.set(userData);
            this.isAuthenticatedSignal.set(true);

            // Redirigir según el rol
            this.redirectByRole(userData.user.rol);
          }
        },
        error: (error) => {
          console.error('Error en callback de Google:', error);
          this.router.navigate(['/']);
        },
      });
  }

  /**
   * Login temporal amb email (per a proves)
   */
  loginTemporal(email: string) {
    return this.http.post<{ success: boolean; data: any }>(`${this.apiUrl}/auth/login-temporal`, {
      email,
    });
  }

  guardarSessio(data: any) {
    // data conté { user: {...}, token, rol }
    localStorage.setItem('user', JSON.stringify(data.user));
    // També guardem el camp 'usuari' per compatibilitat amb components que busquen 'usuari' en lloc de 'user'
    localStorage.setItem('usuari', JSON.stringify(data.user));

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    this.userDataSignal.set(data);
    this.isAuthenticatedSignal.set(true);
    this.redirectByRole(data.user.rol);
  }

  private redirectByRole(rol: string) {
    switch (rol?.toLowerCase()) {
      case 'profe':
        this.router.navigate(['/professors']);
        break;
      case 'alumne':
        this.router.navigate(['/alumnes']);
        break;
      case 'admin':
        this.router.navigate(['/administracio']);
        break;
      default:
        this.router.navigate(['/alumnes']);
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.userDataSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/']);
  }

  get usuarioInfo() {
    return this.userDataSignal()?.user;
  }

  get token() {
    return this.userDataSignal()?.token;
  }
}
