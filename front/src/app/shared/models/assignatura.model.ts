export interface Assignatura {
  id: number;
  nom: string;
  created_at: string;
  updated_at: string;
  interval?: string;
  exempcio?: boolean;
  id_classe_projecte: number;
  hores_1r_trimestre?: number;
  hores_2n_trimestre?: number;
  hores_3r_trimestre?: number;
}
