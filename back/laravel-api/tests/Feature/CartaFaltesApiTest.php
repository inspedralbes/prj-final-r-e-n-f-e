<?php

namespace Tests\Feature;

use App\Models\Classe;
use App\Models\Usuari;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CartaFaltesApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->tutor = Usuari::factory()->create(['rol' => 'Profe']);
        $this->classe = Classe::factory()->create(['id_tutor' => $this->tutor->id]);
        $this->student = Usuari::factory()->student()->create([
            'id_classe' => $this->classe->id,
            'data_naixement' => '2005-01-01', // Underage
        ]);
        
        // Mock Node API
        Http::fake([
            '*/api/convert/word-to-pdf' => Http::response('fake pdf content', 200),
        ]);
        
        // Ensure template directory exists (should exist in repo)
        if (!file_exists(base_path('templates-word'))) {
            mkdir(base_path('templates-word'), 0755, true);
        }
        
        if (!file_exists(base_path('templates-word/info-words.json'))) {
            file_put_contents(base_path('templates-word/info-words.json'), json_encode(['NomCognomDireccio' => 'Test Address']));
        }
    }

    /** @test */
    public function it_can_generate_a_letter_with_auto_tutor_resolution()
    {
        Sanctum::actingAs($this->tutor);

        $response = $this->postJson('/api/v1/carta-faltes/generar', [
            'id_alumne' => $this->student->id,
            'faltes' => 30,
        ]);

        // Note: The actual TemplateProcessor might fail with 'dummy content' 
        // if it tries to parse it as a real zip/docx. 
        // For a more robust test, we might need a minimal real .docx or mock TemplateProcessor.
        
        // Let's see what happens.
        $response->assertStatus(200);
        $this->assertEquals('application/pdf', $response->headers->get('Content-Type'));
    }

    /** @test */
    public function it_fails_if_student_has_no_class()
    {
        Sanctum::actingAs($this->tutor);
        
        $studentWithoutClass = Usuari::factory()->student()->create(['id_classe' => null]);

        $response = $this->postJson('/api/v1/carta-faltes/generar', [
            'id_alumne' => $studentWithoutClass->id,
            'faltes' => 30,
        ]);

        $response->assertStatus(400)
                 ->assertJson(['success' => false]);
    }
}
