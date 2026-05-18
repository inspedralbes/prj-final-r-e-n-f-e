import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    console.log('Iniciant connexió socket a:', environment.nodeUrl);
    this.socket = io(environment.nodeUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      secure: environment.production, // Forçar SSL en producció
    });

    this.socket.on('connect', () => {
      console.log('[SOCKET] Connectat amb ID:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SOCKET] Error de connexió:', error);
    });
  }

  // Mètode per escoltar esdeveniments
  public listenToEvent(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  // Mètode per emetre esdeveniments
  public emitEvent(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  // Desconnectar quan sigui necessari
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
