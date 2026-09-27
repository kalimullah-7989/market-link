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

class OrderModifyTest extends TestCase
{
    use RefreshDatabase;

    private $customer;
    private $farmer;
    private $product1;
    private $product2;
    private $market;

    protected function setUp(): void
    {
        parent::setUp();

        $this->market = Market::create([
            'name' => 'Test Market',
            'address' => 'Lahore',
            'latitude' => 31.52,
            'longitude' => 74.35,
            'operating_days' => ['Saturday'],
        ]);

        $this->customer = User::create([
            'name' => 'Test Customer',
            'email' => 'test@customer.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
        ]);

        $this->farmer = User::create([
            'name' => 'Test Farmer',
            'email' => 'test@farmer.com',
            'password' => bcrypt('password123'),
            'role' => 'farmer',
        ]);

        FarmerProfile::create([
            'user_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'farm_name' => 'Test Farm',
            'cutoff_hours' => 4,
            'approval_status' => 'approved',
            'pickup_slots' => ['10:00 AM - 12:00 PM'],
        ]);

        $category = Category::create(['name' => 'Vegetables', 'slug' => 'vegetables']);

        $this->product1 = Product::create([
            'farmer_id' => $this->farmer->id,
            'category_id' => $category->id,
            'name' => 'Tomatoes',
            'unit' => 'kg',
            'price' => 100,
            'stock_quantity' => 30,
        ]);

        $this->product2 = Product::create([
            'farmer_id' => $this->farmer->id,
            'category_id' => $category->id,
            'name' => 'Potatoes',
            'unit' => 'kg',
            'price' => 80,
            'stock_quantity' => 50,
        ]);
    }

    public function test_customer_can_modify_order_before_cutoff(): void
    {
        $pickupDate = Carbon::now()->addDays(3)->format('Y-m-d');

        $placeRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/customer/orders', [
            'farmer_id' => $this->farmer->id,
            'pickup_date' => $pickupDate,
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'items' => [
                ['product_id' => $this->product1->id, 'quantity' => 5],
            ],
        ]);

        $orderId = $placeRes->json('data.id');
        $this->assertEquals(25, $this->product1->fresh()->stock_quantity);

        // Update: swap to product2 and change quantity
        $editRes = $this->actingAs($this->customer, 'sanctum')->putJson("/api/customer/orders/{$orderId}", [
            'items' => [
                ['product_id' => $this->product2->id, 'quantity' => 3],
            ],
        ]);

        $editRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_amount' => 240.00,
                ],
            ]);

        // product1 stock should be fully restored back to 30
        $this->assertEquals(30, $this->product1->fresh()->stock_quantity);

        // product2 stock should have 3 deducted (50 - 3 = 47)
        $this->assertEquals(47, $this->product2->fresh()->stock_quantity);
    }

    public function test_customer_cannot_modify_order_after_cutoff(): void
    {
        $pickupDate = Carbon::now()->addDays(2)->format('Y-m-d');

        $placeRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/customer/orders', [
            'farmer_id' => $this->farmer->id,
            'pickup_date' => $pickupDate,
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'items' => [
                ['product_id' => $this->product1->id, 'quantity' => 2],
            ],
        ]);

        $orderId = $placeRes->json('data.id');

        // Force cutoff to have passed
        Order::where('id', $orderId)->update([
            'cutoff_datetime' => Carbon::now()->subHours(2),
        ]);

        $editRes = $this->actingAs($this->customer, 'sanctum')->putJson("/api/customer/orders/{$orderId}", [
            'items' => [
                ['product_id' => $this->product2->id, 'quantity' => 1],
            ],
        ]);

        $editRes->assertStatus(403);
    }

    public function test_modify_order_recalculates_total_correctly(): void
    {
        $pickupDate = Carbon::now()->addDays(3)->format('Y-m-d');

        $placeRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/customer/orders', [
            'farmer_id' => $this->farmer->id,
            'pickup_date' => $pickupDate,
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'items' => [
                ['product_id' => $this->product1->id, 'quantity' => 2],
            ],
        ]);

        // Initial total: 2 x 100 = 200
        $this->assertEquals(200.00, $placeRes->json('data.total_amount'));

        $orderId = $placeRes->json('data.id');

        // Modify: add product2 as well
        $editRes = $this->actingAs($this->customer, 'sanctum')->putJson("/api/customer/orders/{$orderId}", [
            'items' => [
                ['product_id' => $this->product1->id, 'quantity' => 4],
                ['product_id' => $this->product2->id, 'quantity' => 2],
            ],
        ]);

        // New total: (4 x 100) + (2 x 80) = 400 + 160 = 560
        $editRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_amount' => 560.00,
                ],
            ]);
    }
}
