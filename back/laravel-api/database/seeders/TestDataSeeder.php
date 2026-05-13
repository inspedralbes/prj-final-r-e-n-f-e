<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $idAlumne = 11; // testalumne@inspedralbes.cat
        $idProfe = 10;

        // Subjects configuration for the test student
        // Assuming 100 hours per subject per trimester (as per AssignaturesSeeder)
        $subjectsData = [
            1 => [ // Programacio -> 4% (Indigo/Normal)
                'absences' => ['2026-04-20', '2026-05-01', '2026-05-02', '2026-05-15'],
                'lates' => ['2026-05-16']
            ],
            2 => [ // Aplicacions Web -> 17% (Yellow/Warning)
                'absences' => array_map(fn($d) => "2026-04-" . str_pad($d, 2, '0', STR_PAD_LEFT), range(1, 17)),
                'lates' => ['2026-05-01']
            ],
            3 => [ // Muntatge i manteniment -> 25% (Red/Danger)
                'absences' => array_map(fn($d) => "2026-05-" . str_pad($d, 2, '0', STR_PAD_LEFT), range(1, 25)),
                'lates' => []
            ],
            4 => [ // Xarxes Locals -> 16% (Yellow/Warning)
                'absences' => array_map(fn($d) => "2026-05-" . str_pad($d, 2, '0', STR_PAD_LEFT), range(5, 20)),
                'lates' => ['2026-05-21']
            ],
            5 => [ // Tutoria -> 21% (Red/Danger)
                'absences' => array_map(fn($d) => "2026-04-" . str_pad($d, 2, '0', STR_PAD_LEFT), range(10, 30)),
                'lates' => []
            ],
            7 => [ // SOM -> 0% (Indigo/Normal)
                'absences' => [],
                'lates' => []
            ]
        ];

        foreach ($subjectsData as $idAssignatura => $data) {
            // 1. Ensure Enrollment
            $inscrit = DB::table('inscrits')
                ->where('id_alumne', $idAlumne)
                ->where('id_assignatura', $idAssignatura)
                ->first();

            if (!$inscrit) {
                $inscritId = DB::table('inscrits')->insertGetId([
                    'id_alumne' => $idAlumne,
                    'id_assignatura' => $idAssignatura,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $inscritId = $inscrit->id;
            }

            // 2. Generate Absences (Faltes)
            foreach ($data['absences'] as $date) {
                $exists = DB::table('assistencies')
                    ->where('id_inscripcio', $inscritId)
                    ->where('data', $date)
                    ->exists();

                if (!$exists) {
                    DB::table('assistencies')->insert([
                        'id_inscripcio' => $inscritId,
                        'data' => $date,
                        'estat' => 'Falta',
                        'id_profe' => $idProfe,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // 3. Generate Lates (Retards)
            foreach ($data['lates'] as $date) {
                $exists = DB::table('assistencies')
                    ->where('id_inscripcio', $inscritId)
                    ->where('data', $date)
                    ->exists();

                if (!$exists) {
                    DB::table('assistencies')->insert([
                        'id_inscripcio' => $inscritId,
                        'data' => $date,
                        'estat' => 'Retard',
                        'id_profe' => $idProfe,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
