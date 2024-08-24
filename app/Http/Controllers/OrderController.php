<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use App\Models\GroceriesOrders;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function getAllOrders()
    {
        return Order::with(['groceries', 'user'])->orderBy('id', 'desc')->get();
    }

    public function getOrdersByUserId($userId)
    {
        $user = auth()->user();

        if ($user->id != $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $orders = Order::with(['groceries', 'user'])
            ->where('user_id', $userId)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|integer',
            'date' => 'required|date',
            'weekday' => 'required|string',
            'time' => 'required',
            'schoolClass' => 'required|string',
            'location' => 'required|string',
            'purpose' => 'required|string',
            'includeSummary' => 'required|boolean',
        ]);

        $order = Order::create($validatedData);

        return response()->json($order, 201);
    }

    public function updateIncludeSummary(Request $request, $orderId)
    {
        $validator = Validator::make($request->all(), [
            'includeSummary' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $order = Order::find($orderId);

        if ($order) {
            $order->update($request->only('includeSummary'));
            return response()->json($order, 200);
        } else {
            return response()->json(['message' => 'Order not found'], 404);
        }
    }

    public function copyItems(Request $request)
    {
        $fromOrderId = $request->input('from_order_id');
        $toOrderId = $request->input('to_order_id');

        if (!$fromOrderId || !$toOrderId) {
            return response()->json(['error' => 'Invalid order IDs'], 400);
        }

        $fromOrder = Order::find($fromOrderId);
        $toOrder = Order::find($toOrderId);

        if (!$fromOrder || !$toOrder) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        // copy groceries
        foreach ($fromOrder->groceries as $grocery) {
            GroceriesOrders::create([
                'groceries_id' => $grocery->id,
                'order_id' => $toOrder->id,
                'quantity' => $grocery->pivot->quantity,
                'comment' => $grocery->pivot->comment
            ]);
        }

        return response()->json(['success' => 'Items copied successfully']);
    }

    public function deleteByID($id)
    {
        if (!is_numeric($id)) {
            return response()->json(['message' => 'Invalid ID format'], 400);
        }

        $grocery = Order::find($id);

        if (!$grocery) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $grocery->delete();

        return response()->json(null, 204);
    }

    public function deleteOrdersByUserId($userId)
    {
        if (!is_numeric($userId)) {
            return response()->json(['message' => 'Invalid user ID format'], 400);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $deletedCount = Order::where('user_id', $userId)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Alle Bestellungen für den Benutzer wurden erfolgreich gelöscht.',
            'deleted_count' => $deletedCount
        ]);
    }

    public function deleteAll()
    {
        Order::query()->delete();

        return response()->json(null, 204);
    }
}
