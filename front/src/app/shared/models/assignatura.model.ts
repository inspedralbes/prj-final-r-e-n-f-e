export interface Assignatura {
  id: number;
  nom: string;
  created_at: string;
  updated_at: string;
  interval?: string;
  exempcio?: boolean;
  id_classe_projecte: number;
}
