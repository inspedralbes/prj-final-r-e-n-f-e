import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Assignatura } from '../../models/assignatura.model';

@Injectable({
  providedIn: 'root',
})
export class AssignaturesManagerService {
  private apiManager = inject(ApiManagerService);

  assignatures = signal<Assignatura[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Carrega les assignatures des de Laravel i actualitza els Signals
   */
  async carregarAssignatures() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const resp = await this.apiManager.get<any>('/assignatures');
      const llista = resp.data || resp;
      this.assignatures.set(llista);
    } catch (err) {
      this.error.set('Error carregant assignatures del backend');
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Crea una nova assignatura (POST)
   */
  async afegirAssignatura(novaAssignatura: Partial<Assignatura>) {
    try {
      const response = await this.apiManager.post<any>('/assignatures', novaAssignatura);
      const creada = response.data || response;

      // Lògica primitiva: obtenir, copiar, afegir, guardar
      const llistaActual = this.assignatures();
      const llistaNova = [];

      for (let i = 0; i < llistaActual.length; i++) {
        llistaNova.push(llistaActual[i]);
      }
      llistaNova.push(creada);

      this.assignatures.set(llistaNova);
      return creada;
    } catch (err) {
      console.error('Error creant assignatura:', err);
      throw err;
    }
  }

  /**
   * Actualitza una assignatura (PUT)
   */
  async actualitzarAssignatura(id: number, dadesActualitzades: Partial<Assignatura>) {
    try {
      const response = await this.apiManager.put<any>(
        `/assignatures/${id}`,
        dadesActualitzades,
      );
      const actualitzacio = response.data || response;

      // Lògica primitiva: bucle manual per actualitzar la llista
      const llistaActual = this.assignatures();
      const llistaNova = [];

      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id === id) {
          llistaNova.push(actualitzacio);
        } else {
          llistaNova.push(element);
        }
      }

      this.assignatures.set(llistaNova);
      return actualitzacio;
    } catch (err) {
      console.error(`Error actualitzant assignatura ${id}:`, err);
      throw err;
    }
  }

  /**
   * Esborra una assignatura (DELETE)
   */
  async esborrarAssignatura(id: number) {
    try {
      await this.apiManager.delete(`/assignatures/${id}`);

      // Lògica primitiva: bucle manual per filtrar la llista
      const llistaActual = this.assignatures();
      const llistaNova = [];

      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id !== id) {
          llistaNova.push(element);
        }
      }

      this.assignatures.set(llistaNova);
      return true;
    } catch (err) {
      console.error(`Error esborrant assignatura ${id}:`, err);
      throw err;
    }
  }
}
