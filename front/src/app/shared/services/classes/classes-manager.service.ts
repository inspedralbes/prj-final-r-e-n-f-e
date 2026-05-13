import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Classe } from '../../models/classe.model';

@Injectable({
  providedIn: 'root',
})
export class ClassesManagerService {
  private apiManager = inject(ApiManagerService);

  classes = signal<Classe[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  /**
   * Obté l'array de classes via GET i actualitza el Signal reactiu.
   */
  async carregarClasses() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const resp = await this.apiManager.get<any>('/classes');
      const llista = resp.data || resp;
      this.classes.set(llista);
    } catch (err) {
      this.error.set('Alguna cosa ha fallat demanant les classes al Laravel');
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Demana a l'API la classe referenciada directament per un ID de tutor.
   */
  async obtenirClasseTutor(idTutor: number) {
    this.isLoading.set(true);
    try {
      const resp = await this.apiManager.get<any>(`/classes/tutor/${idTutor}`);
      return resp.data; // Retorna l'objecte Classe
    } catch (err) {
      console.error('Error obtenint la classe del tutor:', err);
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Filtra i retorna únicament l'alumnat validat vinculat a una classe concreta.
   */
  async getAlumnesClasse(idClasse: number) {
    this.isLoading.set(true);
    try {
      const resp = await this.apiManager.get<any>(`/classes/${idClasse}/alumnes`);
      return resp.data || resp;
    } catch (err) {
      console.error(`Error obtenint alumnes de la classe ${idClasse}`, err);
      return [];
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * (Antic) Inicialitza de zero una classe i l'aplica a la llista actual.
   */
  async crearClasse(nom: string, curs_id: number) {
    try {
      const resp = await this.apiManager.post<any>('/classes', { nom, curs_id });
      // El backend retorna success, data (Classe) i message
      const novaClasse = resp.data || resp;

      const llistaActual = this.classes();
      const llistaNova = [];
      for (let i = 0; i < llistaActual.length; i++) {
        llistaNova.push(llistaActual[i]);
      }
      llistaNova.push(novaClasse);

      this.classes.set(llistaNova);
      return novaClasse;
    } catch (err) {
      console.error('Error creant classe:', err);
      throw err;
    }
  }

  /**
   * API POST: Afegeix i reconstrueix la llista local per desencadenar reactivitat visual.
   */
  async afegirClasse(classe: Partial<Classe>) {
    try {
      const resp = await this.apiManager.post<any>('/classes', classe);
      const novaClasse = resp.data || resp;
      
      let copiaClases = [];
      let clasesActuales = this.classes();
      for (let i = 0; i < clasesActuales.length; i++) {
        copiaClases.push(clasesActuales[i]);
      }
      copiaClases.push(novaClasse);
      this.classes.set(copiaClases);

      return novaClasse;
    } catch (err) {
      console.error('Error afegint classe:', err);
      throw err;
    }
  }

  /**
   * API PUT: Substitueix iterativament la instància local afectada per reflectir el canvi.
   */
  async actualitzarClasse(id: number, classe: Partial<Classe>) {
    try {
      const resp = await this.apiManager.put<any>(`/classes/${id}`, classe);
      const classeActualitzada = resp.data || resp;
      
      let clasesModificadas = [];
      let clasesActuales = this.classes();
      for (let i = 0; i < clasesActuales.length; i++) {
        if (clasesActuales[i].id === id) {
          clasesModificadas.push(classeActualitzada);
        } else {
          clasesModificadas.push(clasesActuales[i]);
        }
      }
      this.classes.set(clasesModificadas);

      return classeActualitzada;
    } catch (err) {
      console.error('Error actualitzant classe:', err);
      throw err;
    }
  }

  /**
   * API DELETE: Omet manualment l'ID esborrat regenerant l'array d'estat.
   */
  async esborrarClasse(id: number) {
    try {
      await this.apiManager.delete<any>(`/classes/${id}`);
      
      let clasesRestantes = [];
      let clasesActuales = this.classes();
      for (let i = 0; i < clasesActuales.length; i++) {
        if (clasesActuales[i].id !== id) {
          clasesRestantes.push(clasesActuales[i]);
        }
      }
      this.classes.set(clasesRestantes);

    } catch (err) {
      console.error('Error esborrant classe:', err);
      throw err;
    }
  }

  /**
   * API POST: Vincula en bloc un array d'emails d'alumnes cap a una mateixa classe.
   */
  async assignarAlumnes(classe_id: number, emails: string[]) {
    try {
      const resp = await this.apiManager.post<any>('/classes/assignarAlumnes', {
        classe_id,
        emails,
      });
      return resp;
    } catch (err) {
      console.error('Error enviant alumnes a la classe:', err);
      throw err;
    }
  }

  /**
   * API POST: Desvincula remotament un alumne i buida les seves inscripcions a aquella classe.
   */
  async treureAlumne(classe_id: number, alumne_id: number) {
    try {
      const resp = await this.apiManager.post<any>('/classes/treureAlumne', {
        classe_id,
        alumne_id,
      });
      return resp;
    } catch (err) {
      console.error('Error treient alumne de la classe:', err);
      throw err;
    }
  }
}
