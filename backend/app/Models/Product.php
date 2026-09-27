<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id',
        'category_id',
        'name',
        'description',
        'unit',
        'price',
        'stock_quantity',
        'image',
        'is_sold_out',
        'is_temporarily_unavailable',
        'is_recurring',
        'harvested_at',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'stock_quantity' => 'integer',
            'is_sold_out' => 'boolean',
            'is_temporarily_unavailable' => 'boolean',
            'is_recurring' => 'boolean',
            'harvested_at' => 'datetime',
        ];
    }

    protected $appends = [
        'is_low_stock',
        'stock_urgency_label',
        'is_harvested_today',
        'freshness_tag',
    ];

    protected function isHarvestedToday(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->harvested_at) {
                    return false;
                }
                return $this->harvested_at->isToday() || $this->harvested_at->diffInHours(now()) <= 24;
            }
        );
    }

    protected function freshnessTag(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->harvested_at) {
                    return null;
                }

                $diffHours = $this->harvested_at->diffInHours(now());

                if ($this->harvested_at->isToday() || $diffHours <= 24) {
                    return 'Harvested Today';
                }

                if ($this->harvested_at->isYesterday() || ($diffHours > 24 && $diffHours <= 48)) {
                    return 'Harvested Yesterday';
                }

                return null;
            }
        );
    }

    protected function isLowStock(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->stock_quantity <= 5 && $this->stock_quantity > 0 && !$this->is_sold_out
        );
    }

    protected function stockUrgencyLabel(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->stock_quantity <= 5 && $this->stock_quantity > 0 && !$this->is_sold_out) {
                    return "Only {$this->stock_quantity} {$this->unit} left!";
                }
                return null;
            }
        );
    }

    protected function image(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (!$value) {
                    return null;
                }
                if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, '/img/')) {
                    return $value;
                }
                return Storage::disk('public')->url($value);
            }
        );
    }

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'product_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'product_id');
    }
}
