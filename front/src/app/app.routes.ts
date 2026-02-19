import { Routes } from '@angular/router';
import { AlumnesComponent } from './features/alumnes/alumnes.component';
import { ProfessorsComponent } from './features/professors/professors.component';
import { AdministracioComponent } from './features/administracio/administracio.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'alumnes', component: AlumnesComponent },
    { path: 'professors', component: ProfessorsComponent },
    { path: 'administracio', component: AdministracioComponent },
];
