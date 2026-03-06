import { Assignatura } from './assignatura.model';
import { Classe } from './classe.model';
import { Aula } from './aula.model';
import { Usuari } from './usuaris.model';
import { Inscrit } from './inscrits.model';

export interface Horari {
  id?: number;
  codi_hora: string;
  id_assig: number;
  id_classe: number;
  id_aula: number;
  id_professor?: number; // Nou camp (Tasca 3)

  assignatura?: Assignatura;
  classe?: Classe;
  aula?: Aula;
  professor?: Usuari; // Relació amb el profe
  inscrits?: Inscrit[]; // Alumnes en aquesta franja horària

  created_at?: string;
  updated_at?: string;
}
