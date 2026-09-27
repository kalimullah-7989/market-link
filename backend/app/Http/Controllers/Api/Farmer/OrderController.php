<?php

namespace App\Http\Controllers\Api\Farmer;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $farmer = $request->user();

        $query = Order::where('farmer_id', $farmer->id)
            ->with(['customer', 'items.product', 'market']);

        if ($request->filled('status')) {
            $query->where('order_status', $request->status);
        }

        if ($request->filled('pickup_date')) {
            $query->whereDate('pickup_date', $request->pickup_date);
        }

        $orders = $query->latest()->paginate(15);

        return $this->success($orders, 'Farmer orders retrieved');
    }

    public function updateStatus(Request $request, $id)
    {
        $farmer = $request->user();
        $order = Order::where('farmer_id', $farmer->id)->with('items')->find($id);

        if (!$order) {
            return $this->error('Order not found', 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:accepted,ready_for_pickup,declined',
            'reason' => 'nullable|string',
        ]);

        $newStatus = $validated['status'];

        if ($newStatus === 'declined') {
            DB::transaction(function () use ($order, $validated) {
                $order->update([
                    'order_status' => 'cancelled',
                    'cancelled_reason' => $validated['reason'] ?? 'Declined by farmer',
                ]);

                foreach ($order->items as $item) {
                    $product = Product::find($item->product_id);
                    if ($product) {
                        $product->increment('stock_quantity', $item->quantity);
                        if ($product->is_sold_out) {
                            $product->update(['is_sold_out' => false]);
                        }
                    }
                }

                Notification::create([
                    'user_id' => $order->customer_id,
                    'title' => 'Order Declined',
                    'message' => "Order #{$order->order_number} was declined by the farmer. Stock has been released.",
                    'type' => 'order_declined',
                    'order_id' => $order->id,
                ]);
            });

            return $this->success($order->fresh(), 'Order declined and stock returned');
        }

        $order->update([
            'order_status' => $newStatus,
        ]);

        if ($newStatus === 'ready_for_pickup') {
            $stall = $farmer->farmerProfile?->stall_number ?? 'our stall';
            Notification::create([
                'user_id' => $order->customer_id,
                'title' => 'Order Ready for Pickup!',
                'message' => "Your order #{$order->order_number} is packed and ready at {$stall}. Please bring cash at pickup.",
                'type' => 'order_ready',
                'order_id' => $order->id,
            ]);
        }

        return $this->success($order->fresh(), "Order status updated to {$newStatus}");
    }

    public function verifyOrder(Request $request)
    {
        $farmer = $request->user();

        $validated = $request->validate([
            'order_number' => 'required_without:pickup_token|nullable|string',
            'pickup_token' => 'required_without:order_number|nullable|string',
        ]);

        $query = Order::where('farmer_id', $farmer->id)->with(['customer', 'items']);

        if (!empty($validated['pickup_token'])) {
            $query->where('pickup_token', $validated['pickup_token']);
        } else {
            $query->where('order_number', $validated['order_number']);
        }

        $order = $query->first();

        if (!$order) {
            return $this->error('Order not found or does not belong to your stall', 404);
        }

        if ($order->order_status === 'completed') {
            return $this->error('This order has already been picked up and completed', 400);
        }

        if ($order->order_status === 'cancelled') {
            return $this->error('Cannot verify a cancelled order', 400);
        }

        $order->update([
            'order_status' => 'completed',
            'payment_status' => 'paid_cash',
            'completed_at' => Carbon::now(),
        ]);

        Notification::create([
            'user_id' => $order->customer_id,
            'title' => 'Order Completed!',
            'message' => "Order #{$order->order_number} was successfully picked up. Thank you! Please leave a review.",
            'type' => 'order_completed',
            'order_id' => $order->id,
        ]);

        return $this->success([
            'order_number' => $order->order_number,
            'customer_name' => $order->customer->name,
            'total_cash_collected' => $order->total_amount,
            'items_count' => $order->items->count(),
            'order_status' => 'completed',
            'payment_status' => 'paid_cash',
            'completed_at' => $order->completed_at->format('Y-m-d H:i:s'),
        ], 'Order successfully verified, picked up, and marked as Cash Paid!');
    }
}
