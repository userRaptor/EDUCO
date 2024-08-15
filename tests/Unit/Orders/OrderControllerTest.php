<?php

namespace Tests\Unit\Orders;

use App\Http\Controllers\OrderController;
use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Tests\TestCase;


class OrderControllerTest extends TestCase
{
    public function test_of_controller_feature_test(): void
    {
        // Rufe den API-Endpunkt auf, ohne authentifiziert zu sein
        $response = $this->call('GET', '/api/orders');

        // Überprüfe, ob die Antwort ein Redirect ist
        $response->assertRedirect('/login');
    }
}