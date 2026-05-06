<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class JustificantsSeeder extends Seeder
{
    public function run(): void
    {
        // Suponiendo que existen usuaris con id 1 y 2
        DB::table('justificants')->insert([
            [
                'id_alum' => 1,
                'fecha_inici' => '2026-04-02',
                'fecha_fi' => '2026-04-04',
                'comentari' => 'Justificant de prova per alumne 1',
                'document' => null,
                'estat' => 'Pendent',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_alum' => 2,
                'fecha_inici' => '2026-04-03',
                'fecha_fi' => '2026-04-05',
                'comentari' => 'Justificant de prova per alumne 2',
                'document' => null,
                'estat' => 'Acceptada',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_alum' => 11,
                'fecha_inici' => '2026-05-01',
                'fecha_fi' => '2026-05-02',
                'comentari' => 'Grip de 2 dies (Pendent)',
                'document' => null,
                'estat' => 'Pendent',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_alum' => 11,
                'fecha_inici' => '2026-04-20',
                'fecha_fi' => '2026-04-20',
                'comentari' => 'Visita metge (Rebutjada)',
                'document' => null,
                'estat' => 'Rebutjada',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
