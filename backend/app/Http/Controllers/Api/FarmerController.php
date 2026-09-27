<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;

class FarmerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'farmer')
            ->where('is_active', true)
            ->with(['farmerProfile.market'])
            ->whereHas('farmerProfile', function ($q) {
                $q->where('approval_status', 'approved');
            });

        if ($request->filled('market_id')) {
            $query->whereHas('farmerProfile', function ($q) use ($request) {
                $q->where('market_id', $request->market_id);
            });
        }

        $farmers = $query->get()->map(function ($farmer) {
            $profile = $farmer->farmerProfile;

            $avgRating = Review::whereHas('order', function ($q) use ($farmer) {
                $q->where('farmer_id', $farmer->id);
            })->avg('rating');

            $totalReviews = Review::whereHas('order', function ($q) use ($farmer) {
                $q->where('farmer_id', $farmer->id);
            })->count();

            return [
                'id'             => $farmer->id,
                'name'           => $farmer->name,
                'farm_name'      => $profile->farm_name,
                'stall_number'   => $profile->stall_number,
                'bio'            => $profile->bio,
                'market_id'      => $profile->market_id,
                'market_name'    => $profile->market?->name,
                'average_rating' => $avgRating ? round((float) $avgRating, 1) : null,
                'total_reviews'  => $totalReviews,
            ];
        });

        return $this->success($farmers, 'Farmers list retrieved');
    }

    public function show($id)
    {
        $farmer = User::where('id', $id)
            ->where('role', 'farmer')
            ->where('is_active', true)
            ->with(['farmerProfile.market'])
            ->whereHas('farmerProfile', function ($q) {
                $q->where('approval_status', 'approved');
            })
            ->first();

        if (!$farmer) {
            return $this->error('Farmer not found', 404);
        }

        $profile = $farmer->farmerProfile;

        $avgRating = Review::whereHas('order', function ($q) use ($id) {
            $q->where('farmer_id', $id);
        })->avg('rating');

        $totalReviews = Review::whereHas('order', function ($q) use ($id) {
            $q->where('farmer_id', $id);
        })->count();

        $activeProducts = $farmer->farmerProducts()
            ->where('is_sold_out', false)
            ->where('is_temporarily_unavailable', false)
            ->count();

        $reviews = Review::whereHas('order', function ($q) use ($id) {
                $q->where('farmer_id', $id);
            })
            ->with('customer:id,name')
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($review) {
                return [
                    'rating'        => $review->rating,
                    'comment'       => $review->comment,
                    'farmer_reply'  => $review->farmer_reply,
                    'customer_name' => $review->customer?->name,
                    'date'          => $review->created_at->format('Y-m-d'),
                ];
            });

        $data = [
            'id'              => $farmer->id,
            'name'            => $farmer->name,
            'farm_name'       => $profile->farm_name,
            'stall_number'    => $profile->stall_number,
            'bio'             => $profile->bio,
            'farm_address'    => $profile->farm_address,
            'market_name'     => $profile->market?->name,
            'market_address'  => $profile->market?->address,
            'operating_days'  => $profile->market?->operating_days,
            'active_products' => $activeProducts,
            'average_rating'  => $avgRating ? round((float) $avgRating, 1) : null,
            'total_reviews'   => $totalReviews,
            'reviews'         => $reviews,
        ];

        return $this->success($data, 'Farmer profile retrieved');
    }

    public function pickupSlots($id)
    {
        $farmer = User::where('id', $id)
            ->where('role', 'farmer')
            ->whereHas('farmerProfile', function ($q) {
                $q->where('approval_status', 'approved');
            })
            ->first();

        if (!$farmer) {
            return $this->error('Farmer not found', 404);
        }

        $profile = $farmer->farmerProfile;

        return $this->success([
            'farmer_id'     => $farmer->id,
            'farm_name'     => $profile->farm_name,
            'pickup_slots'  => $profile->pickup_slots ?? [],
            'cutoff_hours'  => $profile->cutoff_hours,
            'market_name'   => $profile->market?->name,
            'operating_days' => $profile->market?->operating_days,
        ], 'Pickup slots retrieved');
    }
}
