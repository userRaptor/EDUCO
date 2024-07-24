<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\GroceriesOrders;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Log as FacadesLog;
use Inertia\Inertia;



class OrderController extends Controller
{
    public function getAllOrders()
    {
        return Order::with(['groceries', 'user'])->orderBy('id', 'desc')->get();
    }

    public function getOrdersByUserId($userId)
    {
        $orders = Order::with(['groceries', 'user'])
                    ->where('user_id', $userId)
                    ->orderBy('id', 'desc')
                    ->get();


        return inertia('orders/myOrders/MyOrders', [
            'orders' => $orders
        ]);
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

    
    public function show(Order $order)
    {
        return $order->load('groceries');
    }


    public function updateIncludeSummary(Request $request, $orderId)
    {
        // Finde den Eintrag mit der übergebenen ID
        $order = Order::find($orderId);
    
        if ($order) {
            // Aktualisiere den Wert der Spalte 'includeSummary'
            $order->update($request->only('includeSummary'));
        
            return response()->json($order, 200);
        } else {
            // Behandele den Fall, wenn der Eintrag nicht gefunden wurde
            return response()->json(['message' => 'Order not found'], 404);
        }
    }

    public function copyItems(Request $request)
    {
        $fromOrderId = $request->input('from_order_id');
        $toOrderId = $request->input('to_order_id');

        //Log::info('Request received:', $request->all());
        //FacadesLog::info('Request received:', $request->all());
        //FacadesLog::info('From order ID:', [$fromOrderId]);
        //FacadesLog::info('To order ID:', [$toOrderId]);

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
        $grocery = Order::find($id);
        $grocery->delete();

        return response()->json(null, 204);
    }

    public function deleteAll()
    {
        Order::query()->delete();

        return response()->json(null, 204);
    }
}
