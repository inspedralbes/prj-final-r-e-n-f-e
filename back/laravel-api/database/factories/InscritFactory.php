<?php

namespace Database\Factories;

use App\Models\Inscrit;
use App\Models\Usuari;
use App\Models\Assignatura;
use App\Models\Horari;
use Illuminate\Database\Eloquent\Factories\Factory;

class InscritFactory extends Factory
{
    protected $model = Inscrit::class;

    public function definition(): array
    {
        return [
            'id_alumne' => Usuari::factory()->student(),
            'id_assignatura' => Assignatura::factory(),
            'id_horari' => Horari::factory(),
        ];
    }
}
