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

    // TESTS getAllOrders:
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

    // TESTS getOrdersByUserId:
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

    // TESTS store:
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
        $response->assertJsonFragment($orderData);
        $this->assertDatabaseHas('orders', $orderData);
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
        $response->assertRedirect('/login');
        $this->assertDatabaseMissing('orders', $orderData);
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

        $response->assertStatus(422);
        $response->assertJson([
            'includeSummary' => [
                'The include summary field is required.',
            ],
        ]);

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

    public function test_copy_items_missing_order_ids()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $copyData = [
            'to_order_id' => 1
        ];

        $response = $this->post('/api/copyitems', $copyData);

        $response->assertStatus(400);
        $response->assertJson([
            'error' => 'Invalid order IDs'
        ]);

        $copyData = [
            'from_order_id' => 1
        ];

        $response = $this->post('/api/copyitems', $copyData);

        $response->assertStatus(400);
        $response->assertJson([
            'error' => 'Invalid order IDs'
        ]);
    }

    public function test_copy_items_order_not_found()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $orderFrom = Order::factory()->create();
        $nonExistentOrderId = 9999;

        $copyData = [
            'from_order_id' => $nonExistentOrderId,
            'to_order_id' => $orderFrom->id
        ];

        $response = $this->post('/api/copyitems', $copyData);

        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'Order not found'
        ]);

        $copyData = [
            'from_order_id' => $orderFrom->id,
            'to_order_id' => $nonExistentOrderId
        ];

        $response = $this->post('/api/copyitems', $copyData);

        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'Order not found'
        ]);
    }

    public function test_copy_items_with_no_items_in_from_order()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $orderFrom = Order::factory()->create();
        $orderTo = Order::factory()->create();

        $copyData = [
            'from_order_id' => $orderFrom->id,
            'to_order_id' => $orderTo->id
        ];

        $response = $this->post('/api/copyitems', $copyData);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => 'Items copied successfully'
        ]);

        $this->assertDatabaseMissing('groceries_orders', [
            'order_id' => $orderTo->id
        ]);
    }

    // TESTS deleteByID:
    public function test_successful_delete_by_id()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $order = Order::factory()->create();

        $response = $this->delete('/api/orders/' . $order->id);

        $response->assertStatus(204);
        $response->assertNoContent();

        $this->assertDatabaseMissing('orders', [
            'id' => $order->id,
        ]);
    }

    public function test_delete_by_id_order_not_found()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $nonExistentOrderId = 9999;

        $response = $this->delete('/api/orders/' . $nonExistentOrderId);

        $response->assertStatus(404);
    }

    public function test_delete_by_id_invalid_id()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        $response = $this->delete('/api/orders/invalid-id');

        $response->assertStatus(400);
    }

    // TESTS deleteOrdersByUserId
    public function test_delete_orders_by_user_id_successful()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        Order::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->delete('/api/ordersUserId/' . $user->id);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Alle Bestellungen für den Benutzer wurden erfolgreich gelöscht.',
            'deleted_count' => 3,
        ]);

        $this->assertDatabaseMissing('orders', ['user_id' => $user->id]);
    }

    public function test_delete_orders_by_user_id_no_orders()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->delete('/api/ordersUserId/' . $user->id);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Alle Bestellungen für den Benutzer wurden erfolgreich gelöscht.',
            'deleted_count' => 0,
        ]);
    }

    public function test_delete_orders_by_user_id_non_existent_user()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $nonExistentUserId = 9999;

        $response = $this->delete('/api/ordersUserId/' . $nonExistentUserId);

        $response->assertStatus(404);
        $response->assertJson([
            'message' => 'User not found',
        ]);
    }

    public function test_delete_orders_by_user_id_if_user_id_is_not_numeric()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $nonExistentUserId = "not_numeric";

        $response = $this->delete('/api/ordersUserId/' . $nonExistentUserId);

        $response->assertStatus(400);
        $response->assertJson([
            'message' => 'Invalid user ID format',
        ]);
    }

    // TESTS deleteAll
    public function test_delete_all_orders_admin_success()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        Order::factory()->count(3)->create();

        $response = $this->deleteJson('/api/orders');

        $response->assertStatus(204);
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_delete_all_orders_user_fails()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $this->actingAs($user);

        Order::factory()->count(3)->create();

        $response = $this->deleteJson('/api/orders');

        $response->assertStatus(302);
        $response->assertRedirect('/login');
        $this->assertDatabaseCount('orders', 3);
    }

    public function test_delete_all_orders_unauthorized()
    {
        Order::factory()->count(3)->create();

        $response = $this->deleteJson('/api/orders');

        $response->assertStatus(401);
        $this->assertDatabaseCount('orders', 3);
    }
}
