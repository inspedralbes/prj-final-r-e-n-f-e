<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SimularClasseSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('classes')->where('id', 14)->value('id_tutor') === 6) {
            return;
        }

        DB::table('classes')
            ->where('id', 14)
            ->update(['id_tutor' => 6]);

        $noms = ['Marc', 'Alex', 'Pau', 'Jordi', 'Laura', 'Marta', 'Clara', 'Erik', 'Jan', 'Arnau', 'Pol', 'Ona', 'Nil', 'Berta', 'Ivan', 'Laia', 'Hugo', 'Carla', 'Lucas', 'Aina'];
        $cognoms = ['Garcia', 'Martínez', 'López', 'Sánchez', 'Pérez', 'González', 'Fernández', 'Rodríguez', 'Ruiz', 'Vidal', 'Serra', 'Puig', 'Camps', 'Font', 'Soler', 'Roca', 'Vila', 'Rovira', 'Grau', 'Costa'];

        $dataStart = strtotime('1995-01-01');
        $dataEnd = strtotime('2007-12-31');

        $alumnes = [];
        $emailsUsats = [];

        for ($i = 0; $i < 25; $i++) {
            $nom = $noms[array_rand($noms)];
            $cognom1 = $cognoms[array_rand($cognoms)];
            $cognom2 = $cognoms[array_rand($cognoms)];

            $prefix = strtolower(substr($nom, 0, 3) . substr($cognom1, 0, 3) . substr($cognom2, 0, 3));
            $numero = str_pad(random_int(20, 25), 2, '0', STR_PAD_LEFT);
            $email = $prefix . 'a' . $numero . '@inspedralbes.cat';

            $contador = 1;
            while (in_array($email, $emailsUsats)) {
                $email = $prefix . 'a' . $numero . '_' . $contador . '@inspedralbes.cat';
                $contador++;
            }
            $emailsUsats[] = $email;

            $alumnes[] = [
                'nom' => $nom,
                'cognom' => $cognom1 . ' ' . $cognom2,
                'rol' => 'Alumne',
                'email' => $email,
                'email_pares' => null,
                'password' => null,
                'token' => null,
                'nfc_id' => null,
                'id_classe' => 14,
                'horari_guardies' => null,
                'data_naixement' => date('Y-m-d', mt_rand($dataStart, $dataEnd)),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach (array_chunk($alumnes, 10) as $batch) {
            DB::table('usuaris')->insert($batch);
        }

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("SELECT setval(pg_get_serial_sequence('usuaris', 'id'), coalesce(max(id),0) + 1, false) FROM usuaris;");
        }

        $nousAlumnes = DB::table('usuaris')
            ->where('id_classe', 14)
            ->where('nom', '!=', 'Test Alumne')
            ->orderBy('id')
            ->get();

        $horarisData = [
            ['codi_hora' => 'L1', 'id_assig' => 1, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 6],
            ['codi_hora' => 'L2', 'id_assig' => 1, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 6],
            ['codi_hora' => 'L3', 'id_assig' => 3, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 1],
            ['codi_hora' => 'L4', 'id_assig' => 3, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 1],
            ['codi_hora' => 'L5', 'id_assig' => 8, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 5],
            ['codi_hora' => 'L6', 'id_assig' => 8, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 5],
            ['codi_hora' => 'M1', 'id_assig' => 2, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 6],
            ['codi_hora' => 'M2', 'id_assig' => 2, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 6],
            ['codi_hora' => 'M3', 'id_assig' => 3, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 1],
            ['codi_hora' => 'M4', 'id_assig' => 3, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 1],
            ['codi_hora' => 'M5', 'id_assig' => 8, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 5],
            ['codi_hora' => 'M6', 'id_assig' => 7, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 6],
            ['codi_hora' => 'X1', 'id_assig' => 4, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 1],
            ['codi_hora' => 'X2', 'id_assig' => 4, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 1],
            ['codi_hora' => 'X3', 'id_assig' => 5, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 6],
            ['codi_hora' => 'X4', 'id_assig' => 9, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 1],
            ['codi_hora' => 'X5', 'id_assig' => 9, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 1],
            ['codi_hora' => 'J1', 'id_assig' => 4, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 1],
            ['codi_hora' => 'J2', 'id_assig' => 4, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 1],
            ['codi_hora' => 'J3', 'id_assig' => 6, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 6],
            ['codi_hora' => 'J4', 'id_assig' => 6, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 6],
            ['codi_hora' => 'J5', 'id_assig' => 10, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 1],
            ['codi_hora' => 'V1', 'id_assig' => 9, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 5],
            ['codi_hora' => 'V2', 'id_assig' => 1, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 6],
            ['codi_hora' => 'V3', 'id_assig' => 7, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 6],
            ['codi_hora' => 'V4', 'id_assig' => 7, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 6],
            ['codi_hora' => 'V5', 'id_assig' => 10, 'id_classe' => 14, 'id_aula' => 11, 'id_professor' => 1],
        ];

        $horariIds = [];
        foreach ($horarisData as $horari) {
            $horari['created_at'] = now();
            $horari['updated_at'] = now();
            $id = DB::table('horaris')->insertGetId($horari);
            $horariIds[$horari['codi_hora']] = $id;
        }

        $mapaAssignaturaHorari = [
            1 => 'L1',
            2 => 'M1',
            3 => 'L3',
            4 => 'X1',
            5 => 'X3',
            6 => 'J3',
            7 => 'M6',
            8 => 'L5',
            9 => 'X4',
            10 => 'J5',
        ];

        $inscrits = [];
        foreach ($nousAlumnes as $alumne) {
            foreach ($mapaAssignaturaHorari as $idAssig => $codiHora) {
                $inscrits[] = [
                    'id_alumne' => $alumne->id,
                    'id_assignatura' => $idAssig,
                    'id_horari' => $horariIds[$codiHora],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($inscrits, 50) as $batch) {
            DB::table('inscrits')->insert($batch);
        }
    }
}
