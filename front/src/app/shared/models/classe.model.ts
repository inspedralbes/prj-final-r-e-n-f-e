import { Aula } from "./aula.model";
import { Curs } from "./curs.model";

export interface Classe {
    id: number;
    id_curs: number;
    nom: string;
    id_tutor: number;
    created_at: string;
    updated_at: string;

    // Relacions opcionals (venen de l'Eager Loading de Laravel)
    curs?: Curs;
    aula?: Aula;
}
