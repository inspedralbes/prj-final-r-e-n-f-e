import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Usuari } from '../../models/usuaris.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiManager = inject(ApiManagerService);
  private router = inject(Router);

  // Signal per guardar l'usuari actual a la memòria de l'aplicació
  currentUser = signal<Usuari | null>(null);

  constructor() {
    this.carregarSessio(); // En iniciar el servei, recuperem la sessió si n'hi ha
  }

  /**
   * Intenta fer login amb el backend
   */
  async login(login_field: string): Promise<boolean> {
    try {
      // Cridem al backend al nou endpoint creat pasant el camp (que pot ser nom o email)
      const resposta = await this.apiManager.post<{ success: boolean; data: Usuari; message: string }>('/login', { login_field });
      
      if (resposta.success && resposta.data) {
        // Guardem l'usuari al Signal
        this.currentUser.set(resposta.data);
        
        // Guardem l'usuari al localStorage per mantenir la sessió en recarregar
        localStorage.setItem('auth_user', JSON.stringify(resposta.data));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error durant el login:', error);
      return false; // Retornem false si el login falla (ex: usuari no trobat)
    }
  }

  /**
   * Tanca la sessió
   */
  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('auth_user');
    this.router.navigate(['/login']); // Redirigir al login
  }

  /**
   * Recupera la sessió de localStorage en reiniciar l'app
   */
  private carregarSessio() {
    const usuariGuardat = localStorage.getItem('auth_user');
    if (usuariGuardat) {
      try {
        const usuariInfo = JSON.parse(usuariGuardat) as Usuari;
        this.currentUser.set(usuariInfo);
      } catch (e) {
        console.error('Error parsejant sessió, llimpiant...', e);
        localStorage.removeItem('auth_user');
      }
    }
  }
}
