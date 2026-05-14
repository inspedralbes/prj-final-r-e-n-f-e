<?php

namespace Database\Factories;

use App\Models\Assistencia;
use App\Models\Inscrit;
use App\Models\Usuari;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssistenciaFactory extends Factory
{
    protected $model = Assistencia::class;

    public function definition(): array
    {
        return [
            'id_inscripcio' => Inscrit::factory(),
            'data' => now()->format('Y-m-d'),
            'estat' => fake()->randomElement(['Assistit', 'Falta', 'Retard', 'Justificada']),
            'id_profe' => Usuari::factory(),
        ];
    }
}
