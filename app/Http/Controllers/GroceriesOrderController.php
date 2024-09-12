<?php

namespace App\Http\Controllers;

use App\Models\GroceriesOrders;
use Illuminate\Http\Request;

class GroceriesOrderController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'groceries_id' => 'required|integer',
            'order_id' => 'required|integer',
            'comment' => 'nullable|string',
            'quantity' => 'required|integer',
        ]);

        $groceriesOrder = GroceriesOrders::create($validatedData);

        return response()->json($groceriesOrder, 201);
    }

    public function getAllGroceriesByOrderId($order_id)
    {
        $orders = GroceriesOrders::with('groceries')->where('order_id', $order_id)->get();
        return response()->json($orders);
    }


    public function deleteByID($id)
    {
        $groceriesOrder = GroceriesOrders::findOrFail($id);
        $groceriesOrder->delete();

        return response()->json(null, 204);
    }

}
