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
