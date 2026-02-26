import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class CicleService {

  private apiUrl = 'http://127.0.0.1:8000/api/v1/cursos';

  constructor(private http: HttpClient) { }

  crearCicle(dadesCicle: any): Observable<any> {
    return this.http.post(this.apiUrl, dadesCicle);
  }

  getCursos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  eliminarCurs(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCurs(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  actualitzarCurs(id: number, dades: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dades);
  }


}