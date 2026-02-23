import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class CicleService {

  private apiUrl = 'http://localhost:8000/api/cursos';

  constructor(private http: HttpClient) { }

  crearCicle(dadesCicle: any): Observable<any> {
    return this.http.post(this.apiUrl, dadesCicle);
  }
}