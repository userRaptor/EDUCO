<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;


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

    public function test_can_create_user()
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(User::class, $user);
        $this->assertNotNull($user->name);
        $this->assertNotNull($user->email);
        $this->assertNotNull($user->password);
        $this->assertNotNull($user->role);
    }

    public function test_password_is_hashed()
    {
        $user = User::factory()->create([
            'password' => 'plainpassword',
        ]);

        $this->assertTrue(Hash::check('plainpassword', $user->password));
    }

    public function test_user_factory_admin()
    {
        $admin = User::factory()->admin()->create();

        $this->assertEquals('admin', $admin->role);
    }

    public function test_fillable_properties()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => 'password',
            'role' => 'user',
        ]);

        $this->assertEquals('Test User', $user->name);
        $this->assertEquals('testuser@example.com', $user->email);
        $this->assertEquals('user', $user->role);
    }
}
