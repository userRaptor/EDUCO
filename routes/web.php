<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GroceriesController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\GroceriesOrderController;
use App\Http\Controllers\UserController;


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

/// custom routes ########################################################################

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/groceries', function () {
        return Inertia::render('groceries/NewGroceries');
    })->name('grocery-component');

    Route::get('/allOrders', function () {
        return Inertia::render('orders/allOrders/AllOrdersMain');
    })->name('allorder-component');

    Route::get('/userManagement', function () {
        return Inertia::render('userManagement/UserManagement');
    })->name('usermanagement-component');
});

Route::middleware('auth')->group(function () {
    Route::get('/newOrder', function () {
        return Inertia::render('orders/newOrder/MainNewOrderGroceries');
    })->name('neworder-component');

    Route::get('/myorders', function () {
        return Inertia::render('orders/myOrders/MyOrders');
    })->name('myorder-component');

    Route::get('/reuseorder/{orderId}', function ($orderId) {
        return Inertia::render('orders/reuseOrder/MainReuseOrder', [
            'orderId' => $orderId,
        ]);
    })->name('reuseorder-component'); 
});


// HTTP request
Route::middleware(['auth', 'admin'])->group(function () {
    Route::post('/api/groceries', [GroceriesController::class, 'store'])->name('groceries.store');
    Route::post('/api/groceriescsv', [GroceriesController::class, 'importCsv'])->name('groceriescsv.store');
    Route::post('/api/register', [UserController::class, 'storeNewUser'])->name('registerNewUser');

    Route::put('/api/orders/{orderid}', [OrderController::class, 'updateIncludeSummary'])->name('orders.updateIncludeSummary');
    Route::put('/api/newpassword/{userid}', [UserController::class, 'updatePassword'])->name('updatePassword');
    Route::put('/api/userrole/{userid}', [UserController::class, 'updateRole'])->name('users.updateRole');

    Route::get('/api/orders', [OrderController::class, 'getAllOrders'])->name('orders.all');
    Route::get('/api/users', [UserController::class, 'getAllUsers'])->name('users.all');

    Route::delete('/api/groceries/{id}', [GroceriesController::class, 'deleteByID'])->name('groceries.delete');
    Route::delete('/api/groceries', [GroceriesController::class, 'deleteAll'])->name('groceries.delete');
    Route::delete('/api/orders', [OrderController::class, 'deleteAll'])->name('orders.deleteAll');
    Route::delete('/api/users/{id}', [UserController::class, 'destroyUserById'])->name('users.deleteByID');
});

Route::middleware('auth')->group(function () {
    Route::post('/api/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::post('/api/copyitems', [OrderController::class, 'copyItems'])->name('copyItems');
    Route::post('/api/groceries_order', [GroceriesOrderController::class, 'store'])->name('addGroceriesToOrder');

    Route::get('/api/groceries', [GroceriesController::class, 'index'])->name('groceries.all');
    Route::get('/api/orders/{userId}', [OrderController::class, 'getOrdersByUserId'])->name('orders.byuser');
    Route::get('/api/groceries_order/{orderId}', [GroceriesOrderController::class, 'getByOrderId'])->name('groceries.byorder'); //?

    Route::delete('/api/orders/{id}', [OrderController::class, 'deleteByID'])->name('orders.deleteByID');
    //sicherheitsproblem?? wenn eine andere userId übergeben wird?
    Route::delete('/api/ordersUserId/{userId}', [OrderController::class, 'deleteOrdersByUserId'])->name('orders.deleteByUserId');  
    Route::delete('/api/groceries_order/{id}', [GroceriesOrderController::class, 'deleteByID'])->name('deleteGroceriesInTheOrderByOrderId');
});




require __DIR__.'/auth.php';
