<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GroceriesController;
use App\Http\Controllers\OrderController;



Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/// My custom routes ########################################################################

Route::middleware(['auth', 'admin'])->group(function () {
    //Route::get('/admin/dashboard', [HomeController::class, 'index'])->name('admin-dashboard');

});

Route::middleware('auth')->group(function () {
    Route::get('/test', function () {
        return Inertia::render('Test');
    })->name('test-component');

    Route::get('newOrder', function () {
        return Inertia::render('orders/newOrder/MainNewOrderGroceries');
    })->name('neworder-component');

    Route::get('/groceries', function () {
        return Inertia::render('groceries/NewGroceries');
    })->name('grocery-component');

    Route::get('/myorders', function () {
        return Inertia::render('orders/myOrders/MyOrders');
    })->name('myorder-component');

    Route::get('/reuseorder/{orderId}', function ($orderId) {
        return Inertia::render('ReuseOrder', [
            'orderId' => $orderId,
        ]);
    })->name('reuseorder');
});


// HTTP request
Route::middleware('auth')->group(function () {
    Route::post('/groceries', [GroceriesController::class, 'store'])->name('groceries.store');
    Route::post('/groceriescsv', [GroceriesController::class, 'importCsv'])->name('groceriescsv.store');

    Route::get('/api/groceries', [GroceriesController::class, 'index'])->name('groceries.all');
    Route::get('/orders', [OrderController::class, 'getAllOrders'])->name('orders.all');
    Route::get('/orders/{userId}', [OrderController::class, 'getOrdersByUserId'])->name('orders.byuser');


    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
});


require __DIR__.'/auth.php';
