import { Assignatura } from './assignatura.model';
import { Classe } from './classe.model';
import { Aula } from './aula.model';

export interface Horari {
  id?: number;
  codi_hora: string;
  id_assig: number;
  id_classe: number;
  id_aula: number;

  assignatura?: Assignatura;
  classe?: Classe;
  aula?: Aula;

  created_at?: string;
  updated_at?: string;
}
