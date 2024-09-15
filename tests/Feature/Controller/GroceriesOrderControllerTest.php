<?php

namespace Tests\Feature;
use Tests\TestCase;
use App\Models\Groceries;
use App\Models\Order;
use App\Models\GroceriesOrders;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GroceriesOrderControllerTest extends TestCase
{
    use RefreshDatabase;

    // TESTS store:
    public function test_store_successful()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $grocery1 = Groceries::factory()->create();
        $order1 = Order::factory()->create();

        $data = [
            'groceries_id' => $grocery1->id,
            'order_id' => $order1->id,
            'comment' => 'Test comment',
            'quantity' => 10,
        ];

        $response = $this->postJson('/api/groceries_order', $data);

        $response->assertStatus(201);
        $response->assertJson($data);
        $this->assertDatabaseHas('groceries_orders', $data);
    }

    public function test_store_validation_fail()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);
        
        $data = [
            'comment' => 'Test comment',
        ];

        $response = $this->postJson('/api/groceries_order', $data);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['groceries_id', 'order_id', 'quantity']);
        $this->assertDatabaseEmpty('groceries_orders', 0);
    }

    public function test_store_invalid_data()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $data = [
            'groceries_id' => 'invalid', 
            'order_id' => 1,
            'comment' => 'Test comment',
            'quantity' => 'invalid', 
        ];

        $response = $this->postJson('/api/groceries_order', $data);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['groceries_id', 'quantity']);
        $this->assertDatabaseEmpty('groceries_orders', 0);
    }

    // TESTS getByOrderId:
    public function test_get_by_order_id_success()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $groceriesorder = GroceriesOrders::factory()->create();
        
        $response = $this->getJson('/api/groceries_order/' . $groceriesorder->order_id);

        $response->assertStatus(200);
        $response->assertJsonFragment([
                     'order_id' => $groceriesorder->order_id,
                 ]);
    }

    public function test_get_by_order_id_not_found()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $response = $this->getJson('/api/groceries_order/999999');

        $response->assertStatus(200);
        $response->assertJson([]);  // returns an empty collection
    }



    // TESTS deleteByID:
    public function test_delete_by_id_success()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $groceriesOrder = GroceriesOrders::factory()->create();

        $response = $this->deleteJson('/api/groceries_order/' . $groceriesOrder->id);


        $response->assertStatus(204);
        $this->assertDatabaseMissing('groceries_orders', ['id' => $groceriesOrder->id]);
        $this->assertDatabaseEmpty('groceries_orders', 0);
    }

    public function test_delete_by_id_not_found()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $response = $this->deleteJson('/api/groceries_order/999999');

        $response->assertStatus(404);
    }
}
 