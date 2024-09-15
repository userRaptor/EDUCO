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

    public function test_can_create_groceries_orders()
    {
        $groceries = Groceries::factory()->create();
        $order = Order::factory()->create();

        $groceriesOrder = GroceriesOrders::create([
            'groceries_id' => $groceries->id,
            'order_id' => $order->id,
            'comment' => 'Test Comment',
            'quantity' => 10,
        ]);

        $this->assertInstanceOf(GroceriesOrders::class, $groceriesOrder);
        $this->assertEquals($groceries->id, $groceriesOrder->groceries_id);
        $this->assertEquals($order->id, $groceriesOrder->order_id);
        $this->assertEquals('Test Comment', $groceriesOrder->comment);
        $this->assertEquals(10, $groceriesOrder->quantity);
    }

    public function test_groceries_relationship()
    {
        $groceries = Groceries::factory()->create();
        $order = Order::factory()->create();

        $groceriesOrder = GroceriesOrders::factory()->create([
            'groceries_id' => $groceries->id,
            'order_id' => $order->id,
        ]);

        $this->assertEquals($groceries->id, $groceriesOrder->groceries->id);
    }
}

