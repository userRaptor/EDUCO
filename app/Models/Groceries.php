<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groceries extends Model
{
    use HasFactory;
    
    public function orders()
    {
        return $this->belongsToMany(Order::class, 'grocery_order')
                    ->withPivot('id', 'quantity', 'comment');
    }

    protected $fillable = [
        'name',
        'unit',
        'category',
        'supplier',
    ];
}
