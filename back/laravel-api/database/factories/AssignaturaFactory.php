<?php

namespace Database\Factories;

use App\Models\Assignatura;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssignaturaFactory extends Factory
{
    protected $model = Assignatura::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->word() . ' ' . fake()->randomElement(['I', 'II', 'III']),
            'interval' => 1,
            'exempcio' => false,
            'hores_1r_trimestre' => 66,
            'hores_2n_trimestre' => 66,
            'hores_3r_trimestre' => 66,
        ];
    }
}
