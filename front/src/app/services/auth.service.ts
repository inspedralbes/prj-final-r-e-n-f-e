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
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const token = localStorage.getItem('token') ?? undefined;
      this.userDataSignal.set({ user, token });
      this.isAuthenticatedSignal.set(true);
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
    localStorage.setItem('usuari', JSON.stringify(user));

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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
