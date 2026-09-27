<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalFarmers = User::where('role', 'farmer')->count();
        $pendingFarmers = FarmerProfile::where('approval_status', 'pending')->count();
        $totalCustomers = User::where('role', 'customer')->count();
        $totalMarkets = Market::where('is_active', true)->count();
        $totalOrders = Order::count();
        $completedOrders = Order::where('order_status', 'completed')->count();
        $grossSalesVolume = Order::where('order_status', 'completed')->sum('total_amount');

        $recentOrders = Order::with(['customer', 'farmer.farmerProfile', 'market'])
            ->latest()
            ->take(5)
            ->get();

        $mostActiveFarmers = User::where('role', 'farmer')
            ->with('farmerProfile')
            ->withCount(['farmerOrders' => function ($q) {
                $q->where('order_status', 'completed');
            }])
            ->orderBy('farmer_orders_count', 'desc')
            ->take(5)
            ->get();

        return $this->success([
            'metrics' => [
                'total_farmers' => $totalFarmers,
                'pending_farmers' => $pendingFarmers,
                'total_customers' => $totalCustomers,
                'total_markets' => $totalMarkets,
                'total_orders' => $totalOrders,
                'completed_orders' => $completedOrders,
                'gross_sales_volume' => round($grossSalesVolume, 2),
            ],
            'recent_orders' => $recentOrders,
            'most_active_farmers' => $mostActiveFarmers,
        ], 'Admin dashboard metrics retrieved');
    }

    public function farmers(Request $request)
    {
        $query = User::where('role', 'farmer')
            ->with(['farmerProfile.market'])
            ->withCount('farmerProducts');

        if ($request->filled('status')) {
            $query->whereHas('farmerProfile', function ($q) use ($request) {
                $q->where('approval_status', $request->status);
            });
        }

        $farmers = $query->latest()->paginate(15);

        return $this->success($farmers, 'Farmers list retrieved');
    }

    public function updateFarmerStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,suspended,pending,rejected',
            'reason' => 'nullable|string|max:500',
        ]);

        $farmer = User::where('role', 'farmer')->find($id);

        if (!$farmer || !$farmer->farmerProfile) {
            return $this->error('Farmer profile not found', 404);
        }

        $farmer->farmerProfile->update([
            'approval_status' => $validated['status'],
        ]);

        $statusLabel = $validated['status'];
        $title = $statusLabel === 'approved' 
            ? 'Stall Approved & Live!' 
            : ($statusLabel === 'rejected' 
                ? 'Stall Removed / Application Rejected' 
                : 'Stall Status Updated');

        $msg = $statusLabel === 'approved'
            ? "Congratulations! Your stall '{$farmer->farmerProfile->farm_name}' has been officially approved by Administrator and is now live on the marketplace."
            : "Your farmer stall status has been updated to: {$statusLabel} by MarketLink Administration.";

        if (!empty($validated['reason'])) {
            $msg .= " Official Reason: {$validated['reason']}";
        }

        Notification::create([
            'user_id' => $farmer->id,
            'title' => $title,
            'message' => $msg,
            'type' => 'status_updated',
        ]);

        return $this->success($farmer->load('farmerProfile.market'), "Farmer stall status updated to {$validated['status']}");
    }

    public function customers(Request $request)
    {
        $customers = User::where('role', 'customer')
            ->withCount('orders')
            ->latest()
            ->paginate(15);

        return $this->success($customers, 'Customers list retrieved');
    }

    public function toggleCustomerStatus(Request $request, $id)
    {
        $customer = User::where('role', 'customer')->find($id);

        if (!$customer) {
            return $this->error('Customer not found', 404);
        }

        $customer->is_active = !$customer->is_active;
        $customer->save();

        return $this->success($customer, 'Customer active status toggled');
    }

    public function storeMarket(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'required|string',
            'city' => 'nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'operating_days' => 'required|array',
            'opening_time' => 'nullable|string',
            'closing_time' => 'nullable|string',
        ]);

        $market = Market::create($validated);

        return $this->success($market, 'Market created successfully', 201);
    }

    public function updateMarket(Request $request, $id)
    {
        $market = Market::find($id);

        if (!$market) {
            return $this->error('Market not found', 404);
        }

        $market->update($request->all());

        return $this->success($market, 'Market updated successfully');
    }

    public function destroyMarket($id)
    {
        $market = Market::find($id);

        if (!$market) {
            return $this->error('Market not found', 404);
        }

        $market->delete();

        return $this->success(null, 'Market deleted successfully');
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:categories,slug',
            'icon' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category = Category::create($validated);

        return $this->success($category, 'Category created successfully', 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->error('Category not found', 404);
        }

        $category->update($request->all());

        return $this->success($category, 'Category updated successfully');
    }

    public function destroyCategory($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->error('Category not found', 404);
        }

        $category->delete();

        return $this->success(null, 'Category deleted successfully');
    }

    public function moderateProduct($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return $this->error('Product not found', 404);
        }

        $farmerId = $product->farmer_id;
        $productName = $product->name;

        $product->delete();

        Notification::create([
            'user_id' => $farmerId,
            'title' => 'Product Removed by Admin',
            'message' => "Your product '{$productName}' was removed due to platform policy violations.",
            'type' => 'moderation_product',
        ]);

        return $this->success(null, 'Product removed by admin moderation');
    }

    public function moderateReview($id)
    {
        $review = Review::find($id);

        if (!$review) {
            return $this->error('Review not found', 404);
        }

        $review->delete();

        return $this->success(null, 'Abusive review deleted by admin moderation');
    }
}
