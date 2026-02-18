import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
    selector: 'app-professors',
    imports: [CommonModule, SidebarComponent],
    templateUrl: './professors.component.html',
    styleUrl: './professors.component.css'
})
export class ProfessorsComponent {
    franjaHoraria = signal<'AM' | 'PM'>('AM');

    // Dades simulades per a la classe actual
    classeActual = {
        nom: 'Matemáticas Avanzadas II',
        estat: 'EN CURS ARA',
        horaInici: '08:00',
        horaFi: '09:00',
        aula: 'A201'
    };

    diesSetmana = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'];

    // Dades AM
    horariFrontAM = [
        { hora: '08:00', assignatures: ['Matemàtiques', 'Física', 'Química', 'Història', 'Filosofia'] },
        { hora: '09:00', assignatures: ['Anglès', 'Matemàtiques', 'Física', 'Química', 'Història'] },
        { hora: '10:00', assignatures: ['Filosofia', 'Anglès', 'Matemàtiques', 'Física', 'Química'] },
        { hora: '11:00', assignatures: ['Història', 'Filosofia', 'Anglès', 'Matemàtiques', 'Física'] },
        { hora: '11:30', assignatures: ['Esbarjo', 'Esbarjo', 'Esbarjo', 'Esbarjo', 'Esbarjo'] },
        { hora: '12:00', assignatures: ['Química', 'Història', 'Filosofia', 'Anglès', 'Matemàtiques'] },
        { hora: '13:00', assignatures: ['Tutoria', 'Projecte', 'Projecte', 'Esport', 'Lliure'] },
    ];

    // Dades PM (a partir de les 14:30)
    horariFrontPM = [
        { hora: '15:00', assignatures: ['Programació', 'Bases de Dades', 'Xarxes', 'Sistemes', 'Anglès Tècnic'] },
        { hora: '16:00', assignatures: ['Bases de Dades', 'Programació', 'Xarxes', 'Sistemes', 'Anglès Tècnic'] },
        { hora: '17:00', assignatures: ['Xarxes', 'Sistemes', 'Programació', 'Bases de Dades', 'Empresa'] },
        { hora: '18:00', assignatures: ['Esbarjo', 'Esbarjo', 'Esbarjo', 'Esbarjo', 'Esbarjo'] },
        { hora: '18:30', assignatures: ['Projecte', 'Empresa', 'FOL', 'Programació', 'Sistemes'] },
        { hora: '19:30', assignatures: ['Projecte', 'Empresa', 'FOL', 'Programació', 'Sistemes'] },
    ];

    // Senyal computat que retorna l'horari segons la franja
    horariActual = computed(() => {
        return this.franjaHoraria() === 'AM' ? this.horariFrontAM : this.horariFrontPM;
    });

    commutarFranja() {
        this.franjaHoraria.update(valor => valor === 'AM' ? 'PM' : 'AM');
    }
}
