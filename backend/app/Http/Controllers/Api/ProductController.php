<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'farmer.farmerProfile.market'])
            ->whereHas('farmer.farmerProfile', function ($q) {
                $q->where('approval_status', 'approved');
            })
            ->whereHas('farmer', function ($q) {
                $q->where('is_active', true);
            });

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('market_id')) {
            $query->whereHas('farmer.farmerProfile', function ($q) use ($request) {
                $q->where('market_id', $request->market_id);
            });
        }

        if ($request->filled('day')) {
            $day = $request->day;
            $query->whereHas('farmer.farmerProfile.market', function ($q) use ($day) {
                $q->whereJsonContains('operating_days', $day);
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->max_price);
        }

        if ($request->query('sort') === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($request->query('sort') === 'price_desc') {
            $query->orderBy('price', 'desc');
        } else {
            $query->latest();
        }

        $products = $query->paginate($request->query('per_page', 12));

        return $this->success($products, 'Products retrieved successfully');
    }

    public function show($id)
    {
        $product = Product::with(['category', 'farmer.farmerProfile.market', 'reviews.customer'])
            ->find($id);

        if (!$product) {
            return $this->error('Product not found', 404);
        }

        $farmerProfile = $product->farmer->farmerProfile;

        $traceability = [
            'farm_name' => $farmerProfile?->farm_name,
            'farm_address' => $farmerProfile?->farm_address,
            'farm_latitude' => $farmerProfile?->farm_latitude,
            'farm_longitude' => $farmerProfile?->farm_longitude,
            'stall_number' => $farmerProfile?->stall_number,
            'stall_latitude' => $farmerProfile?->stall_latitude,
            'stall_longitude' => $farmerProfile?->stall_longitude,
            'market_name' => $farmerProfile?->market?->name,
            'market_address' => $farmerProfile?->market?->address,
            'market_latitude' => $farmerProfile?->market?->latitude,
            'market_longitude' => $farmerProfile?->market?->longitude,
        ];

        return $this->success([
            'product' => $product,
            'farm_to_fork_origin' => $traceability,
        ], 'Product details retrieved successfully');
    }
}
