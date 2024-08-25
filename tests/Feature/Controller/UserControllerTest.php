<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($this->admin);
    }

    // TESTS storeNewUser:
    public function test_successful_user_creation()
    {
        $newUser = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'user',
        ];

        $response = $this->postJson('/api/register', $newUser);

        $response->assertStatus(201);
        $response->assertJson([
            'message' => 'User registered successfully',
        ]);
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'name' => 'John Doe',
            'role' => 'user',
        ]);
    }

    public function test_email_already_in_use()
    {
        User::factory()->create([
            'email' => 'john@example.com',
        ]);

        $user2 = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'user',
        ];

        $response = $this->postJson('/api/register', $user2);

        $response->assertStatus(409);
        $response->assertJson([
            'message' => 'Email already in use!'
        ]);
        $this->assertDatabaseMissing('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'role' => 'user',
        ]);
    }

    public function test_validation_failures()
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => 'password123',
            'password_confirmation' => 'wrongpassword',
            'role' => 'invalidrole',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors([
            'name',
            'email',
            'password',
            'role'
        ]);
        $this->assertDatabaseMissing('users', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => 'password123',
            'role' => 'invalidrole',
        ]);
    }

    public function test_password_confirmation_and_strength()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
            'role' => 'user',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }

    // TESTS getAllUsers:
    public function test_get_all_users()
    {
        User::factory()->count(10)->create();
        $response = $this->get('/api/users');

        $response->assertStatus(200);
        $response->assertJsonCount(11);
    }

    // TESTS destroyUserById
    public function test_delete_user_by_id_successfully()
    {
        $user = User::factory()->create();

        $response = $this->deleteJson('/api/users/' . $user->id);

        $response->assertStatus(200);
        $response->assertJson(['message' => 'User deleted successfully']);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_delete_user_by_not_found_id()
    {
        $response = $this->deleteJson('/api/users/999');

        $response->assertStatus(404);
        $response->assertJson(['message' => 'User not found']);
    }

    // TESTS updatePassword
    public function test_update_password_successfully()
    {
        $user = User::factory()->create();

        $response = $this->putJson('/api/newpassword/' . $user->id, [
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123'
        ]);

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Password updated successfully']);

        $user->refresh();
        $this->assertTrue(Hash::check('newpassword123', $user->password));
    }

    public function test_update_password_not_found_user()
    {
        $response = $this->putJson('/api/newpassword/999', [
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123'
        ]);

        $response->assertStatus(404);
    }

    // TESTS updateRole
    public function test_update_user_role_successfully()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->putJson('/api/userrole/' . $user->id, [
            'role' => 'admin',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['message' => 'User role updated successfully']);

        $user->refresh();
        $this->assertEquals('admin', $user->role);
    }

    public function test_update_user_role_not_found_user()
    {
        $response = $this->putJson('/api/userrole/999', [
            'role' => 'admin',
        ]);

        $response->assertStatus(404);
    }
}
