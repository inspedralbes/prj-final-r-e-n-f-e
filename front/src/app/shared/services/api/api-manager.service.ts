import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiManagerService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.backendUrl;

  /**
   * Petición GET genérica
   * Recibe el endpoint  y devuelve de forma asíncrona lo que retorne el backend
   */
  async get<T>(endpoint: string): Promise<T> {
    try {
      const data = await firstValueFrom(this.http.get<T>(`${this.baseUrl}${endpoint}`));
      return data;
    } catch (error) {
      console.error(`Error en GET ${endpoint}:`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    try {
      const data = await firstValueFrom(this.http.post<T>(`${this.baseUrl}${endpoint}`, body));
      return data;
    } catch (error) {
      console.error(`Error en POST ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Petició PUT genèrica (Actualitzar)
   */
  async put<T>(endpoint: string, body: any): Promise<T> {
    try {
      const data = await firstValueFrom(this.http.put<T>(`${this.baseUrl}${endpoint}`, body));
      return data;
    } catch (error) {
      console.error(`Error en PUT ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Petició DELETE genèrica (Esborrar)
   */
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const data = await firstValueFrom(this.http.delete<T>(`${this.baseUrl}${endpoint}`));
      return data;
    } catch (error) {
      console.error(`Error en DELETE ${endpoint}:`, error);
      throw error;
    }
  }
}
