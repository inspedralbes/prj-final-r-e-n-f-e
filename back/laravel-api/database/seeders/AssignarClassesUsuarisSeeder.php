<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssignarClassesUsuarisSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('usuaris')
            ->whereIn('id', [3, 4, 11])
            ->update(['id_classe' => 1]);
    }
}
