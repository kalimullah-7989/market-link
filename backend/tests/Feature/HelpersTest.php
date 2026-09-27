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

class HelpersTest extends TestCase
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
            'name'           => 'Liberty Market',
            'address'        => 'Gulberg, Lahore',
            'latitude'       => 31.52,
            'longitude'      => 74.35,
            'operating_days' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'opening_time'   => '08:00 AM',
            'closing_time'   => '03:00 PM',
        ]);

        $this->farmer = User::create([
            'name'     => 'Tariq Mehmood',
            'email'    => 'tariq@farm.com',
            'password' => bcrypt('password123'),
            'role'     => 'farmer',
        ]);

        FarmerProfile::create([
            'user_id'         => $this->farmer->id,
            'market_id'       => $this->market->id,
            'farm_name'       => 'Punjab Fresh Farm',
            'cutoff_hours'    => 4,
            'approval_status' => 'approved',
            'pickup_slots'    => ['10:00 AM - 12:00 PM'],
        ]);

        $this->customer = User::create([
            'name'     => 'Hamza Ali',
            'email'    => 'hamza@customer.com',
            'password' => bcrypt('password123'),
            'role'     => 'customer',
        ]);

        $category = Category::create(['name' => 'Vegetables', 'slug' => 'vegetables']);

        $this->product = Product::create([
            'farmer_id'      => $this->farmer->id,
            'category_id'    => $category->id,
            'name'           => 'Fresh Tomatoes',
            'unit'           => 'kg',
            'price'          => 120,
            'stock_quantity' => 50,
        ]);
    }

    public function test_order_show_includes_cutoff_remaining_seconds(): void
    {
        $order = Order::create([
            'order_number'     => 'ML-TEST-1001',
            'customer_id'      => $this->customer->id,
            'farmer_id'        => $this->farmer->id,
            'market_id'        => $this->market->id,
            'pickup_date'      => Carbon::now()->addDays(3)->format('Y-m-d'),
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'cutoff_datetime'  => Carbon::now()->addHours(5),
            'pickup_token'     => 'PK-TEST-0001',
            'order_status'     => 'placed',
            'payment_status'   => 'unpaid_cash',
            'total_amount'     => 240,
        ]);

        $response = $this->actingAs($this->customer, 'sanctum')
            ->getJson('/api/customer/orders/' . $order->id);

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertArrayHasKey('cutoff_remaining_seconds', $data);
        $this->assertGreaterThan(0, $data['cutoff_remaining_seconds']);
        $this->assertFalse($data['is_cutoff_passed']);
    }

    public function test_cutoff_remaining_seconds_is_zero_when_cutoff_passed(): void
    {
        $order = Order::create([
            'order_number'     => 'ML-TEST-1002',
            'customer_id'      => $this->customer->id,
            'farmer_id'        => $this->farmer->id,
            'market_id'        => $this->market->id,
            'pickup_date'      => Carbon::now()->addDays(1)->format('Y-m-d'),
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'cutoff_datetime'  => Carbon::now()->subHours(2),
            'pickup_token'     => 'PK-TEST-0002',
            'order_status'     => 'placed',
            'payment_status'   => 'unpaid_cash',
            'total_amount'     => 120,
        ]);

        $response = $this->actingAs($this->customer, 'sanctum')
            ->getJson('/api/customer/orders/' . $order->id);

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertEquals(0, $data['cutoff_remaining_seconds']);
        $this->assertTrue($data['is_cutoff_passed']);
    }

    public function test_market_list_includes_pin_status_field(): void
    {
        $response = $this->getJson('/api/markets');

        $response->assertStatus(200);
        $market = $response->json('data.0');

        $this->assertArrayHasKey('pin_status', $market);
        $this->assertContains($market['pin_status'], ['open', 'closing_soon', 'closed']);
    }

    public function test_market_pin_status_is_closed_on_non_operating_day(): void
    {
        $market = Market::create([
            'name'           => 'Weekend Only Market',
            'address'        => 'DHA, Lahore',
            'latitude'       => 31.48,
            'longitude'      => 74.39,
            'operating_days' => ['Saturday', 'Sunday'],
            'opening_time'   => '08:00 AM',
            'closing_time'   => '03:00 PM',
        ]);

        $todayName = Carbon::now()->format('l');
        $expectedStatus = in_array($todayName, ['Saturday', 'Sunday']) ? ['open', 'closing_soon', 'closed'] : ['closed'];

        $response = $this->getJson('/api/markets');
        $response->assertStatus(200);

        $found = collect($response->json('data'))->firstWhere('id', $market->id);
        $this->assertNotNull($found);
        $this->assertContains($found['pin_status'], $expectedStatus);
    }

    public function test_search_returns_products_farmers_and_markets(): void
    {
        $response = $this->getJson('/api/search?q=Tomato');

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'data' => ['query', 'products', 'farmers', 'markets'],
            ]);

        $this->assertEquals('Tomato', $response->json('data.query'));
        $this->assertCount(1, $response->json('data.products'));
    }

    public function test_search_finds_farmer_by_farm_name(): void
    {
        $response = $this->getJson('/api/search?q=Punjab');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data.farmers'));
        $this->assertEquals('Punjab Fresh Farm', $response->json('data.farmers.0.farm_name'));
    }

    public function test_search_finds_market_by_name(): void
    {
        $response = $this->getJson('/api/search?q=Liberty');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data.markets'));
        $this->assertEquals('Liberty Market', $response->json('data.markets.0.name'));
    }

    public function test_search_requires_minimum_two_characters(): void
    {
        $response = $this->getJson('/api/search?q=T');

        $response->assertStatus(422);
    }

    public function test_search_returns_empty_arrays_when_nothing_matches(): void
    {
        $response = $this->getJson('/api/search?q=xyznonexistent');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data.products'));
        $this->assertCount(0, $response->json('data.farmers'));
        $this->assertCount(0, $response->json('data.markets'));
    }
}
