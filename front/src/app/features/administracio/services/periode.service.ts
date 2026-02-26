import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodeService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/periodes';

  constructor(private http: HttpClient) { }

  crearPeriode(dades: any): Observable<any> {
    return this.http.post(this.apiUrl, dades);
  }
}