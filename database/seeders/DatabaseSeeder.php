<?php

namespace Database\Seeders;

use App\Models\Groceries;
use App\Models\GroceriesOrders;
use App\Models\Order;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(SuperadminSeeder::class);
        User::factory()->count(5)->create();

        /*
        Groceries::factory()->count(10)->create();
        GroceriesOrders::factory()->count(5)->create();
        Order::factory()->count(1)->create();
        User::factory()->count(5)->create();
        */
    }
}
