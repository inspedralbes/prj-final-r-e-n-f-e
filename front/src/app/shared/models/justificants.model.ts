export interface Justificant {
  id: number;
  id_alum: number;
  id_assistencia_ini: number;
  id_assistencia_fi: number;
  comentari: string | null;
  document: string | null;
  acceptada: boolean;
  created_at: string;
  updated_at: string;
}
