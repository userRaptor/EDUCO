<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_has_fillable_attributes()
    {
        $fillable = (new User)->getFillable();
        $this->assertEquals([
            'name',
            'email',
            'password',
            'role'
        ], $fillable);
    }

    public function test_it_has_hidden_attributes()
    {
        $hidden = (new User)->getHidden();
        $this->assertEquals([
            'password',
            'remember_token'
        ], $hidden);
    }

    public function test_it_casts_attributes()
    {
        $casts = (new User)->getCasts();
        $this->assertEquals([
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'id' => 'int'
        ], $casts);
    }

    public function test_it_can_create_and_retrieve_a_user()
    {
        $user = User::factory()->create();

        $response = User::find($user->id);

        $response->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }

    public function test_it_hashes_password_when_creating_user()
    {
        $password = 'plainpassword';
        $user = User::factory()->create(['password' => bcrypt($password)]);

        $this->assertTrue(Hash::check($password, $user->password));
    }
}
