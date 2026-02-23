<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Tablas sin dependencias
            UsuarisSeeder::class,
            PeriodesSeeder::class,
            AulesSeeder::class,
            AssignaturesSeeder::class,
            // Tablas que dependen de las anteriores
            CursSeeder::class,       // depende de: usuaris, periodes
            ClassesSeeder::class,    // depende de: cursos, usuaris
            HorarisSeeder::class,    // depende de: assignatures, classes, aules
        ]);
    }
}
