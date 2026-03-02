import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/usuaris';

  constructor(private http: HttpClient) { }

  getUsuaris(): Observable<any> { return this.http.get(this.apiUrl); }
  getUsuari(id: number): Observable<any> { return this.http.get(`${this.apiUrl}/${id}`); }
  crearUsuari(dades: any): Observable<any> { return this.http.post(this.apiUrl, dades); }
  actualitzarUsuari(id: number, dades: any): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, dades); }
  eliminarUsuari(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}