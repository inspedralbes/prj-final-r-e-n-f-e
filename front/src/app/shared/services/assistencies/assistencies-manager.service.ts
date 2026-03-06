import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Assistencia } from '../../models/assistencies.model';
import { Inscrit } from '../../models/inscrits.model';

@Injectable({
  providedIn: 'root',
})
export class AssistenciesManagerService {
  private apiManager = inject(ApiManagerService);

  assistencies = signal<Assistencia[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Carrega les assistències des de Laravel i actualitza els Signals
   */
  async carregarAssistencies() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const resp = await this.apiManager.get<any>('/assistencies');
      const llista = resp.data || resp;
      this.assistencies.set(llista);
    } catch (err) {
      this.error.set('Hi ha hagut un problema al llegir les assistències');
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async carregarAssistenciaAlumne(inscrits: Inscrit[]) {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const assistenciesPeticio: Assistencia[] = [];
      const llistaInscrits = inscrits;

      if (llistaInscrits && Array.isArray(llistaInscrits)) {
        for (let i = 0; i < llistaInscrits.length; i++) {
          const registre = llistaInscrits[i];
          // Corregim la URL: traiem la coma i l'espai
          const resp = await this.apiManager.get<any>(`/assistencies/${registre.id}`);
          const data = resp.data || resp;

          if (data && Array.isArray(data)) {
            for (let j = 0; j < data.length; j++) {
              assistenciesPeticio.push(data[j]);
            }
          }
        }
      }
      this.assistencies.set(assistenciesPeticio);
    } catch (err) {
      this.error.set("Hi ha hagut un problema al llegir l'assistencia de l'alumne");
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }


  /**
   * Afegeix un nou registre d'assistència (POST)
   */
  async afegirAssistencia(novaAssistencia: Partial<Assistencia>) {
    try {
      const creat = await this.apiManager.post<Assistencia>('/assistencies', novaAssistencia);

      // Lògica primitiva: obtenir, copiar, afegir, guardar
      const llistaActual = this.assistencies();
      const llistaNova = [];

      for (let i = 0; i < llistaActual.length; i++) {
        llistaNova.push(llistaActual[i]);
      }
      llistaNova.push(creat);

      this.assistencies.set(llistaNova);
      return creat;
    } catch (err) {
      console.error('Error creant assistència:', err);
      throw err;
    }
  }

  /**
   * Actualitza un registre d'assistència existent (PUT)
   */
  async actualitzarAssistencia(id: number, dadesActualitzades: Partial<Assistencia>) {
    try {
      const actualitzacio = await this.apiManager.put<Assistencia>(
        `/assistencies/${id}`,
        dadesActualitzades,
      );

      // Lògica primitiva: bucle manual per actualitzar la llista
      const llistaActual = this.assistencies();
      const llistaNova = [];

      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id === id) {
          llistaNova.push(actualitzacio);
        } else {
          llistaNova.push(element);
        }
      }

      this.assistencies.set(llistaNova);
      return actualitzacio;
    } catch (err) {
      console.error(`Error actualitzant assistència ${id}:`, err);
      throw err;
    }
  }

  /**
   * Esborra un registre d'assistència per la seva ID (DELETE)
   */
  async esborrarAssistencia(id: number) {
    try {
      await this.apiManager.delete(`/assistencies/${id}`);

      // Lògica primitiva: bucle manual per filtrar la llista
      const llistaActual = this.assistencies();
      const llistaNova = [];

      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id !== id) {
          llistaNova.push(element);
        }
      }

      this.assistencies.set(llistaNova);
      return true;
    } catch (err) {
      console.error(`Error esborrant assistència ${id}:`, err);
      throw err;
    }
  }
}
