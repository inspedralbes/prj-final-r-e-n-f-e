<?php

namespace Database\Factories;

use App\Models\Curs;
use App\Models\Usuari;
use App\Models\Periode;
use Illuminate\Database\Eloquent\Factories\Factory;

class CursFactory extends Factory
{
    protected $model = Curs::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->word(),
            'tipus' => fake()->randomElement(['GM', 'GS']),
            'id_tutor' => Usuari::factory(),
            'id_periode' => Periode::factory(),
        ];
    }
}
