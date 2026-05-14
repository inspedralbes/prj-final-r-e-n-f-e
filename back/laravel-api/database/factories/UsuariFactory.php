<?php

namespace Database\Factories;

use App\Models\Usuari;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Usuari>
 */
class UsuariFactory extends Factory
{
    /**
     * The model the factory corresponds to.
     *
     * @var string
     */
    protected $model = Usuari::class;

    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => fake()->firstName(),
            'cognom' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'rol' => 'Profe', // Default role matching migration
            'data_naixement' => now()->subYears(30)->format('Y-m-d'),
        ];
    }

    /**
     * State for a student.
     */
    public function student(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol' => 'Alumne',
            'data_naixement' => now()->subYears(18)->format('Y-m-d'),
        ]);
    }

    /**
     * State for an admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol' => 'Admin',
        ]);
    }

    /**
     * State for an incomplete profile (specifically for students).
     */
    public function incomplete(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol' => 'Alumne',
            'data_naixement' => null,
        ]);
    }
}
