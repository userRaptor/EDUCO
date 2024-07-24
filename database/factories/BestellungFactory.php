<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bestellung>
 */
class BestellungFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'lebensmittel' => $this->faker->word,
            'datum' => $this->faker->date,
            'uhrzeit' => $this->faker->time,
            'ort' => $this->faker->city,
            'verwendungszweck' => $this->faker->sentence,
            'bemerkung' => $this->faker->sentence,
            'includeSummary' => $this->faker->boolean,
        ];
    }
}
