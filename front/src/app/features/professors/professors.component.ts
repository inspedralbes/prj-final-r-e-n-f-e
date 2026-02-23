import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AssignaturesManagerService } from '../../shared/services/assignatures/assignatures-manager.service';
import { HorarisManagerService } from '../../shared/services/horaris/horaris-manager.service';
import { ImparteixManagerService } from '../../shared/services/imparteix/imparteix-manager.service';

@Component({
    selector: 'app-professors',
    imports: [CommonModule, SidebarComponent],
    templateUrl: './professors.component.html',
    styleUrl: './professors.component.css'
})
export class ProfessorsComponent implements OnInit {
    assignaturesManager = inject(AssignaturesManagerService);
    horarisManager = inject(HorarisManagerService);
    imparteixManager = inject(ImparteixManagerService);



    // Dades de la classe actual conectada a la Base de Datos (ARA REACTIU!)
    classeActual = computed(() => {
        // Això llegeix constantment l'array d'assignatures del Manager
        const llistaDeLaravel = this.assignaturesManager.assignatures();

        // Com que la teva base de dades està buida de moment, li diem què mostrar si no hi ha res:
        if (llistaDeLaravel.length === 0) {
            return {
                nom: 'Cap assignatura trobada',
                estat: 'ESPERANT DADES...',
                horaInici: '--:--',
                horaFi: '--:--',
                aula: 'TBD'
            };
        }
        // Si tenim dades a Laravel, agafem la primera assignatura (només per començar)
        // (Més endavant ho creuarem amb Horaris i Aules de debò)
        const primera = llistaDeLaravel[0];

        return {
            nom: primera.nom,
            estat: 'EN CURS ARA',
            horaInici: '08:00',
            horaFi: '09:00',
            aula: 'A201'
        };
    });

    franjaHoraria = signal<'AM' | 'PM'>('AM');


    diesSetmana = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'];

    // Horari Matí
    horariFrontAM = [
        { hora: '08:00', assignatures: ['Matemàtiques', 'Física', 'Química', 'Història', 'Filosofia'] },
        { hora: '09:00', assignatures: ['Anglès', 'Matemàtiques', 'Física', 'Química', 'Història'] },
        { hora: '10:00', assignatures: ['Filosofia', 'Anglès', 'Matemàtiques', 'Física', 'Química'] },
        { hora: '11:00', assignatures: ['Història', 'Filosofia', 'Anglès', 'Matemàtiques', 'Física'] },
        { hora: '11:30', assignatures: ['Esbarjo', 'Esbarjo', 'Esbarjo', 'Esbarjo', 'Esbarjo'] },
        { hora: '12:00', assignatures: ['Química', 'Història', 'Filosofia', 'Anglès', 'Matemàtiques'] },
        { hora: '13:00', assignatures: ['Tutoria', 'Projecte', 'Projecte', 'Esport', 'Lliure'] },
    ];

    // Horari Tarda
    horariFrontPM = [
        { hora: '15:00', assignatures: ['Programació', 'Bases de Dades', 'Xarxes', 'Sistemes', 'Anglès Tècnic'] },
        { hora: '16:00', assignatures: ['Bases de Dades', 'Programació', 'Xarxes', 'Sistemes', 'Anglès Tècnic'] },
        { hora: '17:00', assignatures: ['Xarxes', 'Sistemes', 'Programació', 'Bases de Dades', 'Empresa'] },
        { hora: '18:00', assignatures: ['Esbarjo', 'Esbarjo', 'Esbarjo', 'Esbarjo', 'Esbarjo'] },
        { hora: '18:30', assignatures: ['Projecte', 'Empresa', 'FOL', 'Programació', 'Sistemes'] },
        { hora: '19:30', assignatures: ['Projecte', 'Empresa', 'FOL', 'Programació', 'Sistemes'] },
    ];

    // Retorna l'horari segons la franja seleccionada
    horariActual = computed(() => {
        // 1. Obtenim totes les dades que hem inyectat al ngOnInit
        const totesImparticions = this.imparteixManager.imparticions();
        const totsHoraris = this.horarisManager.horaris();

        // 2. Definim quin profe som per poder filtrar què ens toca donar
        const idProfeLoguejat = 1; // Més endavant ho agafarem del Login

        // 3. Busquem quines assignatures dono jo
        const lesMevesAssignatures: number[] = [];
        for (let i = 0; i < totesImparticions.length; i++) {
            const imparticioActual = totesImparticions[i];

            if (imparticioActual.id_profe === idProfeLoguejat) {
                lesMevesAssignatures.push(imparticioActual.id_assignatura);
            }
        }

        // 4. Recollim només els horaris que coincideixin amb les meves assignatures
        const elsMeusHoraris: any[] = [];
        for (let j = 0; j < totsHoraris.length; j++) {
            const horariActualAux = totsHoraris[j];
            let esMeva = false;

            // Comprovem si l'horari actual és d'alguna de les meves assignatures
            for (let k = 0; k < lesMevesAssignatures.length; k++) {
                if (horariActualAux.id_assig === lesMevesAssignatures[k]) {
                    esMeva = true;
                    break; // Ja hem trobat que és meva, no cal comprovar més
                }
            }

            // Si és meva, la guardem a la llista d'horaris definitius
            if (esMeva) {
                elsMeusHoraris.push(horariActualAux);
            }
        }

        // 5. Construïm la plantilla buida de la teva UI
        let graella: any[];

        const esMati = this.franjaHoraria() === 'AM';
        if (esMati) {
            graella = [
                { hora: '08:00', assignatures: ['', '', '', '', ''] },
                { hora: '09:00', assignatures: ['', '', '', '', ''] },
                { hora: '10:00', assignatures: ['', '', '', '', ''] },
                { hora: '11:00', assignatures: ['ESBARJO', 'ESBARJO', 'ESBARJO', 'ESBARJO', 'ESBARJO'] },
                { hora: '11:30', assignatures: ['', '', '', '', ''] },
                { hora: '12:30', assignatures: ['', '', '', '', ''] },
                { hora: '13:30', assignatures: ['', '', '', '', ''] },
            ];
        } else {
            graella = [
                { hora: '15:00', assignatures: ['', '', '', '', ''] },
                { hora: '16:00', assignatures: ['', '', '', '', ''] },
                { hora: '17:00', assignatures: ['', '', '', '', ''] },
                { hora: '18:00', assignatures: ['ESBARJO', 'ESBARJO', 'ESBARJO', 'ESBARJO', 'ESBARJO'] },
                { hora: '18:30', assignatures: ['', '', '', '', ''] },
                { hora: '19:30', assignatures: ['', '', '', '', ''] }
            ];
        }

        // 6. Agafem els meus horaris i els col·loquem a la casella de la graella corresponent
        for (let iterador = 0; iterador < elsMeusHoraris.length; iterador++) {
            const horariAquest = elsMeusHoraris[iterador];
            // Si hi ha codi_hora (ex: "X3") el desgranem
            if (horariAquest.codi_hora) {
                const lletraDia = horariAquest.codi_hora.charAt(0); // Primera lletra: 'L', 'M', 'X'...
                const numeroHoraText = horariAquest.codi_hora.substring(1); // La resta: '1', '2', '3'...
                const numeroHora = parseInt(numeroHoraText);
                // --- CALCULEM LA COLUMNA (El dia de la setmana) ---
                let indexColumna = -1;
                if (lletraDia === 'L') { indexColumna = 0; }
                else if (lletraDia === 'M') { indexColumna = 1; }
                else if (lletraDia === 'X') { indexColumna = 2; }
                else if (lletraDia === 'J') { indexColumna = 3; }
                else if (lletraDia === 'V') { indexColumna = 4; }
        
                // --- CALCULEM LA FILA (L'hora del dia) ---
                if (indexColumna !== -1) {
                    let indexFila = -1;
                    
                    // Lògica per als matins (hores 1 a 6)
                    if (esMati && numeroHora <= 6) {
                        if (numeroHora <= 3) {
                            indexFila = numeroHora - 1; // 1ra hora -> Fila 0
                        } else {
                            indexFila = numeroHora;     // 4ta hora -> Fila 4 (salta l'esbarjo, fila 3)
                        }
                    } 
                    // Lògica per a les tardes (hores 7 a 12)
                    else if (!esMati && numeroHora >= 7) {
                        const horaTarda = numeroHora - 6; // Convertim "hora 7" en "1ra de la tarda"
                        if (horaTarda <= 3) {
                            indexFila = horaTarda - 1;
                        } else {
                            indexFila = horaTarda;
                        }
                    }
                    // --- INSERIM A LA GRAELLA SI LA CASELLA ESTÀ BUIDA ---
                    if (indexFila !== -1 && graella[indexFila] && graella[indexFila].assignatures[indexColumna] === '') {
                        
                        // Extraiem els noms protegint-nos de si vénen buits del Back
                        let nomAssignatura = 'Sense Nom';
                        if (horariAquest.assignatura && horariAquest.assignatura.nom) {
                            nomAssignatura = horariAquest.assignatura.nom;
                        }
                        let nomClasse = '';
                        if (horariAquest.classe && horariAquest.classe.nom) {
                            nomClasse = horariAquest.classe.nom;
                        }
                        // Ho juntem a l'estil: "Programació\n(DAW2)"
                        graella[indexFila].assignatures[indexColumna] = nomAssignatura + '\n(' + nomClasse + ')';
                    }
                }
            }
        }
        return graella;

    });

    commutarFranja() {
        this.franjaHoraria.update(valor => valor === 'AM' ? 'PM' : 'AM');
    }

    // Implementación del método ngOnInit, esto pide a Laravel todas las asignaturas cuando el profe entra a su pantalla
    ngOnInit() {
        this.assignaturesManager.carregarAssignatures();
        this.horarisManager.carregarHoraris();
        this.imparteixManager.carregarImparticions();
    }

}
