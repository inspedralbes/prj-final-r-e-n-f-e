import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'admin-gestio-assignatures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestioAssignatures.component.html',
  styleUrls: ['./gestioAssignatures.component.css'],
})
export class GestioAssignatures implements OnInit {
  carregant = false;

  assignatures: {
    id: number;
    nom: string;
    classe_projecte: string | null;
    interval: { data_ini: string; data_fi: string };
    exempcio: boolean;
  }[] = [
    {
      id: 1,
      nom: 'Matemàtiques',
      classe_projecte: null,
      interval: { data_ini: '2025-09-01', data_fi: '2026-06-15' },
      exempcio: false,
    },
    {
      id: 2,
      nom: 'Projecte Final',
      classe_projecte: '2DAW-A',
      interval: { data_ini: '2026-01-10', data_fi: '2026-05-30' },
      exempcio: true,
    },
    {
      id: 3,
      nom: 'Anglès',
      classe_projecte: null,
      interval: { data_ini: '2025-09-01', data_fi: '2026-06-15' },
      exempcio: false,
    },
  ];

  ngOnInit(): void {}

  obrirModalCrear(id?: number): void {
    if (id !== undefined) {
      console.log('Editar assignatura id:', id);
    } else {
      console.log('Crear nova assignatura');
    }
  }

  esborrarUsuari(id: number): void {
    console.log('Esborrar assignatura id:', id);
    this.assignatures = this.assignatures.filter((a) => a.id !== id);
  }
}
