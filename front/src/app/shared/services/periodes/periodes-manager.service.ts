import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodesManagerService {
  private apiManager = inject(ApiManagerService);

  periodes = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  async getPeriodes() {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.apiManager.get<any[]>('/periodes');
      this.periodes.set(data);
      return data;
    } catch (err) {
      this.error.set('Error al obtener los periodes');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async getPeriode(id: number) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.apiManager.get<any>(`/periodes/${id}`);
      return data;
    } catch (err) {
      this.error.set('Error al obtener el periode');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async crearPeriode(dades: any) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.apiManager.post<any>('/periodes', dades);
      return data;
    } catch (err) {
      this.error.set('Error al crear el periode');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async actualitzarPeriode(id: number, dades: any) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.apiManager.put<any>(`/periodes/${id}`, dades);
      return data;
    } catch (err) {
      this.error.set('Error al actualizar el periode');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async eliminarPeriode(id: number) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.apiManager.delete<any>(`/periodes/${id}`);
      return data;
    } catch (err) {
      this.error.set('Error al eliminar el periode');
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }
}
