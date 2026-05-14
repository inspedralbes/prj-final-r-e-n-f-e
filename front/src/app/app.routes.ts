import { Routes } from '@angular/router';
import { AlumnesComponent } from './features/alumnes/alumnes.component';
import { ProfessorsComponent } from './features/professors/professors.component';
import { AdministracioComponent } from './features/administracio/administracio.component';
import { LoginComponent } from './features/login/login.component';
import { AuthCallbackComponent } from './features/login/auth-callback.component';
import { LlistaClasseComponent } from './features/professors/llista-classe/llista-classe.component';
import { LlistaAssignaturesComponent } from './features/professors/llista-assignatures/llista-assignatures.component';
import { Horaris } from './features/alumnes/horaris/horaris.component';
import { JustificantsComponent } from './features/alumnes/justificants/justificants.component';
import { LlistaFaltesComponent } from './features/professors/llista-faltes/llista-faltes.component';
import { GestioInscritsComponent } from './features/professors/gestio-classe/gestio-inscrits.component';
import { HorariAlumnesComponent } from './features/professors/horari-alumnes/horari-alumnes.component';
import { PerfilComponent } from './features/perfil/perfil.component';
import { AdminAssignaturesComponent } from './features/administracio/admin-assignatures/admin-assignatures.component';
import { AdminClassesComponent } from './features/administracio/admin-classes/admin-classes.component';
import { AdminUsuarisComponent } from './features/administracio/admin-usuaris/admin-usuaris.component';
import { AdminPeriodesComponent } from './features/administracio/admin-periodes/admin-periodes.component';
import { CompletarPerfilComponent } from './features/completar-perfil/completar-perfil.component';
import { JustificantsComponents } from './features/professors/justificants/justificants.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'completar-perfil', component: CompletarPerfilComponent, canActivate: [authGuard] },
  { path: 'profile', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'profile/:id', component: PerfilComponent, canActivate: [authGuard] },

  // Alumne routes
  { path: 'alumnes', component: AlumnesComponent, canActivate: [authGuard, roleGuard], data: { roles: ['alumne'] } },
  { path: 'alumnes/horaris', component: Horaris, canActivate: [authGuard, roleGuard], data: { roles: ['alumne'] } },
  { path: 'alumnes/justificants', component: JustificantsComponent, canActivate: [authGuard, roleGuard], data: { roles: ['alumne'] } },

  // Profe routes
  { path: 'professors', component: ProfessorsComponent, canActivate: [authGuard, roleGuard], data: { roles: ['profe'] } },
  { path: 'llista-classe', component: LlistaClasseComponent, canActivate: [authGuard, roleGuard], data: { roles: ['profe'] } },
  { path: 'llista-assignatures', component: LlistaAssignaturesComponent, canActivate: [authGuard, roleGuard], data: { roles: ['profe'] } },
  { path: 'llista-faltes', component: LlistaFaltesComponent, canActivate: [authGuard, roleGuard], data: { roles: ['profe'] } },
  { path: 'gestio-inscrits', component: GestioInscritsComponent, canActivate: [authGuard, roleGuard], data: { roles: ['profe'] } },
  { path: 'horari-alumnes', component: HorariAlumnesComponent, canActivate: [authGuard, roleGuard], data: { roles: ['profe'] } },
  { path: 'gestio-justificants', component: JustificantsComponents },

  // Admin routes
  { path: 'administracio', component: AdministracioComponent, canActivate: [authGuard, roleGuard], data: { roles: ['admin'] } },
  { path: 'admin-assignatures', component: AdminAssignaturesComponent, canActivate: [authGuard, roleGuard], data: { roles: ['admin'] } },
  { path: 'admin-classes', component: AdminClassesComponent, canActivate: [authGuard, roleGuard], data: { roles: ['admin'] } },
  { path: 'admin-usuaris', component: AdminUsuarisComponent, canActivate: [authGuard, roleGuard], data: { roles: ['admin'] } },
  { path: 'admin-periodes', component: AdminPeriodesComponent, canActivate: [authGuard, roleGuard], data: { roles: ['admin'] } },
];
