import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministracioService {

  private apiUrl = 'http://localhost:8000/api/v1/administracio/stats';

  constructor(private http: HttpClient) { }

  getEstadistiques(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}