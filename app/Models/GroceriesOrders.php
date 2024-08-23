<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroceriesOrders extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'groceries_id',
        'order_id',
        'comment',
        'quantity',
    ];

    public function groceries() {
        return $this->belongsTo(Groceries::class, 'groceries_id');
    }
    
}
