<?php

namespace Tests\Feature;
use App\Models\Groceries;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GroceriesControllerTest extends TestCase
{
    use RefreshDatabase;

    // TESTS getAll:
    public function test_get_all_groceries()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        Groceries::factory()->count(10)->create();
        $response = $this->get('/api/groceries');

        $response->assertStatus(200);
        $response->assertJsonCount(10);
    }

    public function test_get_all_groceries_for_unauthenticated_user()
    {
        Groceries::factory()->count(10)->create();
        $response = $this->get('/api/groceries');

        $response->assertStatus(302);
        $response->assertRedirect('/login');
    }

    public function test_get_all_groceries_returns_items_in_correct_order()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $groceries = Groceries::factory()->count(5)->create();
        $response = $this->get('/api/groceries');

        $response->assertStatus(200);
        $response->assertJsonFragment(['id' => $groceries->first()->id]); // Check the latest item is included
        $response->assertJsonFragment(['id' => $groceries->last()->id]);  // Check the oldest item is included
    }

    // TESTS store:
    public function test_store_creates_new_grocery()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $grocery = Groceries::factory()->make();

        $response = $this->post('/api/groceries', $grocery->toArray());

        $response->assertStatus(201);
        $response->assertJsonFragment([
            'name' => $grocery->name,
            'unit' => $grocery->unit,
            'category' => $grocery->category,
            'supplier' => $grocery->supplier,
        ]);
        $this->assertDatabaseHas('groceries', $grocery->toArray());
    }

    public function test_store_creates_new_grocery_for_unauthorized_user()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $groceryData = Groceries::factory()->make()->toArray();

        $response = $this->post('/api/groceries', $groceryData);

        $response->assertStatus(302);
        $response->assertRedirect('/login');
        $this->assertDatabaseCount('groceries', 0);
    }

    public function test_store_requires_name()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $data = [
            'unit' => 'litre',
            'category' => 'Dairy',
            'supplier' => 'Supplier Name',
        ];

        $response = $this->post('/api/groceries', $data);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('name');
    }


    // TESTS deleteByID:
    public function test_delete_grocery_by_id()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $grocery = Groceries::factory()->create();

        $response = $this->deleteJson('/api/groceries/' . $grocery->id);

        $response->assertStatus(200);
        $response->assertJson(['success' => 'Grocery item deleted successfully.']);
        $this->assertDatabaseMissing('groceries', ['id' => $grocery->id]);
    }

    public function test_delete_grocery_by_id_notFound()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $response = $this->deleteJson('/api/groceries/' . 999);

        $response->assertStatus(404);
        $response->assertJson(['error' => 'Grocery item not found.']);
    }

    // TESTS deleteAll:
    public function test_delete_all_groceries()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        Groceries::factory()->count(3)->create();

        $response = $this->deleteJson('/api/groceries');

        $response->assertStatus(200);
        $response->assertJson(['success' => 'All groceries deleted successfully.']);
        $this->assertDatabaseCount('groceries', 0);
    }

    // TESTS importCsv:
    public function test_successful_importCsv()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $data = [
            ['Apple', 'kg', 'Fruit', 'Supplier1'],
            ['Banana', 'kg', 'Fruit', 'Supplier2'],
        ];

        $response = $this->postJson('/api/groceriescsv', ['csv' => $data]);

        $response->assertStatus(200);
        $response->assertJson(['message' => 'imported successfully']);

        $this->assertDatabaseCount('groceries', 2);
        $this->assertDatabaseHas('groceries', [
            'name' => 'Apple',
            'unit' => 'kg',
            'category' => 'Fruit',
            'supplier' => 'Supplier1',
        ]);
        $this->assertDatabaseHas('groceries', [
            'name' => 'Banana',
            'unit' => 'kg',
            'category' => 'Fruit',
            'supplier' => 'Supplier2',
        ]);
    }
    
    public function test_importCsv_with_emptyRows()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $data = [
            [],
            [' ', ' ', ' ', ' '],
            ['Carrot', 'kg', 'Vegetable', 'Supplier3'],
        ];

        $response = $this->postJson('/api/groceriescsv', ['csv' => $data]);

        $response->assertStatus(200);
        $response->assertJson(['message' => 'imported successfully']);

        $this->assertDatabaseCount('groceries', 1);
        $this->assertDatabaseHas('groceries', [
            'name' => 'Carrot',
            'unit' => 'kg',
            'category' => 'Vegetable',
            'supplier' => 'Supplier3',
        ]);
    }

    public function test_importCsv_with_invalidRowCount()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $data = [
            ['Apple', 'kg', 'Fruit'],
            ['Banana', 'kg', 'Fruit', 'Supplier2', 'ExtraField'],
        ];

        $response = $this->postJson('/api/groceriescsv', ['csv' => $data]);

        $response->assertStatus(200);
        $response->assertJson(['message' => 'imported successfully']);

        $this->assertDatabaseCount('groceries', 0);
    }

    public function test_importCsv_with_nullFields()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $data = [
            ['Apple', '', 'Fruit', 'Supplier1'],
            ['Banana', 'kg', '', ''],
        ];

        $response = $this->postJson('/api/groceriescsv', ['csv' => $data]);

        $response->assertStatus(200);
        $response->assertJson(['message' => 'imported successfully']);

        $this->assertDatabaseCount('groceries', 2);
        $this->assertDatabaseHas('groceries', [
            'name' => 'Apple',
            'unit' => 'null',
            'category' => 'Fruit',
            'supplier' => 'Supplier1',
        ]);
        $this->assertDatabaseHas('groceries', [
            'name' => 'Banana',
            'unit' => 'kg',
            'category' => 'null',
            'supplier' => 'null',
        ]);
    }
}
