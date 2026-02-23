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
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Aplicacions Web',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Muntatge i manteniment',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Xarxes Locals',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Tutoria',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'DIG + SOS',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'SOM',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'IPO1',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Ofimàtica',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Anglès',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'SOX',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-06-14']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'IPO2',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-03-13']]),
                'exempcio' => true,
            ],
            [
                'nom' => 'Serveis de Xarxes',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-06-14']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Seguretat',
                'projecte' => false,
                'interval' => json_encode([['data_ini' => '2025-09-12', 'data_fi' => '2026-06-14']]),
                'exempcio' => false,
            ],
            [
                'nom' => 'Projecte',
                'projecte' => true,
                'interval' => json_encode([['data_ini' => '2026-03-14', 'data_fi' => '2026-06-14']]),
                'exempcio' => false,
            ],
        ]);
    }
}
