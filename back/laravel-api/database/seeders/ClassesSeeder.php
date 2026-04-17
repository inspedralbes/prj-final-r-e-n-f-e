<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class ClassesSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('classes')->exists()) {
            return;
        }

        DB::table('classes')->insert([
            [
                'id_curs' => 1,
                'nom' => '1SMIXA1',
                'id_tutor' => 1,
                'id_aula' => 1
            ],
            [
                'id_curs' => 1,
                'nom' => '1SMIXA2',
                'id_tutor' => null,
                'id_aula' => 2
            ],
            [
                'id_curs' => 1,
                'nom' => '1SMIXA3',
                'id_tutor' => null,
                'id_aula' => 3
            ],
            [
                'id_curs' => 1,
                'nom' => '1SMIXA4',
                'id_tutor' => null,
                'id_aula' => 4
            ],
            [
                'id_curs' => 1,
                'nom' => '2SMIXA1',
                'id_tutor' => null,
                'id_aula' => 5
            ],
            [
                'id_curs' => 1,
                'nom' => '2SMIXA2',
                'id_tutor' => 2,
                'id_aula' => 6
            ],
            [
                'id_curs' => 1,
                'nom' => '2SMIXA3',
                'id_tutor' => null,
                'id_aula' => 7
            ],
            [
                'id_curs' => 1,
                'nom' => '1SMIXB',
                'id_tutor' => null,
                'id_aula' => 5
            ],
            [
                'id_curs' => 1,
                'nom' => '1SMIXB2',
                'id_tutor' => null,
                'id_aula' => 6
            ],
            [
                'id_curs' => 1,
                'nom' => '2SMIXB',
                'id_tutor' => null,
                'id_aula' => 7
            ],
            [
                'id_curs' => 2,
                'nom' => '1DAM',
                'id_tutor' => null,
                'id_aula' => 8
            ],
            [
                'id_curs' => 3,
                'nom' => '1DAW',
                'id_tutor' => null,
                'id_aula' => 9
            ],
            [
                'id_curs' => 2,
                'nom' => '2DAM',
                'id_tutor' => null,
                'id_aula' => 10
            ],
            [
                'id_curs' => 3,
                'nom' => '2DAW',
                'id_tutor' => null,
                'id_aula' => 11
            ]
        ]);
    }
}
