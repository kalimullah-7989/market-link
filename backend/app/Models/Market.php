<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Market extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'address',
        'city',
        'latitude',
        'longitude',
        'operating_days',
        'opening_time',
        'closing_time',
        'image_url',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'operating_days' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function farmers(): HasMany
    {
        return $this->hasMany(FarmerProfile::class, 'market_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'market_id');
    }
}
