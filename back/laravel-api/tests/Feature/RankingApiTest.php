<?php

namespace Tests\Feature;

use App\Models\Assistencia;
use App\Models\Classe;
use App\Models\Inscrit;
use App\Models\Usuari;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RankingApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->tutor = Usuari::factory()->create(['rol' => 'Profe']);
        $this->classe = Classe::factory()->create(['id_tutor' => $this->tutor->id]);
        
        // Student 1: 5 absences
        $this->student1 = Usuari::factory()->student()->create(['id_classe' => $this->classe->id]);
        $inscrit1 = Inscrit::factory()->create(['id_alumne' => $this->student1->id]);
        Assistencia::factory()->count(5)->create([
            'id_inscripcio' => $inscrit1->id,
            'estat' => 'Falta'
        ]);
        
        // Student 2: 2 absences
        $this->student2 = Usuari::factory()->student()->create(['id_classe' => $this->classe->id]);
        $inscrit2 = Inscrit::factory()->create(['id_alumne' => $this->student2->id]);
        Assistencia::factory()->count(2)->create([
            'id_inscripcio' => $inscrit2->id,
            'estat' => 'Falta'
        ]);
    }

    /** @test */
    public function it_returns_correct_ranking_for_a_class()
    {
        Sanctum::actingAs($this->tutor);

        $response = $this->getJson("/api/v1/assistencies/classe/{$this->classe->id}/ranking");

        $response->assertStatus(200)
                 ->assertJsonPath('data.0.id', $this->student1->id)
                 ->assertJsonPath('data.0.total_faltes', 5)
                 ->assertJsonPath('data.1.id', $this->student2->id)
                 ->assertJsonPath('data.1.total_faltes', 2);
    }
}
