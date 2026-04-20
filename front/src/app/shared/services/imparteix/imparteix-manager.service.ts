import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Imparteix } from '../../models/imparteix.model';

@Injectable({
  providedIn: 'root',
})
export class ImparteixManagerService {
  private apiManager = inject(ApiManagerService);

  imparticions = signal<Imparteix[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Carrega les imparticions des de Laravel i actualitza els Signals
   */
  async carregarImparticions() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const resp = await this.apiManager.get<any>('/imparteix');
      const llista = resp.data || resp;
      this.imparticions.set(llista);
    } catch (err) {
      this.error.set("No s'ha pogut connectar per veure qui imparteix què");
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Assigna una nova assignatura a un profe (POST)
   */
  async afegirImparticio(novaImparticio: Partial<Imparteix>) {
    try {
      const creada = await this.apiManager.post<Imparteix>('/imparteix', novaImparticio);

      // Lògica primitiva
      const llistaActual = this.imparticions();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        llistaNova.push(llistaActual[i]);
      }
      llistaNova.push(creada);

      this.imparticions.set(llistaNova);
      return creada;
    } catch (err) {
      console.error('Error creant impartició:', err);
      throw err;
    }
  }

  /**
   * Actualitza una assignació existent (PUT)
   */
  async actualitzarImparticio(id: number, dadesActualitzades: Partial<Imparteix>) {
    try {
      const actualitzacio = await this.apiManager.put<Imparteix>(
        `/imparteix/${id}`,
        dadesActualitzades,
      );

      // Lògica primitiva
      const llistaActual = this.imparticions();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id === id) {
          llistaNova.push(actualitzacio);
        } else {
          llistaNova.push(element);
        }
      }

      this.imparticions.set(llistaNova);
      return actualitzacio;
    } catch (err) {
      console.error(`Error actualitzant impartició ${id}:`, err);
      throw err;
    }
  }

  /**
   * Esborra una assignació per la seva ID (DELETE)
   */
  async esborrarImparticio(id: number) {
    try {
      await this.apiManager.delete(`/imparteix/${id}`);

      // Lògica primitiva
      const llistaActual = this.imparticions();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id !== id) {
          llistaNova.push(element);
        }
      }

      this.imparticions.set(llistaNova);
      return true;
    } catch (err) {
      console.error(`Error esborrant impartició ${id}:`, err);
      throw err;
    }
  }
}
