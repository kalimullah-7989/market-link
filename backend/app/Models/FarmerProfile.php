<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FarmerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'market_id',
        'farm_name',
        'stall_number',
        'stall_category',
        'stall_items',
        'operating_days',
        'farm_address',
        'city',
        'country',
        'farm_latitude',
        'farm_longitude',
        'stall_latitude',
        'stall_longitude',
        'pickup_slots',
        'cutoff_hours',
        'approval_status',
        'stock_template',
        'bio',
    ];

    protected function casts(): array
    {
        return [
            'farm_latitude' => 'float',
            'farm_longitude' => 'float',
            'stall_latitude' => 'float',
            'stall_longitude' => 'float',
            'pickup_slots' => 'array',
            'operating_days' => 'array',
            'stock_template' => 'array',
            'cutoff_hours' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function market(): BelongsTo
    {
        return $this->belongsTo(Market::class, 'market_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'farmer_id', 'user_id');
    }
}
