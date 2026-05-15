import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  // Estat (Signals)
  private _isOpen = signal<boolean>(true);
  private _isTutor = signal<boolean | null>(null); // null significa "encara no ho sabem"

  // Getters
  isOpen = computed(() => this._isOpen());
  isTutor = computed(() => this._isTutor());

  // Accions
  setTutorStatus(status: boolean | null) {
    this._isTutor.set(status);
  }

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
