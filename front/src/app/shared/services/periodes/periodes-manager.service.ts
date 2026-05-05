import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';

export interface Periode {
  id: number;
  nom: string;
  actiu: boolean;
  trimestre_1_ini: string;
  trimestre_1_fi: string;
  trimestre_2_ini: string;
  trimestre_2_fi: string;
  trimestre_3_ini: string;
  trimestre_3_fi: string;
}

@Injectable({
  providedIn: 'root'
})
export class PeriodesManagerService {
  private apiManager = inject(ApiManagerService);

  // Signals per guardar l'estat i si està carregant
  public periodes = signal<Periode[]>([]);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);

  async carregarPeriodes() {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const resp = await this.apiManager.get<any>('/periodes');
      const llista = resp.data || resp;
      this.periodes.set(llista);
    } catch (err) {
      console.error('Error al carregar els periodes:', err);
      this.error.set('Error al carregar els periodes');
    } finally {
      this.isLoading.set(false);
    }
  }

  async actualitzarPeriode(id: number, periode: Partial<Periode>) {
    try {
      const data = await this.apiManager.put<Periode>(`/periodes/${id}`, periode);
      await this.carregarPeriodes();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async crearPeriode(periode: Partial<Periode>) {
    try {
      const data = await this.apiManager.post<Periode>('/periodes', periode);
      await this.carregarPeriodes();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async esborrarPeriode(id: number) {
    try {
      await this.apiManager.delete(`/periodes/${id}`);
      await this.carregarPeriodes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async establirActiu(id: number) {
    try {
      const data = await this.apiManager.post<Periode>(`/periodes/${id}/actiu`, {});
      await this.carregarPeriodes();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
