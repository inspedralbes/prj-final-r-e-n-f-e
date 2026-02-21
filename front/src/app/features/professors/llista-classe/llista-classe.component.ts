import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-llista-classe',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './llista-classe.component.html',
  styleUrl: './llista-classe.component.css',
})
export class LlistaClasseComponent {
  diesSetmana: string[] = ['Dl', 'Dt', 'Dc', 'Dj', 'Dv'];
  datesSetmana: string[] = [];

  // Estats: '': Pendent, '.': Assistit, 'F': Falta, 'FJ': Justificada, 'R': Retràs
  alumnes = [
    { id: 1, nom: 'Carla Jimenez Gonzalez', assistencia: {} as any },
    { id: 2, nom: 'Carla Jimenez Gonzalez', assistencia: {} as any },
    { id: 3, nom: 'Carla Jimenez Gonzalez', assistencia: {} as any },
    { id: 4, nom: 'Carla Jimenez Gonzalez', assistencia: {} as any },
    { id: 5, nom: 'Carla Jimenez Gonzalez', assistencia: {} as any },
  ];

  constructor() {
    this.calcularDatesSetmana();
    this.inicialitzarAssistencia();
  }

  calcularDatesSetmana() {
    const avui = new Date();
    const diaSetmanaActual = avui.getDay();
    const diferenciaAlDilluns = diaSetmanaActual === 0 ? -6 : 1 - diaSetmanaActual;
    const dilluns = new Date(avui);
    dilluns.setDate(avui.getDate() + diferenciaAlDilluns);

    for (let i = 0; i < 5; i++) {
      const dia = new Date(dilluns);
      dia.setDate(dilluns.getDate() + i);

      const diaStr = dia.getDate().toString().padStart(2, '0');
      const mesStr = (dia.getMonth() + 1).toString().padStart(2, '0');
      this.datesSetmana.push(`${diaStr}/${mesStr}`);
    }
  }

  inicialitzarAssistencia() {
    for (const alumne of this.alumnes) {
      for (const data of this.datesSetmana) {
        alumne.assistencia[data] = ''; 
      }
    }
  }

  moureFocus(alumneIndex: number, diaIndex: number) {
    let seguentAlumne = alumneIndex + 1;
    let seguentDia = diaIndex;

    if (seguentAlumne >= this.alumnes.length) {
      seguentAlumne = 0;
      seguentDia++;
    }

    if (seguentDia < this.datesSetmana.length) {
      const idInput = `input-${seguentAlumne}-${seguentDia}`;
      setTimeout(() => {
        const input = document.getElementById(idInput) as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }, 0);
    }
  }
}
