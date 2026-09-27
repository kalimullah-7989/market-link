<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\FarmerProfile;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $items = CartItem::where('user_id', $request->user()->id)
            ->with(['product.farmer.farmerProfile', 'product.category'])
            ->get();

        $grandTotal = 0;
        $formatted = $items->map(function ($item) use (&$grandTotal) {
            $subtotal = $item->product->price * $item->quantity;
            $grandTotal += $subtotal;

            return [
                'cart_item_id'   => $item->id,
                'product_id'     => $item->product->id,
                'product_name'   => $item->product->name,
                'unit'           => $item->product->unit,
                'unit_price'     => $item->product->price,
                'quantity'       => $item->quantity,
                'subtotal'       => round($subtotal, 2),
                'available_stock' => $item->product->stock_quantity,
                'is_sold_out'    => $item->product->is_sold_out,
                'farmer_id'      => $item->product->farmer_id,
                'farmer_name'    => $item->product->farmer?->name,
                'farm_name'      => $item->product->farmer?->farmerProfile?->farm_name,
                'image'          => $item->product->image,
                'freshness_tag'  => $item->product->freshness_tag,
                'is_low_stock'   => $item->product->is_low_stock,
            ];
        });

        return $this->success([
            'items'       => $formatted,
            'item_count'  => $items->count(),
            'grand_total' => round($grandTotal, 2),
            'payment_method' => 'cash_on_pickup',
        ], 'Cart retrieved successfully');
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $product = Product::find($validated['product_id']);

        if ($product->is_sold_out || $product->is_temporarily_unavailable) {
            return $this->error("'{$product->name}' is currently unavailable", 400);
        }

        if ($product->stock_quantity <= 0) {
            return $this->error("'{$product->name}' is out of stock", 400);
        }

        $existing = CartItem::where('user_id', $request->user()->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        $newQuantity = $validated['quantity'];

        if ($existing) {
            $newQuantity = $existing->quantity + $validated['quantity'];
        }

        if ($newQuantity > $product->stock_quantity) {
            return $this->error(
                "Cannot add {$validated['quantity']} more. Only {$product->stock_quantity} {$product->unit} available.",
                422
            );
        }

        $cartItem = CartItem::updateOrCreate(
            ['user_id' => $request->user()->id, 'product_id' => $validated['product_id']],
            ['quantity' => $newQuantity]
        );

        return $this->success([
            'cart_item_id' => $cartItem->id,
            'product_id'   => $product->id,
            'product_name' => $product->name,
            'quantity'     => $cartItem->quantity,
            'subtotal'     => round($product->price * $cartItem->quantity, 2),
        ], 'Item added to cart', 201);
    }

    public function update(Request $request, $id)
    {
        $cartItem = CartItem::where('user_id', $request->user()->id)->find($id);

        if (!$cartItem) {
            return $this->error('Cart item not found', 404);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::find($cartItem->product_id);

        if ($product->is_sold_out || $product->is_temporarily_unavailable) {
            return $this->error("'{$product->name}' is currently unavailable", 400);
        }

        if ($validated['quantity'] > $product->stock_quantity) {
            return $this->error(
                "Only {$product->stock_quantity} {$product->unit} available.",
                422
            );
        }

        $cartItem->update(['quantity' => $validated['quantity']]);

        return $this->success([
            'cart_item_id' => $cartItem->id,
            'quantity'     => $cartItem->quantity,
            'subtotal'     => round($product->price * $cartItem->quantity, 2),
        ], 'Cart item updated');
    }

    public function remove(Request $request, $id)
    {
        $cartItem = CartItem::where('user_id', $request->user()->id)->find($id);

        if (!$cartItem) {
            return $this->error('Cart item not found', 404);
        }

        $cartItem->delete();

        return $this->success(null, 'Item removed from cart');
    }

    public function clear(Request $request)
    {
        CartItem::where('user_id', $request->user()->id)->delete();

        return $this->success(null, 'Cart cleared');
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'pickup_date'      => 'required|date|after_or_equal:today',
            'pickup_time_slot' => 'required|string',
            'farmer_notes'     => 'nullable|string',
        ]);

        $cartItems = CartItem::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return $this->error('Your cart is empty', 400);
        }

        $byFarmer = $cartItems->groupBy(fn ($item) => $item->product->farmer_id);

        $placedOrders = [];
        $failedItems  = [];

        foreach ($byFarmer as $farmerId => $items) {
            $farmerProfile = FarmerProfile::where('user_id', $farmerId)->first();

            if (!$farmerProfile || $farmerProfile->approval_status !== 'approved') {
                foreach ($items as $item) {
                    $failedItems[] = [
                        'product_name' => $item->product->name,
                        'reason'       => 'Farmer is not currently accepting orders',
                    ];
                }
                continue;
            }

            $cutoffHours  = $farmerProfile->cutoff_hours ?? 4;
            $slotTimeStr  = trim(explode('-', $validated['pickup_time_slot'])[0]);

            try {
                $slotDateTime = Carbon::parse($validated['pickup_date'] . ' ' . $slotTimeStr);
            } catch (\Exception $e) {
                $slotDateTime = Carbon::parse($validated['pickup_date'] . ' 08:00 AM');
            }

            $cutoffDateTime = $slotDateTime->copy()->subHours($cutoffHours);

            if (Carbon::now()->greaterThanOrEqualTo($cutoffDateTime)) {
                foreach ($items as $item) {
                    $failedItems[] = [
                        'product_name' => $item->product->name,
                        'reason'       => 'Cut-off time has passed for this pickup slot',
                    ];
                }
                continue;
            }

            try {
                $order = DB::transaction(function () use (
                    $request, $validated, $farmerId, $farmerProfile, $cutoffDateTime, $items
                ) {
                    $totalAmount  = 0;
                    $itemsToCreate = [];

                    foreach ($items as $cartItem) {
                        $product = Product::where('id', $cartItem->product_id)
                            ->lockForUpdate()
                            ->first();

                        if ($product->is_sold_out || $product->is_temporarily_unavailable) {
                            throw new \Exception("'{$product->name}' is currently unavailable");
                        }

                        if ($product->stock_quantity < $cartItem->quantity) {
                            throw new \Exception(
                                "Insufficient stock for '{$product->name}'. Available: {$product->stock_quantity}"
                            );
                        }

                        $subtotal     = $product->price * $cartItem->quantity;
                        $totalAmount += $subtotal;

                        $product->decrement('stock_quantity', $cartItem->quantity);
                        $remaining = $product->fresh()->stock_quantity;

                        if ($remaining <= 0) {
                            $product->update(['is_sold_out' => true]);
                            Notification::create([
                                'user_id' => $farmerId,
                                'title'   => "Product Sold Out: {$product->name}",
                                'message' => "'{$product->name}' is now completely sold out.",
                                'type'    => 'stock_alert',
                            ]);
                        } elseif ($remaining <= 5) {
                            Notification::create([
                                'user_id' => $farmerId,
                                'title'   => "Low Stock Alert: {$product->name}",
                                'message' => "Only {$remaining} {$product->unit} remaining for '{$product->name}'. Please update inventory.",
                                'type'    => 'low_stock',
                            ]);
                        }

                        $itemsToCreate[] = [
                            'product_id'   => $product->id,
                            'product_name' => $product->name,
                            'unit'         => $product->unit,
                            'quantity'     => $cartItem->quantity,
                            'unit_price'   => $product->price,
                            'subtotal'     => round($subtotal, 2),
                        ];
                    }

                    $orderNumber = 'ML-' . date('ymd') . '-' . strtoupper(Str::random(4));
                    $pickupToken = 'PK-' . strtoupper(Str::random(8));

                    $order = Order::create([
                        'order_number'     => $orderNumber,
                        'customer_id'      => $request->user()->id,
                        'farmer_id'        => $farmerId,
                        'market_id'        => $farmerProfile->market_id,
                        'pickup_date'      => $validated['pickup_date'],
                        'pickup_time_slot' => $validated['pickup_time_slot'],
                        'cutoff_datetime'  => $cutoffDateTime,
                        'total_amount'     => round($totalAmount, 2),
                        'order_status'     => 'placed',
                        'payment_status'   => 'unpaid_cash',
                        'pickup_token'     => $pickupToken,
                        'farmer_notes'     => $validated['farmer_notes'] ?? null,
                    ]);

                    foreach ($itemsToCreate as $item) {
                        $order->items()->create($item);
                    }

                    Notification::create([
                        'user_id'  => $farmerId,
                        'title'    => 'New Order from Cart Checkout',
                        'message'  => "Order #{$order->order_number} placed by {$request->user()->name} via cart checkout for {$order->pickup_date}",
                        'type'     => 'order_placed',
                        'order_id' => $order->id,
                    ]);

                    return $order->load(['items', 'market', 'farmer.farmerProfile']);
                });

                $placedOrders[] = [
                    'id'             => $order->id,
                    'order_number'   => $order->order_number,
                    'pickup_token'   => $order->pickup_token,
                    'status'         => $order->order_status,
                    'total'          => $order->total_amount,
                    'payment_method' => 'cash_on_pickup',
                ];
            } catch (\Exception $e) {
                foreach ($items as $item) {
                    $failedItems[] = [
                        'product_name' => $item->product->name,
                        'reason'       => $e->getMessage(),
                    ];
                }
            }
        }

        if (!empty($placedOrders)) {
            $successFarmerIds = collect($byFarmer)->keys()->filter(function ($farmerId) use ($placedOrders, $byFarmer) {
                $farmerOrderNumbers = collect($placedOrders)->pluck('order_number');
                return $farmerOrderNumbers->isNotEmpty();
            });

            $successProductIds = $cartItems->filter(function ($cartItem) use ($failedItems) {
                $failedNames = collect($failedItems)->pluck('product_name');
                return !$failedNames->contains($cartItem->product->name);
            })->pluck('id');

            CartItem::whereIn('id', $successProductIds)->delete();
        }

        $message = empty($placedOrders)
            ? 'Checkout failed. No orders were placed.'
            : 'Checkout successful. Pay cash at the stall on pickup.';

        $statusCode = empty($placedOrders) ? 422 : 201;

        return $this->success([
            'orders'        => $placedOrders,
            'items_failed'  => $failedItems,
            'payment_note'  => 'All payments are cash-on-pickup at the stall. No online payment required.',
        ], $message, $statusCode);
    }
}
