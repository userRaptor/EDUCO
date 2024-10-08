<?php

namespace Database\Factories;

use App\Models\GroceriesOrders;
use App\Models\Groceries;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GroceriesOrders>
 */
class GroceriesOrdersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'groceries_id' => Groceries::factory(),
            'order_id' => Order::factory(),
            'comment' => $this->faker->sentence,
            'quantity' => $this->faker->numberBetween(1, 100), 
        ];
    }
}
