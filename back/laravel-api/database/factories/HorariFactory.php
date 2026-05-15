<?php

namespace Database\Factories;

use App\Models\Horari;
use App\Models\Assignatura;
use App\Models\Classe;
use App\Models\Aula;
use App\Models\Usuari;
use Illuminate\Database\Eloquent\Factories\Factory;

class HorariFactory extends Factory
{
    protected $model = Horari::class;

    public function definition(): array
    {
        return [
            'codi_hora' => fake()->numberBetween(1, 6),
            'id_assig' => Assignatura::factory(),
            'id_classe' => Classe::factory(),
            'id_aula' => Aula::factory(),
            'id_professor' => Usuari::factory(),
        ];
    }
}
