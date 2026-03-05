import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';

@Injectable({
  providedIn: 'root'
})
export class CiclesManagerService {
  private apiManager = inject(ApiManagerService);

  cicles = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  async crearCicle(dadesCicle: any) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.apiManager.post<any>('/cursos', dadesCicle);
      return data;
    } catch (err) {
      this.error.set('Error al crear el cicle');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async getCursos() {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.apiManager.get<any[]>('/cursos');
      this.cicles.set(data);
      return data;
    } catch (err) {
      this.error.set('Error al obtener los cursos');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async eliminarCurs(id: number) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.apiManager.delete<any>(`/cursos/${id}`);
      return data;
    } catch (err) {
      this.error.set('Error al eliminar el curso');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async getCurs(id: number) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.apiManager.get<any>(`/cursos/${id}`);
      return data;
    } catch (err) {
      this.error.set('Error al obtener el curso');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async actualitzarCurs(id: number, dades: any) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.apiManager.put<any>(`/cursos/${id}`, dades);
      return data;
    } catch (err) {
      this.error.set('Error al actualizar el curso');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }
}
