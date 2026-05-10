import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Justificant, JustificantNet } from '../../models/justificants.model';

@Injectable({
  providedIn: 'root',
})
export class JustificantsManagerService {
  private apiManager = inject(ApiManagerService);

  justificants = signal<Justificant[]>([]);
  justificantsTutoria = signal<JustificantNet[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Carrega els justificants des de Laravel i actualitza els Signals
   */
  async carregarJustificants() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const data = await this.apiManager.get<Justificant[]>('/justificants');
      this.justificants.set(data);
    } catch (err) {
      this.error.set("S'ha produït un error al recuperar els justificants");
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Carrega els justificants d'un alumne concret
   */
  async carregarJustificantsPerAlumne(idAlumne: number) {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const data = await this.apiManager.get<Justificant[]>(`/justificants/alumne/${idAlumne}`);
      this.justificants.set(data);
    } catch (err) {
      this.error.set("S'ha produït un error al recuperar els justificants de l'alumne");
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Afegeix un nou justificant (POST)
   */
  async afegirJustificant(nouJustificant: Partial<Justificant>, documentFile?: File | null) {
    try {
      const formData = new FormData();

      for (const [clau, valor] of Object.entries(nouJustificant)) {
        if (valor !== null && valor !== undefined) {
          formData.append(clau, String(valor));
        }
      }

      if (documentFile) {
        formData.append('document', documentFile);
      }

      const creada = await this.apiManager.post<Justificant>('/justificants', formData);

      this.justificants.set([...this.justificants(), creada]);
      return creada;
    } catch (err) {
      console.error('Error afegint justificant:', err);
      throw err;
    }
  }

  /**
   * Actualitza un justificant existent (PUT)
   */
  async actualitzarJustificant(id: number, dadesActualitzades: Partial<Justificant>) {
    try {
      const actualitzacio = await this.apiManager.put<Justificant>(
        `/justificants/${id}`,
        dadesActualitzades,
      );

      // Lògica primitiva
      const llistaActual = this.justificants();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id === id) {
          llistaNova.push(actualitzacio);
        } else {
          llistaNova.push(element);
        }
      }

      this.justificants.set(llistaNova);
      return actualitzacio;
    } catch (err) {
      console.error(`Error actualitzant justificant ${id}:`, err);
      throw err;
    }
  }

  /**
   * Esborra un justificant per la seva ID (DELETE)
   */
  async esborrarJustificant(id: number) {
    try {
      await this.apiManager.delete(`/justificants/${id}`);

      // Lògica primitiva
      const llistaActual = this.justificants();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id !== id) {
          llistaNova.push(element);
        }
      }

      this.justificants.set(llistaNova);
      return true;
    } catch (err) {
      console.error(`Error esborrant justificant ${id}:`, err);
      throw err;
    }
  }

  async carregarJustificantsTutoria() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const response = await this.apiManager.get<{ success: boolean; data: JustificantNet[] }>(
        `/justificants/tutoria/pendents`,
      );
      this.justificantsTutoria.set(response.data);
    } catch (err) {
      this.error.set("S'ha produït un error al recuperar els justificants");
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async acceptarJustificant(id: number, acceptat: boolean) {
    try {
      const response = await this.apiManager.post<{ success: boolean; data: Justificant }>(
        `/justificants/acceptar/${id}`,
        { acceptat },
      );

      if (response.success) {
        await this.carregarJustificantsTutoria();
      }
      return response;
    } catch (err) {
      console.error(`Error acceptant justificant ${id}:`, err);
      throw err;
    }
  }
}
