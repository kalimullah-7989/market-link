<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = Favorite::where('user_id', $request->user()->id)
            ->with(['farmer.farmerProfile.market', 'product.category'])
            ->latest()
            ->get();

        return $this->success($favorites, 'Favorites retrieved');
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'farmer_id' => 'required_without:product_id|nullable|exists:users,id',
            'product_id' => 'required_without:farmer_id|nullable|exists:products,id',
        ]);

        $userId = $request->user()->id;
        $farmerId = $validated['farmer_id'] ?? null;
        $productId = $validated['product_id'] ?? null;

        $existing = Favorite::where('user_id', $userId)
            ->where('farmer_id', $farmerId)
            ->where('product_id', $productId)
            ->first();

        if ($existing) {
            $existing->delete();
            return $this->success(['favorited' => false], 'Removed from favorites');
        }

        $fav = Favorite::create([
            'user_id' => $userId,
            'farmer_id' => $farmerId,
            'product_id' => $productId,
        ]);

        return $this->success(['favorited' => true, 'favorite' => $fav], 'Added to favorites', 201);
    }
}
