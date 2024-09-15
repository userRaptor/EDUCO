<?php

namespace Tests\Unit;
use Tests\TestCase;
use App\Models\Order;
use App\Models\User;
use App\Models\Groceries;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_has_a_user()
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);
        
        $this->assertInstanceOf(User::class, $order->user);
        $this->assertEquals($user->id, $order->user->id);
        $this->assertTrue(true);
    }

    public function test_it_has_groceries()
    {
        $order = Order::factory()->create();
        $groceries = Groceries::factory()->count(3)->create();

        $order->groceries()->attach($groceries, ['quantity' => 1, 'comment' => 'test']);

        $this->assertCount(3, $order->groceries);
    }

    public function test_it_has_many_groceries()
    {
        $order = Order::factory()->create();
        $groceries = Groceries::factory()->count(3)->create();
        $order->groceries()->attach($groceries->pluck('id')->toArray(), [
            'quantity' => 1,
            'comment' => 'Test comment'
        ]);

        $this->assertCount(3, $order->groceries);
        $this->assertDatabaseHas('groceries_orders', [
            'order_id' => $order->id,
            'groceries_id' => $groceries->first()->id,
            'quantity' => 1,
            'comment' => 'Test comment'
        ]);
    }

    public function test_it_has_fillable_attributes()
    {
        $fillable = (new Order)->getFillable();
        $this->assertEquals([
            'user_id',
            'date',
            'weekday',
            'time',
            'schoolClass',
            'location',
            'purpose',
            'includeSummary'
        ], $fillable);
    }
}
