<?php

namespace Tests\Feature\Groceries;

use Tests\TestCase;
use App\Models\User;

class AllOrdersTest extends TestCase
{
    public function test_the_application_returns_a_successful_response(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->actingAs($user);

        $response = $this->get('/allOrders');

        $response->assertStatus(200);
    }

    
}
