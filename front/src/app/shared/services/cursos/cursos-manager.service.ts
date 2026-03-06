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
      // Assuming a GET /cursos endpoint exists in the backend
      const data = await this.apiManager.get<Curs[]>('/cursos');
      this.cursos.set(data);
    } catch (err) {
      this.error.set('Alguna cosa ha fallat demanant els cursos al Laravel');
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }
}
