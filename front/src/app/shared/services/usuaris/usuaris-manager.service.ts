import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Usuari } from '../../models/usuaris.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarisManagerService {
  private apiManager = inject(ApiManagerService);

  usuaris = signal<Usuari[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  /**
   * Carrega els usuaris des de Laravel i actualitza els Signals
   */
  async carregarUsuaris() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const resp = await this.apiManager.get<any>('/usuaris');
      // Laravel retorna { success: true, data: [...], message: "..." }
      const llista = resp.data || resp;
      this.usuaris.set(llista);
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
      const resp = await this.apiManager.post<any>('/usuaris', nouUsuari);
      const creada: Usuari = resp.data || resp;

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
      const resp = await this.apiManager.put<any>(`/usuaris/${id}`, dadesActualitzades);
      // L'API retorna { success, data, message } — desempaquetem .data
      const actualitzacio: Usuari = resp.data || resp;

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

  /**
   * Retorna només els usuaris que són Alumnes
   */
  getAlumnes(): Usuari[] {
    const tots = this.usuaris();
    const result: Usuari[] = [];
    if (tots && Array.isArray(tots)) {
      for (let i = 0; i < tots.length; i++) {
        const u = tots[i];
        if (u.rol === 'Alumne') {
          result.push(u);
        }
      }
    }
    return result;
  }

  /**
   * Mètode segur (Fase 2): Descarrega només els usuaris d'un rol específic directament des del Backend
   * Així evitem descarregar pares i administradors cada vegada.
   */
  async getUsuarisPerRol(rol: string) {
    this.isLoading.set(true);
    try {
      const resp = await this.apiManager.get<any>(`/usuaris/rol/${rol}`);
      const llista = resp.data || resp;
      return llista;
    } catch (err) {
      console.error(`Error descarregant usuaris amb rol ${rol}`, err);
      return [];
    } finally {
      this.isLoading.set(false);
    }
  }
}
