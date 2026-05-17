<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class PeriodesSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('periodes')->exists()) {
            return;
        }

        DB::table('periodes')->insert([
        //SMIX
        [
            'trimestre_1_ini' => '2025-09-12', 
            'trimestre_1_fi' => '2025-12-12', 
            'trimestre_2_ini' => '2025-12-13', 
            'trimestre_2_fi' => '2026-03-13', 
            'trimestre_3_ini' => '2026-03-14', 
            'trimestre_3_fi' => '2026-06-14'
        ],
        //DAM
        [
            'trimestre_1_ini' => '2025-09-12', 
            'trimestre_1_fi' => '2025-12-12', 
            'trimestre_2_ini' => '2025-12-13', 
            'trimestre_2_fi' => '2026-03-13', 
            'trimestre_3_ini' => '2026-03-14', 
            'trimestre_3_fi' => '2026-06-14'
        ],
        //DAW
        [
            'trimestre_1_ini' => '2025-09-12', 
            'trimestre_1_fi' => '2025-12-12', 
            'trimestre_2_ini' => '2025-12-13', 
            'trimestre_2_fi' => '2026-03-13', 
            'trimestre_3_ini' => '2026-03-14', 
            'trimestre_3_fi' => '2026-06-14'
        ],
        //ASIX
        [
            'trimestre_1_ini' => '2025-09-12', 
            'trimestre_1_fi' => '2025-12-12', 
            'trimestre_2_ini' => '2025-12-13', 
            'trimestre_2_fi' => '2026-03-13', 
            'trimestre_3_ini' => '2026-03-14', 
            'trimestre_3_fi' => '2026-06-14'
        ],
        //DAMVI
        [
            'trimestre_1_ini' => '2025-09-12', 
            'trimestre_1_fi' => '2025-12-12', 
            'trimestre_2_ini' => '2025-12-13', 
            'trimestre_2_fi' => '2026-03-13', 
            'trimestre_3_ini' => '2026-03-14', 
            'trimestre_3_fi' => '2026-06-14'
        ],
        //A3D
        [
            'trimestre_1_ini' => '2025-09-12', 
            'trimestre_1_fi' => '2025-12-12', 
            'trimestre_2_ini' => '2025-12-13', 
            'trimestre_2_fi' => '2026-03-13', 
            'trimestre_3_ini' => '2026-03-14', 
            'trimestre_3_fi' => '2026-06-14'
        ],
    ]);
}
}
