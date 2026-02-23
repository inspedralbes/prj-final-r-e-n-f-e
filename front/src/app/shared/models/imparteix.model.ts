import { Assignatura } from './assignatura.model';
import { Usuari } from './usuaris.model';

export interface Imparteix {
  id?: number;
  id_profe: number;
  id_assignatura: number;
  titular: boolean;

  professor?: Usuari;
  assignatura?: Assignatura;

  created_at?: string;
  updated_at?: string;
}
