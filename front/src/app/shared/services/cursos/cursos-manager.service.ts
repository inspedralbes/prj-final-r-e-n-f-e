import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Curs } from '../../models/curs.model';

@Injectable({
  providedIn: 'root',
})
export class CursosManagerService {
  private apiManager = inject(ApiManagerService);

  cursos = signal<Curs[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  async carregarCursos() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const resp = await this.apiManager.get<any>('/cursos');
      const llista = resp?.data || resp;
      this.cursos.set(llista);
    } catch (err) {
      this.error.set('Alguna cosa ha fallat demanant els cursos al Laravel');
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async afegirCurs(curs: Partial<Curs>) {
    try {
      const resp = await this.apiManager.post<any>('/cursos', curs);
      const nouCurs = resp.data || resp;

      const copia = [];
      const actuals = this.cursos();
      for (let i = 0; i < actuals.length; i++) {
        copia.push(actuals[i]);
      }
      copia.push(nouCurs);
      this.cursos.set(copia);

      return nouCurs;
    } catch (err) {
      console.error('Error afegint curs:', err);
      throw err;
    }
  }

  async actualitzarCurs(id: number, curs: Partial<Curs>) {
    try {
      const resp = await this.apiManager.put<any>(`/cursos/${id}`, curs);
      const cursActualitzat = resp.data || resp;

      const modificats = [];
      const actuals = this.cursos();
      for (let i = 0; i < actuals.length; i++) {
        if (actuals[i].id === id) {
          modificats.push(cursActualitzat);
        } else {
          modificats.push(actuals[i]);
        }
      }
      this.cursos.set(modificats);

      return cursActualitzat;
    } catch (err) {
      console.error('Error actualitzant curs:', err);
      throw err;
    }
  }

  async esborrarCurs(id: number) {
    try {
      await this.apiManager.delete<any>(`/cursos/${id}`);

      const restants = [];
      const actuals = this.cursos();
      for (let i = 0; i < actuals.length; i++) {
        if (actuals[i].id !== id) {
          restants.push(actuals[i]);
        }
      }
      this.cursos.set(restants);
    } catch (err) {
      console.error('Error esborrant curs:', err);
      throw err;
    }
  }
}
