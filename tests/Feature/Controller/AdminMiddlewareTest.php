<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_redirects_to_login_if_user_is_not_admin()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        // protected admin-route
        $response = $this->get('/groceries');

        $response->assertStatus(302);
        $response->assertRedirect('/login');
    }

    public function test_allows_access_if_user_is_admin()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        // protected admin-route
        $response = $this->get('/groceries');

        $response->assertStatus(200);
    }

    public function test_redirects_to_login_if_not_authenticated()
    {
        // protected admin-route
        $response = $this->get('/groceries');

        $response->assertStatus(302);
        $response->assertRedirect('/login');
    }
}
