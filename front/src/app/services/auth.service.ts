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
    isProfileComplited: boolean;
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
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        this.userDataSignal.set({ user, token });
        this.isAuthenticatedSignal.set(true);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        this.logout();
      }
    } else {
      // Si falta un dels dos, netegem per seguretat
      this.isAuthenticatedSignal.set(false);
      this.userDataSignal.set(null);
    }
  }

  loginWithGoogle() {
    this.http
      .post<{ success: boolean; redirect_url: string }>(`${this.apiUrl}/auth/google/redirect`, {})
      .subscribe({
        next: (response) => {
          if (response.success) {
            window.location.href = response.redirect_url;
          }
        },
        error: (error) => {
          console.error('Error obtaining URL from Google:', error);
        },
      });
  }

  handleGoogleCallback(code: string) {
    this.http
      .post<{ success: boolean; data: GoogleUser }>(`${this.apiUrl}/auth/google/callback`, { code })
      .subscribe({
        next: (response) => {
          if (response.success) {
            const userData = response.data;
            localStorage.setItem('user', JSON.stringify(userData.user));
            if (userData.token) {
              localStorage.setItem('token', userData.token);
            }

            this.userDataSignal.set(userData);
            this.isAuthenticatedSignal.set(true);

            const perfilComplet = userData.user?.isProfileComplited;
            if (!perfilComplet && userData.user?.rol?.toLowerCase() === 'alumne') {
              this.router.navigate(['/completar-perfil']);
            } else {
              this.redirectByRole(userData.user.rol);
            }
          }
        },
        error: (error) => {
          console.error('Error in Google callback:', error);
          this.router.navigate(['/']);
        },
      });
  }

  loginTemporal(email: string) {
    return this.http.post<{ success: boolean; data: any }>(`${this.apiUrl}/auth/login-temporal`, {
      email,
    });
  }

  guardarSessio(data: any) {
    const user = data.user;
    const token = data.token;

    localStorage.setItem('user', JSON.stringify(user));
    // Eliminem 'usuari' si existia d'abans per unificar a 'user'
    localStorage.removeItem('usuari');

    if (token) {
      localStorage.setItem('token', token);
    }

    this.userDataSignal.set({ user, token });
    this.isAuthenticatedSignal.set(true);
    this.redirectByRole(user.rol);
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
    // Crida al backend (opcional, no bloquegem el front si falla)
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
      next: () => console.log('Backend logout success'),
      error: (err) => console.error('Backend logout error:', err)
    });

    // Neteja de local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('usuari'); // Per si de cas

    // Reset de signals
    this.userDataSignal.set(null);
    this.isAuthenticatedSignal.set(false);

    // Redirecció
    this.router.navigate(['/']);
  }

  get usuarioInfo() {
    return this.userDataSignal()?.user;
  }

  get token() {
    return this.userDataSignal()?.token;
  }
}
