<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Order;
use App\Models\User;
use App\Models\Groceries;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GroceriesTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_create_a_groceries_entry()
    {
        $groceries = Groceries::create([
            'name' => 'Milk',
            'unit' => 'Litre',
            'category' => 'Dairy',
            'supplier' => 'Local Farm',
        ]);

        $this->assertDatabaseHas('groceries', [
            'name' => 'Milk',
            'unit' => 'Litre',
            'category' => 'Dairy',
            'supplier' => 'Local Farm',
        ]);
    }

    public function test_it_can_update_a_groceries_entry()
    {
        $groceries = Groceries::create([
            'name' => 'Milk',
            'unit' => 'Litre',
            'category' => 'Dairy',
            'supplier' => 'Local Farm',
        ]);

        $groceries->update([
            'name' => 'Almond Milk',
        ]);

        $this->assertDatabaseHas('groceries', [
            'name' => 'Almond Milk',
        ]);
    }

    public function test_it_can_delete_a_groceries_entry()
    {
        $groceries = Groceries::create([
            'name' => 'Milk',
            'unit' => 'Litre',
            'category' => 'Dairy',
            'supplier' => 'Local Farm',
        ]);

        $groceries->delete();

        $this->assertDatabaseMissing('groceries', [
            'name' => 'Milk',
        ]);
    }
}
