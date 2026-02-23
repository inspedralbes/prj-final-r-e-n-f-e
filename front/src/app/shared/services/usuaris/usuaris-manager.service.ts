import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Usuari } from '../../models/usuaris.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarisManagerService {
  private apiManager = inject(ApiManagerService);

  usuaris = signal<Usuari[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Carrega els usuaris des de Laravel i actualitza els Signals
   */
  async carregarUsuaris() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const data = await this.apiManager.get<Usuari[]>('/usuaris');
      this.usuaris.set(data);
    } catch (err) {
      this.error.set("No s'han pogut obtenir els usuaris");
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Crea un nou usuari (POST)
   */
  async afegirUsuari(nouUsuari: Partial<Usuari>) {
    try {
      const creada = await this.apiManager.post<Usuari>('/usuaris', nouUsuari);

      // Lògica primitiva
      const llistaActual = this.usuaris();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        llistaNova.push(llistaActual[i]);
      }
      llistaNova.push(creada);

      this.usuaris.set(llistaNova);
      return creada;
    } catch (err) {
      console.error('Error creant usuari:', err);
      throw err;
    }
  }

  /**
   * Actualitza un usuari existent (PUT)
   */
  async actualitzarUsuari(id: number, dadesActualitzades: Partial<Usuari>) {
    try {
      const actualitzacio = await this.apiManager.put<Usuari>(`/usuaris/${id}`, dadesActualitzades);

      // Lògica primitiva
      const llistaActual = this.usuaris();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id === id) {
          llistaNova.push(actualitzacio);
        } else {
          llistaNova.push(element);
        }
      }

      this.usuaris.set(llistaNova);
      return actualitzacio;
    } catch (err) {
      console.error(`Error actualitzant usuari ${id}:`, err);
      throw err;
    }
  }

  /**
   * Esborra un usuari per la seva ID (DELETE)
   */
  async esborrarUsuari(id: number) {
    try {
      await this.apiManager.delete(`/usuaris/${id}`);

      // Lògica primitiva
      const llistaActual = this.usuaris();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id !== id) {
          llistaNova.push(element);
        }
      }

      this.usuaris.set(llistaNova);
      return true;
    } catch (err) {
      console.error(`Error esborrant usuari ${id}:`, err);
      throw err;
    }
  }
}
