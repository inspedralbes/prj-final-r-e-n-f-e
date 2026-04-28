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
                'acceptada' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_alum' => 2,
                'fecha_inici' => '2026-04-03',
                'fecha_fi' => '2026-04-05',
                'comentari' => 'Justificant de prova per alumne 2',
                'document' => null,
                'acceptada' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
