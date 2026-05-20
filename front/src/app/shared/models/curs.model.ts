export interface Curs {
  id: number;
  tipus: 'GM' | 'GS';
  nom: string;
  id_tutor: number | null;
  id_periode: number | null;
  created_at: string;
  updated_at: string;

  // Relacions opcionals (venen de l'Eager Loading de Laravel)
  tutor?: any;
  periode?: any;
}
