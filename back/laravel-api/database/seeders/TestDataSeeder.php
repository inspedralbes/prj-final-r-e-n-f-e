<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $idAlumne = 11;
        $idAssignatura = 1; // Programacio
        $idProfe = 10;

        // Ensure the student is enrolled in the subject
        // We use insertOrIgnore or check if exists to avoid duplicates if re-running
        $exists = DB::table('inscrits')
            ->where('id_alumne', $idAlumne)
            ->where('id_assignatura', $idAssignatura)
            ->first();

        if (!$exists) {
            $inscritId = DB::table('inscrits')->insertGetId([
                'id_alumne' => $idAlumne,
                'id_assignatura' => $idAssignatura,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $inscritId = $exists->id;
        }

        // Generate some absences for this student if they don't have any
        if (DB::table('assistencies')->where('id_inscripcio', $inscritId)->count() === 0) {
            DB::table('assistencies')->insert([
                [
                    'id_inscripcio' => $inscritId,
                    'data' => '2026-04-20',
                    'estat' => 'Falta',
                    'id_profe' => $idProfe,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id_inscripcio' => $inscritId,
                    'data' => '2026-05-01',
                    'estat' => 'Falta',
                    'id_profe' => $idProfe,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id_inscripcio' => $inscritId,
                    'data' => '2026-05-02',
                    'estat' => 'Falta',
                    'id_profe' => $idProfe,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id_inscripcio' => $inscritId,
                    'data' => '2026-05-15',
                    'estat' => 'Falta',
                    'id_profe' => $idProfe,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id_inscripcio' => $inscritId,
                    'data' => '2026-05-16',
                    'estat' => 'Retard',
                    'id_profe' => $idProfe,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ]);
        }
    }
}
