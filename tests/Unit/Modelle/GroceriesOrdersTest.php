<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Order;
use App\Models\User;
use App\Models\Groceries;
use App\Models\GroceriesOrders;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GroceriesOrdersTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_create_a_groceries_order_entry()
    {
        $user = User::create();

        $groceries = Groceries::create([
            'name' => 'Milk',
            'unit' => 'Litre',
            'category' => 'Dairy',
            'supplier' => 'Local Farm',
        ]);

        $order = Order::create([
            'user_id'=> $user->id,
        ]);

        $groceriesOrder = GroceriesOrders::create([
            'groceries_id' => $groceries->id,
            'order_id' => $order->id,
            'comment' => 'Fresh milk',
            'quantity' => 10,
        ]);

        $this->assertDatabaseHas('groceries_orders', [
            'groceries_id' => $groceries->id,
            'order_id' => $order->id,
            'comment' => 'Fresh milk',
            'quantity' => 10,
        ]);
    }

    public function test_it_can_update_a_groceries_order_entry()
    {
        $groceries = Groceries::create([
            'name' => 'Milk',
            'unit' => 'Litre',
            'category' => 'Dairy',
            'supplier' => 'Local Farm',
        ]);

        $groceriesOrder = GroceriesOrders::create([
            'groceries_id' => $groceries->id,
            'order_id' => 1,
            'comment' => 'Fresh milk',
            'quantity' => 10,
        ]);

        $groceriesOrder->update([
            'comment' => 'Updated comment',
            'quantity' => 15,
        ]);

        $this->assertDatabaseHas('groceries_orders', [
            'groceries_id' => $groceries->id,
            'order_id' => 1,
            'comment' => 'Updated comment',
            'quantity' => 15,
        ]);
    }

    public function test_it_can_delete_a_groceries_order_entry()
    {
        $groceries = Groceries::create([
            'name' => 'Milk',
            'unit' => 'Litre',
            'category' => 'Dairy',
            'supplier' => 'Local Farm',
        ]);

        $groceriesOrder = GroceriesOrders::create([
            'groceries_id' => $groceries->id,
            'order_id' => 1,
            'comment' => 'Fresh milk',
            'quantity' => 10,
        ]);

        $groceriesOrder->delete();

        $this->assertDatabaseMissing('groceries_orders', [
            'groceries_id' => $groceries->id,
            'order_id' => 1,
            'comment' => 'Fresh milk',
            'quantity' => 10,
        ]);
    }

    public function test_it_can_relate_groceries_to_groceries_order()
    {
        $groceries = Groceries::create([
            'name' => 'Milk',
            'unit' => 'Litre',
            'category' => 'Dairy',
            'supplier' => 'Local Farm',
        ]);

        $groceriesOrder = GroceriesOrders::create([
            'groceries_id' => $groceries->id,
            'order_id' => 1, // Angenommen, es gibt eine Order mit ID 1
            'comment' => 'Fresh milk',
            'quantity' => 10,
        ]);

        $this->assertTrue($groceriesOrder->groceries->is($groceries));
    }
}
