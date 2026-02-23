<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class AulesSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('aules')->exists()) {
            return;
        }

        DB::table('aules')->insert([
            [
                'nom' => 'INFO-1'
            ],
            [
                'nom' => 'INFO-2'
            ],
            [
                'nom' => 'INFO-3'
            ],
            [
                'nom' => 'INFO-4'
            ],
            [
                'nom' => 'INFO-6'
            ],
            [
                'nom' => 'INFO-12'
            ],
            [
                'nom' => 'INFO-9'
            ],
            [
                'nom' => 'INFO-11'
            ],
            [
                'nom' => 'INFO-10'
            ],
            [
                'nom' => 'INFO-8'
            ],
            [
                'nom' => 'INFO-7'
            ]
        ]);
    }
}