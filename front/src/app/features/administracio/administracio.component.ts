import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-administracio',
    imports: [CommonModule, RouterModule],
    templateUrl: './administracio.component.html',
    styleUrl: './administracio.component.css'
})
export class AdministracioComponent {
    
  titolPagina: string = 'Resum General'; 

  constructor(private router: Router) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.actualitzarTitol(event.urlAfterRedirects);
      }
    });
  }


  actualitzarTitol(url: string) {
    if (url.includes('gestio-cicles')) {
      this.titolPagina = 'Gestió de Cicles Formatius';
    } else if (url.includes('crear-cicle')) {
      this.titolPagina = 'Crear un Nou Cicle';
    } else if (url.includes('editar-cicle')) {
      this.titolPagina = 'Edició de Cicle';
    } else if (url.includes('gestio-usuaris')) {
      this.titolPagina = "Gestió d'Usuaris";
    } else if (url.includes('parametres')) {
      this.titolPagina = 'Paràmetres del Sistema';
    } else {

      this.titolPagina = 'Resum General';
    }
  }
}
