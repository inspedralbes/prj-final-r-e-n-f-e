<?php

namespace Database\Factories;

use App\Models\Classe;
use App\Models\Curs;
use App\Models\Usuari;
use App\Models\Aula;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClasseFactory extends Factory
{
    protected $model = Classe::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->bothify('??#'),
            'id_curs' => Curs::factory(),
            'id_tutor' => Usuari::factory(),
            'id_aula' => Aula::factory(),
        ];
    }
}
