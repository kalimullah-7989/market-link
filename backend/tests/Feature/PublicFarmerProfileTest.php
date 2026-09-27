<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicFarmerProfileTest extends TestCase
{
    use RefreshDatabase;

    private $market;
    private $farmer;
    private $customer;
    private $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->market = Market::create([
            'name' => 'Liberty Market',
            'address' => 'Gulberg, Lahore',
            'latitude' => 31.52,
            'longitude' => 74.35,
            'operating_days' => ['Saturday', 'Sunday'],
        ]);

        $this->farmer = User::create([
            'name' => 'Tariq Mehmood',
            'email' => 'tariq@farm.com',
            'password' => bcrypt('password123'),
            'role' => 'farmer',
        ]);

        FarmerProfile::create([
            'user_id' => $this->farmer->id,
            'market_id' => $this->market->id,
            'farm_name' => 'Punjab Fresh Farm',
            'stall_number' => 'A-12',
            'bio' => 'Organic vegetables since 2010',
            'cutoff_hours' => 4,
            'approval_status' => 'approved',
            'pickup_slots' => ['10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM'],
        ]);

        $this->customer = User::create([
            'name' => 'Hamza Ali',
            'email' => 'hamza@customer.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
        ]);

        $category = Category::create(['name' => 'Vegetables', 'slug' => 'vegetables']);

        $this->product = Product::create([
            'farmer_id' => $this->farmer->id,
            'category_id' => $category->id,
            'name' => 'Fresh Tomatoes',
            'unit' => 'kg',
            'price' => 120,
            'stock_quantity' => 50,
        ]);
    }

    public function test_anyone_can_list_approved_farmers(): void
    {
        $response = $this->getJson('/api/farmers');

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonCount(1, 'data');

        $farmer = $response->json('data.0');
        $this->assertEquals('Punjab Fresh Farm', $farmer['farm_name']);
        $this->assertEquals($this->market->id, $farmer['market_id']);
    }

    public function test_farmer_list_can_be_filtered_by_market(): void
    {
        $anotherMarket = Market::create([
            'name' => 'DHA Market',
            'address' => 'DHA, Lahore',
            'latitude' => 31.48,
            'longitude' => 74.39,
            'operating_days' => ['Friday'],
        ]);

        $anotherFarmer = User::create([
            'name' => 'Bashir Khan',
            'email' => 'bashir@farm.com',
            'password' => bcrypt('password123'),
            'role' => 'farmer',
        ]);

        FarmerProfile::create([
            'user_id' => $anotherFarmer->id,
            'market_id' => $anotherMarket->id,
            'farm_name' => 'DHA Dairy Farm',
            'cutoff_hours' => 3,
            'approval_status' => 'approved',
            'pickup_slots' => ['08:00 AM - 10:00 AM'],
        ]);

        $response = $this->getJson('/api/farmers?market_id=' . $this->market->id);

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('Punjab Fresh Farm', $response->json('data.0.farm_name'));
    }

    public function test_anyone_can_view_single_farmer_profile(): void
    {
        $response = $this->getJson('/api/farmers/' . $this->farmer->id);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'farm_name'    => 'Punjab Fresh Farm',
                    'stall_number' => 'A-12',
                    'market_name'  => 'Liberty Market',
                    'active_products' => 1,
                ],
            ]);
    }

    public function test_farmer_profile_includes_average_rating_and_reviews(): void
    {
        $order = Order::create([
            'order_number'    => 'ML-TEST-1001',
            'customer_id'     => $this->customer->id,
            'farmer_id'       => $this->farmer->id,
            'market_id'       => $this->market->id,
            'pickup_date'     => Carbon::now()->addDays(3),
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'cutoff_datetime' => Carbon::now()->addDays(2),
            'pickup_token'    => 'PK-TEST-0001',
            'order_status'    => 'completed',
            'payment_status'  => 'paid_cash',
            'total_amount'    => 240,
        ]);

        Review::create([
            'order_id'    => $order->id,
            'customer_id' => $this->customer->id,
            'farmer_id'   => $this->farmer->id,
            'rating'      => 4,
            'comment'     => 'Vegetables were very fresh.',
        ]);

        $response = $this->getJson('/api/farmers/' . $this->farmer->id);

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertEquals(4.0, $data['average_rating']);
        $this->assertEquals(1, $data['total_reviews']);
        $this->assertCount(1, $data['reviews']);
        $this->assertEquals('Vegetables were very fresh.', $data['reviews'][0]['comment']);
    }

    public function test_pickup_slots_endpoint_returns_slots_and_cutoff(): void
    {
        $response = $this->getJson('/api/farmers/' . $this->farmer->id . '/pickup-slots');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'farm_name'    => 'Punjab Fresh Farm',
                    'cutoff_hours' => 4,
                    'pickup_slots' => ['10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM'],
                ],
            ]);
    }

    public function test_pending_farmer_not_visible_in_public_list(): void
    {
        $pendingFarmer = User::create([
            'name' => 'Aslam Pending',
            'email' => 'aslam@farm.com',
            'password' => bcrypt('password123'),
            'role' => 'farmer',
        ]);

        FarmerProfile::create([
            'user_id' => $pendingFarmer->id,
            'market_id' => $this->market->id,
            'farm_name' => 'Aslam Farm',
            'cutoff_hours' => 4,
            'approval_status' => 'pending',
            'pickup_slots' => [],
        ]);

        $response = $this->getJson('/api/farmers');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }
}
