import { Usuari } from './usuaris.model';

export interface Justificant {
  id: number;
  id_alum: number;
  data_inici: string;
  data_fi: string;
  comentari: string | null;
  document: string | null;
  estat: 'Pendent' | 'Acceptada' | 'Rebutjada';
  created_at: string;
  updated_at: string;
}

export interface JustificantNet {
  alumne: Partial<Usuari>;
  justificants: Partial<Justificant>[];
}
