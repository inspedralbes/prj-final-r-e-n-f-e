import { Assignatura } from './assignatura.model';
import { Usuari } from './usuaris.model';

export interface Inscrit {
  id?: number;
  id_alumne: number;
  id_assignatura: number;
  id_horari?: number | null; // Vincle granular amb la franja

  alumne?: Usuari;
  assignatura?: Assignatura;

  created_at?: string;
  updated_at?: string;
}
