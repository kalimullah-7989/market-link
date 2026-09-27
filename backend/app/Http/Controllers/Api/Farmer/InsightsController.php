<?php

namespace App\Http\Controllers\Api\Farmer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InsightsController extends Controller
{
    public function index(Request $request)
    {
        $farmerId = $request->user()->id;

        $totalCompleted = Order::where('farmer_id', $farmerId)
            ->where('order_status', 'completed')
            ->count();

        $pendingOrders = Order::where('farmer_id', $farmerId)
            ->whereIn('order_status', ['placed', 'accepted'])
            ->count();

        $weekStart = Carbon::now()->startOfWeek();
        $monthStart = Carbon::now()->startOfMonth();

        $revenueThisWeek = Order::where('farmer_id', $farmerId)
            ->where('order_status', 'completed')
            ->where('created_at', '>=', $weekStart)
            ->sum('total_amount');

        $revenueThisMonth = Order::where('farmer_id', $farmerId)
            ->where('order_status', 'completed')
            ->where('created_at', '>=', $monthStart)
            ->sum('total_amount');

        $bestSeller = OrderItem::whereHas('order', function ($q) use ($farmerId) {
                $q->where('farmer_id', $farmerId)
                  ->where('order_status', 'completed');
            })
            ->selectRaw('product_name, SUM(quantity) as total_sold')
            ->groupBy('product_name')
            ->orderByDesc('total_sold')
            ->first();

        $avgRating = Review::whereHas('order', function ($q) use ($farmerId) {
                $q->where('farmer_id', $farmerId);
            })
            ->avg('rating');

        $totalReviews = Review::whereHas('order', function ($q) use ($farmerId) {
                $q->where('farmer_id', $farmerId);
            })
            ->count();

        $data = [
            'total_completed_orders' => $totalCompleted,
            'pending_orders'         => $pendingOrders,
            'revenue_this_week'      => round((float) $revenueThisWeek, 2),
            'revenue_this_month'     => round((float) $revenueThisMonth, 2),
            'best_selling_product'   => $bestSeller ? $bestSeller->product_name : null,
            'average_rating'         => $avgRating ? round((float) $avgRating, 1) : null,
            'total_reviews'          => $totalReviews,
        ];

        return $this->success($data, 'Farmer insights retrieved');
    }
}
