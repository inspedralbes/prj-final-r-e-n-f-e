<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class UsuarisSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('usuaris')->exists()) {
            return;
        }

        DB::table('usuaris')->insert([
            [
                'id' => 1,
                'nom' => 'Susana Bajo',
                'cognom' => null,
                'rol' => 'Profe',
                'email' => 'sbajo.pruebas@inspedralbes.cat',
                'email_pares' => null,
                'password' => null,
                'token' => null,
                'nfc_id' => null,
                'id_classe' => null,
                'horari_guardies' => null
            ],
            [
                'id' => 2,
                'nom' => 'Victoria Rey',
                'cognom' => null,
                'rol' => 'Profe',
                'email' => 'vrey.pruebas@inspedralbes.cat',
                'email_pares' => null,
                'password' => null,
                'token' => null,
                'nfc_id' => null,
                'id_classe' => null,
                'horari_guardies' => null
            ],
            [
                'id' => 3,
                'nom' => 'Marcos López',
                'cognom' => null,
                'rol' => 'Alumne',
                'email' => 'mlopez.pruebas@inspedralbes.cat',
                'email_pares' => null,
                'password' => null,
                'token' => null,
                'nfc_id' => null,
                'id_classe' => null,
                'horari_guardies' => null
            ],
            [
                'id' => 4,
                'nom' => 'Noelia García',
                'cognom' => null,
                'rol' => 'Alumne',
                'email' => 'ngarcia.pruebas@inspedralbes.cat',
                'email_pares' => null,
                'password' => null,
                'token' => null,
                'nfc_id' => null,
                'id_classe' => null,
                'horari_guardies' => null
            ]
        ]);
    }
}
