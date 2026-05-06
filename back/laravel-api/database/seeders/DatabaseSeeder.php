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
            // Taules depenents
            CursSeeder::class,       // depende de: usuaris, periodes
            ClassesSeeder::class,    // depende de: cursos, usuaris
            AssignarClassesUsuarisSeeder::class, // Assigna classes als alumnes
            AssignaturesSeeder::class,  // depende de: classes
            HorarisSeeder::class,    // depende de: assignatures, classes, aules
            JustificantsSeeder::class,
        ]);
    }
}
