import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Assistencia } from '../../models/assistencies.model';

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
      const data = await this.apiManager.get<Assistencia[]>('/assistencies');
      this.assistencies.set(data);
    } catch (err) {
      this.error.set('Hi ha hagut un problema al llegir les assistències');
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
