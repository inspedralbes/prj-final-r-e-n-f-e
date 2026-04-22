import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ClassesManagerService } from '../../../shared/services/classes/classes-manager.service';
import { UsuarisManagerService } from '../../../shared/services/usuaris/usuaris-manager.service';
import { Classe } from '../../../shared/models/classe.model';
import { Usuari } from '../../../shared/models/usuaris.model';

import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-gestio-inscrits',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './gestio-inscrits.component.html',
  styleUrl: './gestio-inscrits.component.css',
})
export class GestioInscritsComponent implements OnInit {
  // Inyectem els serveis de forma senzilla
  public serveiAuth = inject(AuthService);
  public serveiClasses = inject(ClassesManagerService);
  public serveiUsuaris = inject(UsuarisManagerService);

  // Variables per guardar la informació que pintarem
  classeTrobada = signal<Classe | null>(null);
  alumnesDeLaClasse = signal<Usuari[]>([]); // Els que ja estan dins
  alumnesDisponibles = signal<Usuari[]>([]); // Tots els alumnes del sistema
  cercaAlumne: string = '';

  async ngOnInit() {
    await this.carregarDades();
  }

  async carregarDades() {
    // 1. Obtenim l'ID del professor loguejat
    const usuari = this.serveiAuth.usuarioInfo;

    if (usuari && usuari.id) {
      // 2. Preguntem al servei per la classe on és tutor
      const classe = await this.serveiClasses.obtenirClasseTutor(usuari.id);
      this.classeTrobada.set(classe);

      // 3. Mètode segur (Fase 2): Descarreguem NOMÉS els usuaris que són alumnes des del Backend
      // Ens estalviem descarregar centenars de pares d'alumnes i administradors que no necessitem aquí.
      const nomesAlumnesSegurs = await this.serveiUsuaris.getUsuarisPerRol('Alumne');
      this.alumnesDisponibles.set(nomesAlumnesSegurs);

      // 4. Filtrem només els que pertanyen a AQUESTA classe usant un bucle primitiu
      if (classe) {
        const elsMeusAlumnes: Usuari[] = [];
        for (let j = 0; j < nomesAlumnesSegurs.length; j++) {
          if (nomesAlumnesSegurs[j].id_classe === classe.id) {
            elsMeusAlumnes.push(nomesAlumnesSegurs[j]);
          }
        }
        this.alumnesDeLaClasse.set(elsMeusAlumnes);
      }
    }
  }

  async afegirAlumneAClasse(email: string) {
    const classe = this.classeTrobada();
    if (classe) {
      await this.serveiClasses.assignarAlumnes(classe.id, [email]);
      alert('Alumne afegit correctament a la llista.');
      await this.carregarDades(); // Actualitzem la vista
    }
  }

  async treureAlumneDeClasse(alumne: Usuari) {
    const classe = this.classeTrobada();
    if (confirm(`Estàs segur de treure a ${alumne.nom} de la classe?`)) {
      await this.serveiClasses.treureAlumne(classe!.id, alumne.id);
      alert('Alumne tret de la classe.');
      await this.carregarDades(); // Actualitzem la vista
    }
  }

  hiHaResultats(): boolean {
    const llista = this.alumnesDisponibles();
    const cerca = this.cercaAlumne.toLowerCase();

    if (!llista || !Array.isArray(llista)) return false;

    for (let i = 0; i < llista.length; i++) {
      const nom = llista[i].nom.toLowerCase();
      const email = llista[i].email.toLowerCase();
      if (nom.includes(cerca) || email.includes(cerca)) {
        return true;
      }
    }
    return false;
  }
}
