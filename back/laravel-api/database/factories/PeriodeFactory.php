<?php

namespace Database\Factories;

use App\Models\Periode;
use Illuminate\Database\Eloquent\Factories\Factory;

class PeriodeFactory extends Factory
{
    protected $model = Periode::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->word(),
            'actiu' => true,
            'trimestre_1_ini' => now()->startOfYear()->format('Y-m-d'),
            'trimestre_1_fi' => now()->startOfYear()->addMonths(3)->format('Y-m-d'),
            'trimestre_2_ini' => now()->startOfYear()->addMonths(4)->format('Y-m-d'),
            'trimestre_2_fi' => now()->startOfYear()->addMonths(7)->format('Y-m-d'),
            'trimestre_3_ini' => now()->startOfYear()->addMonths(8)->format('Y-m-d'),
            'trimestre_3_fi' => now()->endOfYear()->format('Y-m-d'),
        ];
    }
}
