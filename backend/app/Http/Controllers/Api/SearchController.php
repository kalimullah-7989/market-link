<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Market;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate(['q' => 'required|string|min:2|max:100']);

        $q = $request->input('q');

        $products = Product::where('is_sold_out', false)
            ->where('is_temporarily_unavailable', false)
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                      ->orWhere('description', 'like', "%{$q}%");
            })
            ->with(['farmer:id,name', 'category:id,name'])
            ->select('id', 'farmer_id', 'category_id', 'name', 'unit', 'price', 'image', 'stock_quantity')
            ->limit(10)
            ->get();

        $farmers = User::where('role', 'farmer')
            ->where('is_active', true)
            ->whereHas('farmerProfile', function ($q2) use ($q) {
                $q2->where('approval_status', 'approved')
                   ->where('farm_name', 'like', "%{$q}%");
            })
            ->with('farmerProfile:id,user_id,farm_name,stall_number,market_id')
            ->select('id', 'name')
            ->limit(5)
            ->get()
            ->map(function ($farmer) {
                return [
                    'id'           => $farmer->id,
                    'name'         => $farmer->name,
                    'farm_name'    => $farmer->farmerProfile?->farm_name,
                    'stall_number' => $farmer->farmerProfile?->stall_number,
                    'market_id'    => $farmer->farmerProfile?->market_id,
                ];
            });

        $markets = Market::where('is_active', true)
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                      ->orWhere('address', 'like', "%{$q}%")
                      ->orWhere('city', 'like', "%{$q}%");
            })
            ->select('id', 'name', 'address', 'city', 'latitude', 'longitude')
            ->limit(5)
            ->get();

        return $this->success([
            'query'    => $q,
            'products' => $products,
            'farmers'  => $farmers,
            'markets'  => $markets,
        ], 'Search results retrieved');
    }
}
