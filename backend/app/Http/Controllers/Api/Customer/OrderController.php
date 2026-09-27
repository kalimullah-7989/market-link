<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\FarmerProfile;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('customer_id', $request->user()->id)
            ->with(['farmer.farmerProfile', 'market', 'items'])
            ->latest()
            ->paginate(10);

        return $this->success($orders, 'Customer orders retrieved');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'farmer_id' => 'required|exists:users,id',
            'pickup_date' => 'required|date|after_or_equal:today',
            'pickup_time_slot' => 'required|string',
            'farmer_notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $farmerProfile = FarmerProfile::where('user_id', $validated['farmer_id'])->first();
        if (!$farmerProfile || $farmerProfile->approval_status !== 'approved') {
            return $this->error('Farmer is not currently accepting orders', 400);
        }

        $cutoffHours = $farmerProfile->cutoff_hours ?? 4;

        $slotTimeStr = explode('-', $validated['pickup_time_slot'])[0];
        $slotTimeStr = trim($slotTimeStr);

        try {
            $slotDateTime = Carbon::parse($validated['pickup_date'] . ' ' . $slotTimeStr);
        } catch (\Exception $e) {
            $slotDateTime = Carbon::parse($validated['pickup_date'] . ' 08:00 AM');
        }

        $cutoffDateTime = $slotDateTime->copy()->subHours($cutoffHours);

        if (Carbon::now()->greaterThanOrEqualTo($cutoffDateTime)) {
            return $this->error('The cut-off time for this pickup slot has already passed. Please select a later date or slot.', 422);
        }

        return DB::transaction(function () use ($request, $validated, $farmerProfile, $cutoffDateTime) {
            $totalAmount = 0;
            $itemsToCreate = [];

            foreach ($validated['items'] as $itemData) {
                $product = Product::where('id', $itemData['product_id'])
                    ->where('farmer_id', $validated['farmer_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$product) {
                    throw new \Exception("Product #{$itemData['product_id']} does not belong to this farmer");
                }

                if ($product->is_sold_out || $product->is_temporarily_unavailable) {
                    throw new \Exception("Product '{$product->name}' is currently unavailable");
                }

                if ($product->stock_quantity < $itemData['quantity']) {
                    throw new \Exception("Insufficient stock for '{$product->name}'. Available: {$product->stock_quantity}");
                }

                $subtotal = $product->price * $itemData['quantity'];
                $totalAmount += $subtotal;

                $product->decrement('stock_quantity', $itemData['quantity']);
                $remainingStock = $product->fresh()->stock_quantity;

                if ($remainingStock <= 0) {
                    $product->update(['is_sold_out' => true]);
                    Notification::create([
                        'user_id' => $validated['farmer_id'],
                        'title'   => "Product Sold Out: {$product->name}",
                        'message' => "'{$product->name}' is now completely sold out.",
                        'type'    => 'stock_alert',
                    ]);
                } elseif ($remainingStock <= 5) {
                    Notification::create([
                        'user_id' => $validated['farmer_id'],
                        'title'   => "Low Stock Alert: {$product->name}",
                        'message' => "Only {$remainingStock} {$product->unit} remaining for '{$product->name}'. Please update inventory.",
                        'type'    => 'low_stock',
                    ]);
                }

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit' => $product->unit,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                ];
            }

            $orderNumber = 'ML-' . date('ymd') . '-' . strtoupper(Str::random(4));
            $pickupToken = 'PK-' . strtoupper(Str::random(8));

            $order = Order::create([
                'order_number' => $orderNumber,
                'customer_id' => $request->user()->id,
                'farmer_id' => $validated['farmer_id'],
                'market_id' => $farmerProfile->market_id,
                'pickup_date' => $validated['pickup_date'],
                'pickup_time_slot' => $validated['pickup_time_slot'],
                'cutoff_datetime' => $cutoffDateTime,
                'total_amount' => $totalAmount,
                'order_status' => 'placed',
                'payment_status' => 'unpaid_cash',
                'pickup_token' => $pickupToken,
                'farmer_notes' => $validated['farmer_notes'] ?? null,
            ]);

            foreach ($itemsToCreate as $item) {
                $order->items()->create($item);
            }

            Notification::create([
                'user_id' => $validated['farmer_id'],
                'title' => 'New Pre-Order Placed',
                'message' => "Order #{$order->order_number} placed by {$request->user()->name} for {$order->pickup_date}",
                'type' => 'order_placed',
                'order_id' => $order->id,
            ]);

            return $this->success(
                $order->load(['items', 'market', 'farmer.farmerProfile']),
                'Pre-order placed successfully',
                201
            );
        });
    }

    public function show(Request $request, $id)
    {
        $order = Order::where('customer_id', $request->user()->id)
            ->with(['farmer.farmerProfile', 'market', 'items', 'review'])
            ->find($id);

        if (!$order) {
            return $this->error('Order not found', 404);
        }

        $now = Carbon::now();
        $isCutoffPassed = $now->greaterThanOrEqualTo($order->cutoff_datetime);
        $remainingSeconds = $isCutoffPassed ? 0 : $now->diffInSeconds($order->cutoff_datetime);

        return $this->success([
            'order'                    => $order,
            'is_cutoff_passed'         => $isCutoffPassed,
            'can_modify_or_cancel'     => $order->canBeModifiedOrCancelled(),
            'cutoff_remaining_seconds' => $remainingSeconds,
        ], 'Order details retrieved');
    }

    public function update(Request $request, $id)
    {
        $order = Order::where('customer_id', $request->user()->id)
            ->with('items')
            ->find($id);

        if (!$order) {
            return $this->error('Order not found', 404);
        }

        if (in_array($order->order_status, ['completed', 'cancelled'])) {
            return $this->error("Cannot edit an order with status: {$order->order_status}", 400);
        }

        if (Carbon::now()->greaterThanOrEqualTo($order->cutoff_datetime)) {
            return $this->error('Cut-off time has passed. This order can no longer be modified.', 403);
        }

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'farmer_notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($order, $validated, $request) {
            foreach ($order->items as $oldItem) {
                $product = Product::find($oldItem->product_id);
                if ($product) {
                    $product->increment('stock_quantity', $oldItem->quantity);
                    if ($product->is_sold_out) {
                        $product->update(['is_sold_out' => false]);
                    }
                }
            }

            $order->items()->delete();

            $newTotal = 0;
            foreach ($validated['items'] as $itemData) {
                $product = Product::where('id', $itemData['product_id'])
                    ->where('farmer_id', $order->farmer_id)
                    ->lockForUpdate()
                    ->first();

                if (!$product) {
                    throw new \Exception("Product #{$itemData['product_id']} does not belong to this farmer");
                }

                if ($product->is_sold_out || $product->is_temporarily_unavailable) {
                    throw new \Exception("Product '{$product->name}' is currently unavailable");
                }

                if ($product->stock_quantity < $itemData['quantity']) {
                    throw new \Exception("Not enough stock for '{$product->name}'. Only {$product->stock_quantity} left.");
                }

                $subtotal = $product->price * $itemData['quantity'];
                $newTotal += $subtotal;

                $product->decrement('stock_quantity', $itemData['quantity']);
                $remainingStock = $product->fresh()->stock_quantity;

                if ($remainingStock <= 0) {
                    $product->update(['is_sold_out' => true]);
                    Notification::create([
                        'user_id' => $order->farmer_id,
                        'title'   => "Product Sold Out: {$product->name}",
                        'message' => "'{$product->name}' is now completely sold out.",
                        'type'    => 'stock_alert',
                    ]);
                } elseif ($remainingStock <= 5) {
                    Notification::create([
                        'user_id' => $order->farmer_id,
                        'title'   => "Low Stock Alert: {$product->name}",
                        'message' => "Only {$remainingStock} {$product->unit} remaining for '{$product->name}'. Please update inventory.",
                        'type'    => 'low_stock',
                    ]);
                }

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit' => $product->unit,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                ]);
            }

            $order->update([
                'total_amount' => $newTotal,
                'farmer_notes' => $validated['farmer_notes'] ?? $order->farmer_notes,
            ]);

            Notification::create([
                'user_id' => $order->farmer_id,
                'title' => 'Order Modified by Customer',
                'message' => "Order #{$order->order_number} was updated by {$request->user()->name} before cutoff.",
                'type' => 'order_modified',
                'order_id' => $order->id,
            ]);

            return $this->success(
                $order->fresh()->load(['items', 'market', 'farmer.farmerProfile']),
                'Order updated successfully'
            );
        });
    }

    public function cancel(Request $request, $id)
    {
        $order = Order::where('customer_id', $request->user()->id)->find($id);

        if (!$order) {
            return $this->error('Order not found', 404);
        }

        if (in_array($order->order_status, ['completed', 'cancelled'])) {
            return $this->error("Cannot cancel order with status: {$order->order_status}", 400);
        }

        if (Carbon::now()->greaterThanOrEqualTo($order->cutoff_datetime)) {
            return $this->error('Cut-off time has passed. This order can no longer be cancelled.', 403);
        }

        DB::transaction(function () use ($order, $request) {
            $order->update([
                'order_status' => 'cancelled',
                'cancelled_reason' => $request->input('reason', 'Cancelled by customer before cutoff'),
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
                'user_id' => $order->farmer_id,
                'title' => 'Order Cancelled',
                'message' => "Order #{$order->order_number} was cancelled by customer before cutoff",
                'type' => 'order_cancelled',
                'order_id' => $order->id,
            ]);
        });

        return $this->success($order->fresh(), 'Order cancelled successfully and stock restored');
    }

    public function receipt(Request $request, $id)
    {
        $order = Order::where('customer_id', $request->user()->id)
            ->with(['farmer.farmerProfile', 'market', 'items', 'customer'])
            ->find($id);

        if (!$order) {
            return $this->error('Order not found', 404);
        }

        $receiptData = [
            'order_number' => $order->order_number,
            'pickup_token' => $order->pickup_token,
            'customer_name' => $order->customer->name,
            'customer_phone' => $order->customer->phone,
            'farmer_name' => $order->farmer->name,
            'farm_name' => $order->farmer->farmerProfile?->farm_name,
            'stall_number' => $order->farmer->farmerProfile?->stall_number,
            'market_name' => $order->market?->name,
            'market_address' => $order->market?->address,
            'pickup_date' => $order->pickup_date->format('Y-m-d'),
            'pickup_time_slot' => $order->pickup_time_slot,
            'order_status' => $order->order_status,
            'payment_mode' => 'Cash on Pickup (In-Person)',
            'payment_status' => $order->payment_status,
            'items' => $order->items,
            'total_amount' => $order->total_amount,
            'created_at' => $order->created_at->format('Y-m-d H:i:s'),
        ];

        return $this->success($receiptData, 'Receipt generated successfully');
    }

    public function reorder(Request $request, $id)
    {
        $pastOrder = Order::where('customer_id', $request->user()->id)
            ->with('items.product')
            ->find($id);

        if (!$pastOrder) {
            return $this->error('Past order not found', 404);
        }

        $itemsSummary = [];
        foreach ($pastOrder->items as $item) {
            $itemsSummary[] = [
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'quantity' => $item->quantity,
                'unit_price' => $item->product?->price ?? $item->unit_price,
                'available_stock' => $item->product?->stock_quantity ?? 0,
                'is_available' => ($item->product && !$item->product->is_sold_out && $item->product->stock_quantity >= $item->quantity),
            ];
        }

        return $this->success([
            'farmer_id' => $pastOrder->farmer_id,
            'market_id' => $pastOrder->market_id,
            'items' => $itemsSummary,
        ], 'Reorder data prepared');
    }
}
