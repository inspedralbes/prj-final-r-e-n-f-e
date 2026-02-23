import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Inscrit } from '../../models/inscrits.model';

@Injectable({
  providedIn: 'root',
})
export class InscritsManagerService {
  private apiManager = inject(ApiManagerService);

  inscrits = signal<Inscrit[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Carrega els inscrits des de Laravel i actualitza els Signals
   */
  async carregarInscrits() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const data = await this.apiManager.get<Inscrit[]>('/inscrits');
      this.inscrits.set(data);
    } catch (err) {
      this.error.set('Error de comunicació al carregar els inscrits');
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Inscriu un nou alumne (POST)
   */
  async afegirInscrit(nouInscrit: Partial<Inscrit>) {
    try {
      const creada = await this.apiManager.post<Inscrit>('/inscrits', nouInscrit);

      // Lògica primitiva
      const llistaActual = this.inscrits();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        llistaNova.push(llistaActual[i]);
      }
      llistaNova.push(creada);

      this.inscrits.set(llistaNova);
      return creada;
    } catch (err) {
      console.error('Error afegint inscrit:', err);
      throw err;
    }
  }

  /**
   * Actualitza una inscripció existent (PUT)
   */
  async actualitzarInscrit(id: number, dadesActualitzades: Partial<Inscrit>) {
    try {
      const actualitzacio = await this.apiManager.put<Inscrit>(
        `/inscrits/${id}`,
        dadesActualitzades,
      );

      // Lògica primitiva
      const llistaActual = this.inscrits();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id === id) {
          llistaNova.push(actualitzacio);
        } else {
          llistaNova.push(element);
        }
      }

      this.inscrits.set(llistaNova);
      return actualitzacio;
    } catch (err) {
      console.error(`Error actualitzant inscrit ${id}:`, err);
      throw err;
    }
  }

  /**
   * Esborra una inscripció per la seva ID (DELETE)
   */
  async esborrarInscrit(id: number) {
    try {
      await this.apiManager.delete(`/inscrits/${id}`);

      // Lògica primitiva
      const llistaActual = this.inscrits();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id !== id) {
          llistaNova.push(element);
        }
      }

      this.inscrits.set(llistaNova);
      return true;
    } catch (err) {
      console.error(`Error esborrant inscrit ${id}:`, err);
      throw err;
    }
  }
}
