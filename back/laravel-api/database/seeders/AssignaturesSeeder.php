<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class AssignaturesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (DB::table('assignatures')->exists()) {
            return;
        }

        DB::table('assignatures')->insert([
            [
                'nom' => 'Programacio',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Aplicacions Web',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Muntatge i manteniment',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Xarxes Locals',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Tutoria',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'DIG + SOS',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'SOM',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'IPO1',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Ofimàtica',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Anglès',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'SOX',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-06-14']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'IPO2',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => true,
            ],
            [
                'nom' => 'Serveis de Xarxes',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-06-14']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Seguretat',
                'id_classe_projecte' => null,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-06-14']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Projecte 1SMIXA1',
                'id_classe_projecte' => 1,
                'interval' => json_encode([['data_ini' => '2026-03-14', 'data_fi' => '2026-06-14']]),
                'exempcio' => false,
            ],
        ]);
    }
}
