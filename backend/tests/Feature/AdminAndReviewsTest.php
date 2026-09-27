<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAndReviewsTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $farmer;
    private $customer;
    private $market;
    private $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'System Admin',
            'email' => 'marketlink118@gmail.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
        ]);

        $this->farmer = User::create([
            'name' => 'Kisan Bhai',
            'email' => 'kisan@farm.com',
            'password' => bcrypt('password123'),
            'role' => 'farmer',
        ]);

        $this->market = Market::create([
            'name' => 'Liberty Market',
            'address' => 'Gulberg',
            'latitude' => 31.52,
            'longitude' => 74.35,
            'operating_days' => ['Saturday'],
        ]);

        FarmerProfile::create([
            'user_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'farm_name' => 'Green Valley',
            'approval_status' => 'pending',
        ]);

        $this->customer = User::create([
            'name' => 'Customer User',
            'email' => 'customer@user.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
        ]);

        $category = Category::create(['name' => 'Fruits', 'slug' => 'fruits']);

        $this->product = Product::create([
            'farmer_id' => $this->farmer->id,
            'category_id' => $category->id,
            'name' => 'Fresh Apples',
            'price' => 200,
            'stock_quantity' => 50,
        ]);
    }

    public function test_admin_can_approve_farmer(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')->postJson("/api/admin/farmers/{$this->farmer->id}/status", [
            'status' => 'approved',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'farmer_profile' => [
                        'approval_status' => 'approved',
                    ],
                ],
            ]);
    }

    public function test_admin_dashboard_metrics(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/dashboard');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'metrics' => [
                        'total_farmers' => 1,
                        'total_customers' => 1,
                        'total_markets' => 1,
                    ],
                ],
            ]);
    }

    public function test_customer_can_review_completed_order(): void
    {
        $order = Order::create([
            'order_number' => 'ML-1234',
            'customer_id' => $this->customer->id,
            'farmer_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'pickup_date' => Carbon::now()->format('Y-m-d'),
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'cutoff_datetime' => Carbon::now()->addHours(2),
            'total_amount' => 500,
            'order_status' => 'completed',
            'payment_status' => 'paid_cash',
        ]);

        $reviewRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/reviews', [
            'order_id' => $order->id,
            'rating' => 5,
            'comment' => 'Very fresh apples, crisp and delicious!',
        ]);

        $reviewRes->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'rating' => 5,
                ],
            ]);

        $reviewId = $reviewRes->json('data.id');

        $replyRes = $this->actingAs($this->farmer, 'sanctum')->postJson("/api/farmer/reviews/{$reviewId}/reply", [
            'farmer_reply' => 'Thank you for your feedback! Visit us again this Saturday.',
        ]);

        $replyRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'farmer_reply' => 'Thank you for your feedback! Visit us again this Saturday.',
                ],
            ]);
    }

    public function test_customer_cannot_review_incomplete_order(): void
    {
        $order = Order::create([
            'order_number' => 'ML-5678',
            'customer_id' => $this->customer->id,
            'farmer_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'pickup_date' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'cutoff_datetime' => Carbon::now()->addDays(1),
            'total_amount' => 300,
            'order_status' => 'placed',
        ]);

        $reviewRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/reviews', [
            'order_id' => $order->id,
            'rating' => 4,
            'comment' => 'Looking forward to pickup',
        ]);

        $reviewRes->assertStatus(400);
    }

    public function test_notifications_and_favorites(): void
    {
        Notification::create([
            'user_id' => $this->customer->id,
            'title'   => 'Test Alert',
            'message' => 'Your order is ready',
            'type'    => 'order_ready',
        ]);

        $notifRes = $this->actingAs($this->customer, 'sanctum')->getJson('/api/notifications');
        $notifRes->assertStatus(200);
        $this->assertEquals(1, $notifRes->json('data.unread_count'));

        $favRes = $this->actingAs($this->customer, 'sanctum')->postJson('/api/favorites/toggle', [
            'product_id' => $this->product->id,
        ]);
        $favRes->assertStatus(201)
            ->assertJson([
                'data' => ['favorited' => true],
            ]);
    }
}
