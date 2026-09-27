<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_id',
        'farmer_id',
        'market_id',
        'pickup_date',
        'pickup_time_slot',
        'cutoff_datetime',
        'total_amount',
        'order_status',
        'payment_status',
        'pickup_token',
        'farmer_notes',
        'cancelled_reason',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'pickup_date' => 'date',
            'cutoff_datetime' => 'datetime',
            'completed_at' => 'datetime',
            'total_amount' => 'float',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function market(): BelongsTo
    {
        return $this->belongsTo(Market::class, 'market_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class, 'order_id');
    }

    public function canBeModifiedOrCancelled(): bool
    {
        if (in_array($this->order_status, ['completed', 'cancelled'])) {
            return false;
        }

        return Carbon::now()->lessThan($this->cutoff_datetime);
    }
}
