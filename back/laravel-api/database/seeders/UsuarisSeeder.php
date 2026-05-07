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
                'horari_guardies' => null,
                'data_naixement' => null
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
                'horari_guardies' => null,
                'data_naixement' => null
            ],
            [
                'id' => 3,
                'nom' => 'Marcos López',
                'cognom' => null,
                'rol' => 'Alumne',
                'email' => 'a23mlopez.pruebas@inspedralbes.cat',
                'email_pares' => null,
                'password' => null,
                'token' => null,
                'nfc_id' => null,
                'id_classe' => null,
                'horari_guardies' => null,
                'data_naixement' => '2005-05-03'
            ],
            [
                'id' => 4,
                'nom' => 'Noelia García',
                'cognom' => null,
                'rol' => 'Alumne',
                'email' => 'a23ngarcia.pruebas@inspedralbes.cat',
                'email_pares' => null,
                'password' => null,
                'token' => null,
                'nfc_id' => null,
                'id_classe' => null,
                'horari_guardies' => null,
                'data_naixement' => '1999-05-03'
            ],
            [
                'id' => 10,
                'nom' => 'Test Professor',
                'cognom' => 'TENFE',
                'rol' => 'Profe',
                'email' => 'testprofe@inspedralbes.cat',
                'email_pares' => null,
                'password' => null,
                'token' => null,
                'nfc_id' => null,
                'id_classe' => null,
                'horari_guardies' => null,
                'data_naixement' => null
            ],
            [
                'id' => 11,
                'nom' => 'Test Alumne',
                'cognom' => 'TENFE',
                'rol' => 'Alumne',
                'email' => 'testalumne@inspedralbes.cat',
                'email_pares' => 'pares@inspedralbes.cat',
                'password' => null,
                'token' => null,
                'nfc_id' => null,
                'id_classe' => null,
                'horari_guardies' => null,
                'data_naixement' => '2000-01-01'
            ]
        ]);

        // Sincronitza la seqüència en PostgreSQL després del Seed
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("SELECT setval(pg_get_serial_sequence('usuaris', 'id'), coalesce(max(id),0) + 1, false) FROM usuaris;");
        }
    }
}
