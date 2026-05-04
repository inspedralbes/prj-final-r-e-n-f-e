<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_health_check_endpoint(): void
    {
        $response = $this->get('/api/v1/health');

        $response->assertStatus(200)
                 ->assertJson(['status' => 'ok']);
    }
}
