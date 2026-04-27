import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';

export interface PerfilData {
  id: number;
  nom: string;
  cognom: string;
  email: string;
  email_pares: string | null;
  rol: string;
  nfc_id: string | null;
  id_classe: number | null;
  photo: string | null;
  data_naixement: string | null;
  google_id: string | null;
  created_at: string;
  updated_at: string;
  classe?: {
    id: number;
    nom: string;
    curs?: {
      id: number;
      nom: string;
    };
    tutor?: {
      id: number;
      nom: string;
      cognom: string;
    };
  };
  classes_tutor?: Array<{
    id: number;
    nom: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private apiManager = inject(ApiManagerService);

  perfilData = signal<PerfilData | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  async getPerfil(): Promise<PerfilData | null> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const resp = await this.apiManager.get<any>('/usuaris/perfil');
      const data = resp.data || resp;
      this.perfilData.set(data);
      return data;
    } catch (err) {
      this.error.set("No s'ha pogut obtenir el perfil");
      console.error(err);
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }
}