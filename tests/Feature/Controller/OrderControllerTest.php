<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Groceries;
use App\Models\User;
use App\Models\GroceriesOrders;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_all_orders_for_admin()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        Order::factory()->count(10)->create();
        $response = $this->get('/api/orders');

        $response->assertStatus(200);
        $response->assertJsonCount(10); 
    }

    public function test_get_all_orders_requires_admin_privileges()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        Order::factory()->count(3)->create();

        $response = $this->get('/api/orders');

        $response->assertStatus(302);
        $response->assertRedirect('/login'); 
    }

    public function test_get_orders_by_authenticated_user_id()
    {
        $user1 = User::factory()->create([
            'role' => 'user',
            'id' => 1,
        ]);

        $user2 = User::factory()->create([
            'role' => 'user',
            'id' => 2,
        ]);

        $this->actingAs($user1);

        Order::factory()->count(2)->create(['user_id' => $user1->id]);
        Order::factory()->count(3)->create(['user_id' => $user2->id]);

        $response = $this->get('api/orders/' . $user1->id);

        $response->assertStatus(200);
        $response->assertJsonCount(2);
    }

    public function test_shouldntget_orders_by_nonauthenticated_user_id()
    {
        $user1 = User::factory()->create([
            'role' => 'user',
            'id' => 1,
        ]);

        Order::factory()->count(2)->create(['user_id' => $user1->id]);

        $response = $this->get('api/orders/' . $user1->id);

        $response->assertStatus(302);
        $response->assertRedirect('/login');
    }


    public function test_forbidden_access_to_other_users_orders()
    {
        $user1 = User::factory()->create([
            'role' => 'user',
            'id' => 1,
        ]);

        $user2 = User::factory()->create([
            'role' => 'user',
            'id' => 2,
        ]);

        $this->actingAs($user2);

        Order::factory()->count(2)->create(['user_id' => $user1->id]);
        Order::factory()->count(3)->create(['user_id' => $user2->id]);

        $response = $this->get('api/orders/' . $user1->id);

        $response->assertStatus(403);
    }

    public function test_store_order()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $orderData = Order::factory()->make([
            'user_id' => $user->id,
        ])->toArray();

        $response = $this->post('/api/orders', $orderData);

        $response->assertStatus(201);
        $response->assertJsonFragment($orderData); // Assert that the JSON response contains the order data
        $this->assertDatabaseHas('orders', $orderData); // Assert that the database has the new order record
    }

    public function test_unauthenticated_user_cannot_store_order()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $orderData = Order::factory()->make([
            'user_id' => $user->id,
        ])->toArray();

        $response = $this->post('/api/orders', $orderData);

        $response->assertStatus(302);
        $response->assertRedirect('/login');    // Assert: Check if the redirect is to the login page
        $this->assertDatabaseMissing('orders', $orderData); // Assert that the order is not in the database

    }

    // TESTS updateIncludeSummary:
    public function test_successful_update_includeSummary()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $order = Order::factory()->create(['includeSummary' => false]);

        $response = $this->put('/api/orders/' . $order->id, [
            'includeSummary' => true,
        ]);

        $response->assertStatus(200);

        // Assert: Check if the response JSON contains the updated order data
        $response->assertJson([
            'id' => $order->id,
            'includeSummary' => true,
        ]);

        // Assert: Check if the order data in the database is updated
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'includeSummary' => true,
        ]);
    }

    public function test_update_includeSummary_order_not_found()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $response = $this->put('/api/orders/9999', [
            'includeSummary' => true,
        ]);

        $response->assertStatus(404);
        $response->assertJson([
            'message' => 'Order not found',
        ]);
    }

    public function test_update_includeSummary_without_passing_includeSummary_field()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $order = Order::factory()->create(['includeSummary' => false]);

        $response = $this->put('/api/orders/' . $order->id, []);

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $order->id,
            'includeSummary' => false,
        ]);

        // Assert: Check if the order data in the database is not changed
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'includeSummary' => false,
        ]);
    }

    public function test_update_includeSummary_with_unauthorized_user()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $order = Order::factory()->create(['includeSummary' => false]);

        $response = $this->put('/api/orders/' . $order->id, [
            'includeSummary' => true,
        ]);

        $response->assertStatus(302);
        $response->assertRedirect('/login');
    }

    public function test_update_includeSummary_invalid_data()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $order = Order::factory()->create(['includeSummary' => false]);

        $response = $this->put('/api/orders/' . $order->id, [
            'includeSummary' => 'invalid_data',
        ]);

        $response->assertStatus(422);
        // Assert: Check if the order data in the database is not changed
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'includeSummary' => false,
        ]);
    }

    // TESTS copyItems:
    public function test_successful_copy_items()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $orderFrom = Order::factory()->create();
        $orderTo = Order::factory()->create();

        $grocery1 = Groceries::factory()->create();
        $grocery2 = Groceries::factory()->create();

        $orderFrom->groceries()->attach($grocery1, ['quantity' => 2, 'comment' => 'First item']);
        $orderFrom->groceries()->attach($grocery2, ['quantity' => 1, 'comment' => 'Second item']);

        $copyData = [
            'from_order_id' => $orderFrom->id,
            'to_order_id' => $orderTo->id
        ];

        $response = $this->post('/api/copyitems', $copyData);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => 'Items copied successfully'
        ]);
        $this->assertDatabaseHas('groceries_orders', [
            'groceries_id' => $grocery1->id,
            'order_id' => $orderTo->id,
            'quantity' => 2,
            'comment' => 'First item'
        ]);
        $this->assertDatabaseHas('groceries_orders', [
            'groceries_id' => $grocery2->id,
            'order_id' => $orderTo->id,
            'quantity' => 1,
            'comment' => 'Second item'
        ]);
    }


    public function test_copy_items()
    {
        // Arrange: Create two orders and some groceries for the first order
        $fromOrder = Order::factory()->create();
        $toOrder = Order::factory()->create();
        GroceriesOrders::factory()->count(3)->create(['order_id' => $fromOrder->id]);

        // Act: Call the copyItems route
        $response = $this->post('/orders/copy-items', [
            'from_order_id' => $fromOrder->id,
            'to_order_id' => $toOrder->id,
        ]);

        // Assert: Check if the groceries were copied
        $response->assertStatus(200)
            ->assertJsonFragment(['success' => 'Items copied successfully']);
        $this->assertDatabaseCount('groceries_orders', 6);
    }

}
