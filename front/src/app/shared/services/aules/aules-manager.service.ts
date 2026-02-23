import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Aula } from '../../models/aula.model';

@Injectable({
  providedIn: 'root',
})
export class AulesManagerService {
  private apiManager = inject(ApiManagerService);

  aules = signal<Aula[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Carrega les aules des de Laravel i actualitza els Signals
   */
  async carregarAules() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const data = await this.apiManager.get<Aula[]>('/aules');
      this.aules.set(data);
    } catch (err) {
      this.error.set('Error carregant aules des del servidor');
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Crea una nova aula (POST)
   */
  async afegirAula(novaAula: Partial<Aula>) {
    try {
      const creada = await this.apiManager.post<Aula>('/aules', novaAula);

      // Lògica primitiva
      const llistaActual = this.aules();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        llistaNova.push(llistaActual[i]);
      }
      llistaNova.push(creada);

      this.aules.set(llistaNova);
      return creada;
    } catch (err) {
      console.error('Error creant aula:', err);
      throw err;
    }
  }

  /**
   * Actualitza una aula existent (PUT)
   */
  async actualitzarAula(id: number, dadesActualitzades: Partial<Aula>) {
    try {
      const actualitzacio = await this.apiManager.put<Aula>(`/aules/${id}`, dadesActualitzades);

      // Lògica primitiva
      const llistaActual = this.aules();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id === id) {
          llistaNova.push(actualitzacio);
        } else {
          llistaNova.push(element);
        }
      }

      this.aules.set(llistaNova);
      return actualitzacio;
    } catch (err) {
      console.error(`Error actualitzant aula ${id}:`, err);
      throw err;
    }
  }

  /**
   * Esborra una aula per la seva ID (DELETE)
   */
  async esborrarAula(id: number) {
    try {
      await this.apiManager.delete(`/aules/${id}`);

      // Lògica primitiva
      const llistaActual = this.aules();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id !== id) {
          llistaNova.push(element);
        }
      }

      this.aules.set(llistaNova);
      return true;
    } catch (err) {
      console.error(`Error esborrant aula ${id}:`, err);
      throw err;
    }
  }
}
