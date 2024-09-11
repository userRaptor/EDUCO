<?php

namespace Database\Factories;

use App\Models\Groceries;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Groceries>
 */
class GroceriesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word, 
            'unit' => $this->faker->randomElement(['kg', 'g', 'l', 'ml', 'pcs']), 
            'category' => $this->faker->randomElement(['Vegetables', 'Fruits', 'Dairy', 'Beverages', 'Bakery']), 
            'supplier' => $this->faker->company, 
        ];
    }
}
