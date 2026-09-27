<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FarmerInsightsTest extends TestCase
{
    use RefreshDatabase;

    private $farmer;
    private $customer;
    private $product;
    private $market;

    protected function setUp(): void
    {
        parent::setUp();

        $this->market = Market::create([
            'name' => 'Liberty Market',
            'address' => 'Lahore',
            'latitude' => 31.52,
            'longitude' => 74.35,
            'operating_days' => ['Saturday'],
        ]);

        $this->farmer = User::create([
            'name' => 'Tariq Farmer',
            'email' => 'tariq@farm.com',
            'password' => bcrypt('password123'),
            'role' => 'farmer',
        ]);

        FarmerProfile::create([
            'user_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'farm_name' => 'Punjab Farm',
            'cutoff_hours' => 4,
            'approval_status' => 'approved',
            'pickup_slots' => ['10:00 AM - 12:00 PM'],
        ]);

        $this->customer = User::create([
            'name' => 'Hamza Customer',
            'email' => 'hamza@customer.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
        ]);

        $category = Category::create(['name' => 'Vegetables', 'slug' => 'vegetables']);

        $this->product = Product::create([
            'farmer_id' => $this->farmer->id,
            'category_id' => $category->id,
            'name' => 'Tomatoes',
            'unit' => 'kg',
            'price' => 150,
            'stock_quantity' => 100,
        ]);
    }

    private function createOrder($status, $total)
    {
        $order = Order::create([
            'order_number'    => 'ML-TEST-' . rand(1000, 9999),
            'customer_id'     => $this->customer->id,
            'farmer_id'       => $this->farmer->id,
            'market_id'       => $this->market->id,
            'pickup_date'     => Carbon::now()->addDays(3),
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'cutoff_datetime' => Carbon::now()->addDays(2),
            'pickup_token'    => 'PK-TEST-' . rand(1000, 9999),
            'order_status'    => $status,
            'payment_status'  => $status === 'completed' ? 'paid_cash' : 'unpaid_cash',
            'total_amount'    => $total,
        ]);

        OrderItem::create([
            'order_id'     => $order->id,
            'product_id'   => $this->product->id,
            'product_name' => 'Tomatoes',
            'unit'         => 'kg',
            'quantity'     => 2,
            'unit_price'   => 150,
            'subtotal'     => $total,
        ]);

        return $order;
    }

    public function test_farmer_insights_returns_correct_data(): void
    {
        $this->createOrder('completed', 300);
        $this->createOrder('completed', 450);
        $this->createOrder('placed', 150);

        $response = $this->actingAs($this->farmer, 'sanctum')
            ->getJson('/api/farmer/insights');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_completed_orders' => 2,
                    'pending_orders'         => 1,
                    'best_selling_product'   => 'Tomatoes',
                ],
            ]);

        $data = $response->json('data');
        $this->assertEquals(750.00, $data['revenue_this_week']);
        $this->assertEquals(750.00, $data['revenue_this_month']);
    }

    public function test_farmer_insights_includes_average_rating(): void
    {
        $order = $this->createOrder('completed', 300);
        $order->update(['order_status' => 'completed']);

        Review::create([
            'order_id'    => $order->id,
            'customer_id' => $this->customer->id,
            'farmer_id'   => $this->farmer->id,
            'rating'      => 5,
            'comment'     => 'Very fresh!',
        ]);

        $response = $this->actingAs($this->farmer, 'sanctum')
            ->getJson('/api/farmer/insights');

        $response->assertStatus(200);

        $data = $response->json('data');
        $this->assertEquals(5.0, $data['average_rating']);
        $this->assertEquals(1, $data['total_reviews']);
    }

    public function test_insights_returns_nulls_when_no_data(): void
    {
        $response = $this->actingAs($this->farmer, 'sanctum')
            ->getJson('/api/farmer/insights');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_completed_orders' => 0,
                    'pending_orders'         => 0,
                    'revenue_this_week'      => 0.00,
                    'revenue_this_month'     => 0.00,
                    'best_selling_product'   => null,
                    'average_rating'         => null,
                    'total_reviews'          => 0,
                ],
            ]);
    }

    public function test_customer_cannot_access_farmer_insights(): void
    {
        $this->actingAs($this->customer, 'sanctum')
            ->getJson('/api/farmer/insights')
            ->assertStatus(403);
    }
}
