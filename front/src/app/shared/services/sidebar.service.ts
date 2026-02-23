import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  // Estat (Signals)
  private _isOpen = signal<boolean>(true);

  // Getters
  isOpen = computed(() => this._isOpen());

  // Accions
  toggleSidebar() {
    const estatActual = this._isOpen();
    this._isOpen.set(!estatActual);
  }

  openSidebar() {
    this._isOpen.set(true);
  }

  closeSidebar() {
    this._isOpen.set(false);
  }
}
