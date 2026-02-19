import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  // State (Signals) - Equivalent to 'state' in Pinia
  private _isOpen = signal<boolean>(true);

  
  // Getters
  isOpen = computed(() => this._isOpen());

  // Actions 
  toggleSidebar() {
    this._isOpen.update((value: boolean) => !value);
  }

  openSidebar() {
    this._isOpen.set(true);
  }

  closeSidebar() {
    this._isOpen.set(false);
  }
}
