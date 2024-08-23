<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use App\Models\GroceriesOrders;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function get_all_orders_for_admin_test()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        // Arrange: Create some orders
        Order::factory()->count(3)->create();

        // Act: Call the getAllOrders route
        $response = $this->get('/api/orders');

        // Assert: Check if the response contains the orders
        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_get_orders_by_user_id()
    {
        // Arrange: Create a user and some orders for that user
        $user = User::factory()->create();
        Order::factory()->count(2)->create(['user_id' => $user->id]);

        // Act: Call the getOrdersByUserId route
        $response = $this->get('/orders/user/' . $user->id);

        // Assert: Check if the response contains the orders for the user
        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_store_order()
    {
        // Arrange: Create a user and prepare order data
        $user = User::factory()->create();
        $orderData = [
            'user_id' => $user->id,
            'date' => '2023-08-22',
            'weekday' => 'Tuesday',
            'time' => '12:00',
            'schoolClass' => 'Class A',
            'location' => 'Room 101',
            'purpose' => 'Event',
            'includeSummary' => true,
        ];

        // Act: Call the store route
        $response = $this->post('/orders', $orderData);

        // Assert: Check if the order was created
        $response->assertStatus(201)
            ->assertJsonFragment($orderData);
        $this->assertDatabaseHas('orders', $orderData);
    }

    public function test_show_order()
    {
        // Arrange: Create an order
        $order = Order::factory()->create();

        // Act: Call the show route
        $response = $this->get('/orders/' . $order->id);

        // Assert: Check if the response contains the order data
        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $order->id,
            ]);
    }

    public function test_update_include_summary()
    {
        // Arrange: Create an order
        $order = Order::factory()->create(['includeSummary' => false]);

        // Act: Call the updateIncludeSummary route
        $response = $this->patch('/orders/' . $order->id . '/include-summary', [
            'includeSummary' => true,
        ]);

        // Assert: Check if the includeSummary field was updated
        $response->assertStatus(200)
            ->assertJsonFragment(['includeSummary' => true]);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'includeSummary' => true,
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

    public function test_delete_order_by_id()
    {
        // Arrange: Create an order
        $order = Order::factory()->create();

        // Act: Call the deleteByID route
        $response = $this->delete('/orders/' . $order->id);

        // Assert: Check if the order was deleted
        $response->assertStatus(204);
        $this->assertDatabaseMissing('orders', ['id' => $order->id]);
    }

    public function test_delete_orders_by_user_id()
    {
        // Arrange: Create a user and some orders
        $user = User::factory()->create();
        Order::factory()->count(3)->create(['user_id' => $user->id]);

        // Act: Call the deleteOrdersByUserId route
        $response = $this->delete('/orders/user/' . $user->id);

        // Assert: Check if the orders were deleted
        $response->assertStatus(200)
            ->assertJsonFragment([
                'success' => true,
                'deleted_count' => 3,
            ]);
        $this->assertDatabaseMissing('orders', ['user_id' => $user->id]);
    }

    public function test_delete_all_orders()
    {
        // Arrange: Create some orders
        Order::factory()->count(3)->create();

        // Act: Call the deleteAll route
        $response = $this->delete('/orders');

        // Assert: Check if all orders were deleted
        $response->assertStatus(204);
        $this->assertDatabaseCount('orders', 0);
    }
}
