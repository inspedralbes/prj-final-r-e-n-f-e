import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { DiaCalendari, Horari } from '../../models/horaris.model';

@Injectable({
  providedIn: 'root',
})
export class HorarisManagerService {
  private apiManager = inject(ApiManagerService);

  horaris = signal<Horari[]>([]);
  horarisAssignaturaNet = signal<DiaCalendari[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  classeActualApi = signal<any>(null);

  /**
   * Carrega els horaris des de Laravel i actualitza els Signals
   */
  async carregarHoraris() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const resp = await this.apiManager.get<any>('/horaris');
      const llista = resp.data || resp;
      this.horaris.set(llista);
    } catch (err) {
      this.error.set("Hauria d'haver carregat l'horari, però hi ha error");
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Afegeix un nou horari (POST)
   */
  async afegirHorari(nouHorari: Partial<Horari>) {
    try {
      const creat = await this.apiManager.post<Horari>('/horaris', nouHorari);

      // Lògica primitiva
      const llistaActual = this.horaris();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        llistaNova.push(llistaActual[i]);
      }
      llistaNova.push(creat);

      this.horaris.set(llistaNova);
      return creat;
    } catch (err) {
      console.error('Error creant horari:', err);
      throw err;
    }
  }

  /**
   * Actualitza un horari existent (PUT)
   */
  async actualitzarHorari(id: number, dadesActualitzades: Partial<Horari>) {
    try {
      const actualitzacio = await this.apiManager.put<Horari>(`/horaris/${id}`, dadesActualitzades);

      // Lògica primitiva
      const llistaActual = this.horaris();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id === id) {
          llistaNova.push(actualitzacio);
        } else {
          llistaNova.push(element);
        }
      }

      this.horaris.set(llistaNova);
      return actualitzacio;
    } catch (err) {
      console.error(`Error actualitzant horari ${id}:`, err);
      throw err;
    }
  }

  /**
   * Esborra un horari per la seva ID (DELETE)
   */
  async esborrarHorari(id: number) {
    try {
      await this.apiManager.delete(`/horaris/${id}`);

      // Lògica primitiva
      const llistaActual = this.horaris();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        const element = llistaActual[i];
        if (element.id !== id) {
          llistaNova.push(element);
        }
      }

      this.horaris.set(llistaNova);
      return true;
    } catch (err) {
      console.error(`Error esborrant horari ${id}:`, err);
      throw err;
    }
  }

  async getHorari() {
    try {
      this.isLoading.set(true);
      this.error.set(null);
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        this.error.set('No hi ha usuari autenticat');
        return;
      }
      const user = JSON.parse(storedUser);
      const userId: number = user.id;
      this.horarisAssignaturaNet.set(
        await this.apiManager.get<DiaCalendari[]>(`/horaris/usuari/${userId}`),
      );
    } catch (err) {
      console.error(`Error al obtenir l'horari de l'usuari: `, err);
    } finally {
      this.isLoading.set(false);
    }
  }

    async getClasseActual() {
    try {
      this.isLoading.set(true);
      this.error.set(null);
      
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        this.error.set('No hi ha usuari autenticat');
        return;
      }
      
      const user = JSON.parse(storedUser);
      const userId: number = user.id;
      const resposta = await this.apiManager.get<any>(`/usuaris/${userId}/classe-actual`);
      this.classeActualApi.set(resposta.data);
      
    } catch (err) {
      console.error(`Error al obtenir la classe actual de l'usuari: `, err);
      this.classeActualApi.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Fase 2: Mètode segur per descarregar NOMÉS els horaris d'una classe.
   */
  async getHorarisClasse(idClasse: number) {
    this.isLoading.set(true);
    try {
      const resp = await this.apiManager.get<any>(`/classes/${idClasse}/horaris`);
      return resp.data || resp;
    } catch (err) {
      console.error(`Error descarregant horaris de la classe ${idClasse}`, err);
      return [];
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Fase 2: Retorna totes les sessions que imparteix un professor
   */
  async getSessionsProfessor(idProfessor: number) {
    this.isLoading.set(true);
    try {
      const resp = await this.apiManager.get<any>(`/horaris/professor/${idProfessor}`);
      return resp.data || resp;
    } catch (err) {
      console.error(`Error descarregant sessions del professor ${idProfessor}`, err);
      return [];
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Actualització granular (Tasca 3): Desa la franja, el profe i els alumnes
   */
  async actualitzarHorariGranular(dades: {
    codi_hora: string;
    id_classe: number;
    id_assig: number;
    id_aula: number;
    id_profe: number;
    alumnes_ids: number[];
  }) {
    try {
      this.isLoading.set(true);
      const resp = await this.apiManager.post<any>('/horaris/granular', dades);

      // Recarreguem els horaris per tenir la versió més nova del servidor
      await this.carregarHoraris();

      return resp;
    } catch (err) {
      console.error('Error en actualització granular:', err);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }
}
