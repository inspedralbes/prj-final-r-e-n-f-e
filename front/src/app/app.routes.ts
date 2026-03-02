import { Routes } from '@angular/router';
import { AlumnesComponent } from './features/alumnes/alumnes.component';
import { ProfessorsComponent } from './features/professors/professors.component';
import { AdministracioComponent } from './features/administracio/administracio.component';
import { LoginComponent } from './features/login/login.component';
import { LlistaClasseComponent } from './features/professors/llista-classe/llista-classe.component';
import { LlistaAssignaturesComponent } from './features/professors/llista-assignatures/llista-assignatures.component';
import { CrearCicleComponent } from './features/administracio/crear-cicle/crear-cicle.component';
import { GestioCiclesComponent } from './features/administracio/gestio-cicles/gestio-cicles.component'
import { TaulerInicialComponent } from './features/administracio/tauler-inicial/tauler-inicial.component';
import { CrearPeriodeComponent } from './features/administracio/crear-periode/crear-periode.component';
import { GestioPeriodesComponent } from './features/administracio/gestio-periodes/gestio-periodes.component';
import { GestioUsuarisComponent } from './features/administracio/gestio-usuaris/gestio-usuaris.component';
import { CrearUsuariComponent } from './features/administracio/crear-usuari/crear-usuari.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'alumnes', component: AlumnesComponent },
  { path: 'professors', component: ProfessorsComponent },
  { path: 'llista-classe', component: LlistaClasseComponent },
  { path: 'llista-assignatures', component: LlistaAssignaturesComponent },

  {
    path: 'administracio',
    component: AdministracioComponent,
    children: [
      { path: '', redirectTo: 'tauler', pathMatch: 'full' },
      
      { path: 'tauler', component: TaulerInicialComponent },
      { path: 'gestio-cicles', component: GestioCiclesComponent },
      { path: 'crear-cicle', component: CrearCicleComponent },
      { path: 'editar-cicle/:id', component: CrearCicleComponent },
      { path: 'gestio-periodes', component: GestioPeriodesComponent},
      { path: 'crear-periode', component: CrearPeriodeComponent },
      { path: 'editar-periode/:id', component: CrearPeriodeComponent },
      { path: 'gestio-usuaris', component: GestioUsuarisComponent },
      { path: 'crear-usuari', component: CrearUsuariComponent },
      { path: 'editar-usuari/:id', component: CrearUsuariComponent },
    ]
  }


];
