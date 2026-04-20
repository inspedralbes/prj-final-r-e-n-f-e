<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class CursSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('cursos')->exists()) {
            return;
        }

        DB::table('cursos')->insert([
            [
                'tipus' => 'GM',
                'nom' => 'SMIX',
                'id_tutor' => null,
                'id_periode' => 1
            ],
            [
                'tipus' => 'GS',
                'nom' => 'DAM',
                'id_tutor' => null,
                'id_periode' => 2
            ],
            [
                'tipus' => 'GS',
                'nom' => 'DAW',
                'id_tutor' => null,
                'id_periode' => 3
            ]
        ]);
    }
}
