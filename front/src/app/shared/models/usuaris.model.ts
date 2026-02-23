export interface Usuari {
  id: number;
  nom: string;
  cognom: string;
  rol: string;
  email: string;
  email_pares: string | null;
  password?: string;
  token: string | null;
  nfc_id: string | null;
  id_curs: number | null;
  horari_guardies: string | null;
  google_id: string | null;
  created_at: string;
  updated_at: string;
}
