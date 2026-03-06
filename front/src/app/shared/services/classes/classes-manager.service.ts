import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Classe } from '../../models/classe.model';

@Injectable({
  providedIn: 'root',
})
export class ClassesManagerService {
  private apiManager = inject(ApiManagerService);

  classes = signal<Classe[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Carrega les classes des de Laravel i actualitza els Signals
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
   * Obté la classe assignada a un tutor específic
   */
  async obtenirClasseTutor(idTutor: number) {
    try {
      const resp = await this.apiManager.get<any>(`/classes/tutor/${idTutor}`);
      return resp.data; // Retorna l'objecte Classe
    } catch (err) {
      console.error('Error obtenint la classe del tutor:', err);
      return null;
    }
  }

  /**
   * Crea una nova classe
   */
  async crearClasse(nom: string, curs_id: number) {
    try {
      const resp = await this.apiManager.post<any>('/classes', { nom, curs_id });
      // El backend retorna { success: true, data: Classe, message: ... }
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
   * Assigna una llista d'emails d'alumnes a una classe
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
}
