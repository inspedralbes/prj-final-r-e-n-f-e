<?php

namespace Tests\Feature;

use App\Models\Assistencia;
use App\Models\Inscrit;
use App\Models\Usuari;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AssistenciaApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a teacher user
        $this->user = Usuari::factory()->create([
            'rol' => 'Profe',
            'data_naixement' => '1990-01-01', // Complete profile
        ]);
    }

    /** @test */
    public function it_can_list_assistances()
    {
        Sanctum::actingAs($this->user);

        Assistencia::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/assistencies');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function it_can_create_an_assistance_record()
    {
        Sanctum::actingAs($this->user);

        $inscrit = Inscrit::factory()->create();

        $data = [
            'id_inscripcio' => $inscrit->id,
            'data' => now()->format('Y-m-d'),
            'estat' => 'Falta',
            'id_profe' => $this->user->id,
        ];

        $response = $this->postJson('/api/v1/assistencies', $data);

        $response->assertStatus(201)
                 ->assertJsonPath('data.estat', 'Falta');

        $this->assertDatabaseHas('assistencies', [
            'id_inscripcio' => $inscrit->id,
            'estat' => 'Falta',
        ]);
    }

    /** @test */
    public function it_can_update_an_assistance_record()
    {
        Sanctum::actingAs($this->user);

        $assistance = Assistencia::factory()->create(['estat' => 'Assistit']);

        $response = $this->putJson("/api/v1/assistencies/{$assistance->id}", [
            'estat' => 'Retard',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.estat', 'Retard');

        $this->assertDatabaseHas('assistencies', [
            'id' => $assistance->id,
            'estat' => 'Retard',
        ]);
    }

    /** @test */
    public function it_denies_access_to_unauthenticated_users()
    {
        $response = $this->getJson('/api/v1/assistencies');

        $response->assertStatus(401);
    }
}
