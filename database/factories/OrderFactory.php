<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'date' => $this->faker->date(),
            'weekday' => $this->faker->dayOfWeek,
            'time' => $this->faker->time(),
            'schoolClass' => $this->faker->word(),
            'location' => $this->faker->address(),
            'purpose' => $this->faker->sentence(),
            'includeSummary' => $this->faker->boolean(),
        ];
    }
}
