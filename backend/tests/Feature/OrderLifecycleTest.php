<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderLifecycleTest extends TestCase
{
    use RefreshDatabase;

    private $customer;
    private $farmer;
    private $market;
    private $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->market = Market::create([
            'name' => 'Lahore Sunday Bazaar',
            'address' => 'Gulberg',
            'latitude' => 31.52,
            'longitude' => 74.35,
            'operating_days' => ['Sunday'],
        ]);

        $this->customer = User::create([
            'name' => 'Ali Customer',
            'email' => 'ali@customer.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
            'phone' => '03001234567',
        ]);

        $this->farmer = User::create([
            'name' => 'Sultan Farmer',
            'email' => 'sultan@farm.com',
            'password' => bcrypt('password123'),
            'role' => 'farmer',
        ]);

        FarmerProfile::create([
            'user_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'farm_name' => 'Sultan Organic Farm',
            'stall_number' => 'Stall #10',
            'cutoff_hours' => 4,
            'approval_status' => 'approved',
        ]);

        $category = Category::create(['name' => 'Vegetables', 'slug' => 'vegetables']);

        $this->product = Product::create([
            'farmer_id' => $this->farmer->id,
            'category_id' => $category->id,
            'name' => 'Fresh Carrots',
            'unit' => 'kg',
            'price' => 80.00,
            'stock_quantity' => 20,
            'is_sold_out' => false,
        ]);
    }

    public function test_customer_can_place_pre_order_and_stock_decrements(): void
    {
        $pickupDate = Carbon::now()->addDays(2)->format('Y-m-d');

        $response = $this->actingAs($this->customer, 'sanctum')->postJson('/api/customer/orders', [
            'farmer_id' => $this->farmer->id,
            'pickup_date' => $pickupDate,
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'items' => [
                [
                    'product_id' => $this->product->id,
                    'quantity' => 5,
                ],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'order_status' => 'placed',
                    'payment_status' => 'unpaid_cash',
                    'total_amount' => 400.00,
                ],
            ]);

        $this->assertEquals(15, $this->product->fresh()->stock_quantity);
    }

    public function test_customer_can_cancel_order_before_cutoff_and_stock_restores(): void
    {
        $pickupDate = Carbon::now()->addDays(3)->format('Y-m-d');

        $orderRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/customer/orders', [
            'farmer_id' => $this->farmer->id,
            'pickup_date' => $pickupDate,
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'items' => [
                [
                    'product_id' => $this->product->id,
                    'quantity' => 4,
                ],
            ],
        ]);

        $orderId = $orderRes->json('data.id');
        $this->assertEquals(16, $this->product->fresh()->stock_quantity);

        $cancelRes = $this->actingAs($this->customer, 'sanctum')->postJson("/api/customer/orders/{$orderId}/cancel", [
            'reason' => 'Change of schedule',
        ]);

        $cancelRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'order_status' => 'cancelled',
                ],
            ]);

        $this->assertEquals(20, $this->product->fresh()->stock_quantity);
    }

    public function test_customer_cannot_cancel_order_after_cutoff(): void
    {
        $pickupDate = Carbon::now()->addDays(2)->format('Y-m-d');

        $orderRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/customer/orders', [
            'farmer_id' => $this->farmer->id,
            'pickup_date' => $pickupDate,
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'items' => [
                [
                    'product_id' => $this->product->id,
                    'quantity' => 2,
                ],
            ],
        ]);

        $orderId = $orderRes->json('data.id');
        $order = Order::find($orderId);

        // Artificially simulate that cut-off has passed (1 hour ago)
        $order->cutoff_datetime = Carbon::now()->subHour();
        $order->save();

        $cancelRes = $this->actingAs($this->customer, 'sanctum')->postJson("/api/customer/orders/{$orderId}/cancel");

        $cancelRes->assertStatus(403);
    }

    public function test_customer_can_view_receipt_slip(): void
    {
        $pickupDate = Carbon::now()->addDays(2)->format('Y-m-d');

        $orderRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/customer/orders', [
            'farmer_id' => $this->farmer->id,
            'pickup_date' => $pickupDate,
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'items' => [
                ['product_id' => $this->product->id, 'quantity' => 3],
            ],
        ]);

        $orderId = $orderRes->json('data.id');

        $receiptRes = $this->actingAs($this->customer, 'sanctum')->getJson("/api/customer/orders/{$orderId}/receipt");

        $receiptRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_amount' => 240.00,
                    'payment_mode' => 'Cash on Pickup (In-Person)',
                    'payment_status' => 'unpaid_cash',
                ],
            ]);
    }

    public function test_farmer_can_verify_and_complete_order_in_stall(): void
    {
        $pickupDate = Carbon::now()->addDays(2)->format('Y-m-d');

        $orderRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/customer/orders', [
            'farmer_id' => $this->farmer->id,
            'pickup_date' => $pickupDate,
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'items' => [
                ['product_id' => $this->product->id, 'quantity' => 2],
            ],
        ]);

        $orderNumber = $orderRes->json('data.order_number');
        $orderId = $orderRes->json('data.id');

        $this->actingAs($this->farmer, 'sanctum')->postJson("/api/farmer/orders/{$orderId}/status", [
            'status' => 'ready_for_pickup',
        ])->assertStatus(200);

        $verifyRes = $this->actingAs($this->farmer, 'sanctum')->postJson('/api/farmer/verify-order', [
            'order_number' => $orderNumber,
        ]);

        $verifyRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'order_status' => 'completed',
                    'payment_status' => 'paid_cash',
                    'total_cash_collected' => 160.00,
                ],
            ]);

        $this->assertEquals('completed', Order::find($orderId)->order_status);
        $this->assertEquals('paid_cash', Order::find($orderId)->payment_status);
    }
}
