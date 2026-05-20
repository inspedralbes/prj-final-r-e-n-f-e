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

  /**
   * Carrega els cursos des de Laravel i actualitza els Signals
   */
  async carregarCursos() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      // GET /cursos endpoint: backend returns { success, data, message }
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
}
