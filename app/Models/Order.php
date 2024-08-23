<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    public function groceries()
    {
        // return $this->belongsToMany(Groceries::class);
        return $this->belongsToMany(Groceries::class, 'groceries_orders')
                    ->withPivot('id','quantity', 'comment');
    }

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Attributes:
    protected $fillable = [
        'user_id',
        'date',
        'weekday',
        'time',
        'schoolClass',
        'location',
        'purpose',
        'includeSummary'

    ];
}
