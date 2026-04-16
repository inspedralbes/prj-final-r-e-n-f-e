<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssignarClassesUsuarisSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('usuaris')
            ->where('id', 3)
            ->update(['id_classe' => 1]);

        DB::table('usuaris')
            ->where('id', 4)
            ->update(['id_classe' => 1]);
    }
}
