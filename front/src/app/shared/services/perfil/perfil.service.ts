import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Usuari } from '../../models/usuaris.model';

interface expectedAnswer {
  success: boolean;
  data: PerfilData;
}

export interface InfoAdicional {
  classe: string;
  curs: string;
  tutor?: { nom: string; cognom: string | null };
}

export interface PerfilData {
  user: Usuari;
  info: InfoAdicional;
}

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private apiManager = inject(ApiManagerService);

  perfilData = signal<PerfilData | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  async getPerfil(id: string | null): Promise<expectedAnswer | null> {
    if (id === null) {
      return null;
    }
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const resp = await this.apiManager.get<expectedAnswer>(`/perfil/${id}`);
      this.perfilData.set(resp.data);
      return resp;
    } catch (err) {
      this.error.set("No s'ha pogut obtenir el perfil");
      console.error(err);
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }
}
