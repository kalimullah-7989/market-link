<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Notification;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LowStockAlertTest extends TestCase
{
    use RefreshDatabase;

    private $market;
    private $farmer;
    private $customer;
    private $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->market = Market::create([
            'name'           => 'Liberty Market',
            'address'        => 'Gulberg, Lahore',
            'latitude'       => 31.52,
            'longitude'      => 74.35,
            'operating_days' => ['Saturday', 'Sunday'],
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

        $this->category = Category::create([
            'name' => 'Vegetables',
            'slug' => 'vegetables',
        ]);
    }

    public function test_product_includes_low_stock_and_urgency_label_in_json(): void
    {
        $lowProduct = Product::create([
            'farmer_id'      => $this->farmer->id,
            'category_id'    => $this->category->id,
            'name'           => 'Desi Tamatar',
            'unit'           => 'kg',
            'price'          => 120,
            'stock_quantity' => 3,
        ]);

        $highProduct = Product::create([
            'farmer_id'      => $this->farmer->id,
            'category_id'    => $this->category->id,
            'name'           => 'Aloo',
            'unit'           => 'kg',
            'price'          => 80,
            'stock_quantity' => 25,
        ]);

        $response = $this->getJson('/api/products/' . $lowProduct->id);
        $response->assertStatus(200);

        $data = $response->json('data.product');
        $this->assertTrue($data['is_low_stock']);
        $this->assertEquals('Only 3 kg left!', $data['stock_urgency_label']);

        $responseHigh = $this->getJson('/api/products/' . $highProduct->id);
        $responseHigh->assertStatus(200);

        $dataHigh = $responseHigh->json('data.product');
        $this->assertFalse($dataHigh['is_low_stock']);
        $this->assertNull($dataHigh['stock_urgency_label']);
    }

    public function test_order_placement_triggers_low_stock_notification_to_farmer(): void
    {
        $product = Product::create([
            'farmer_id'      => $this->farmer->id,
            'category_id'    => $this->category->id,
            'name'           => 'Desi Tamatar',
            'unit'           => 'kg',
            'price'          => 150,
            'stock_quantity' => 10,
        ]);

        $pickupDate = Carbon::now()->addDays(3)->format('Y-m-d');

        // Customer orders 7 kg, leaving 3 kg (<= 5)
        $response = $this->actingAs($this->customer, 'sanctum')->postJson('/api/customer/orders', [
            'farmer_id'        => $this->farmer->id,
            'pickup_date'      => $pickupDate,
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'items'            => [
                ['product_id' => $product->id, 'quantity' => 7],
            ],
        ]);

        $response->assertStatus(201);
        $this->assertEquals(3, $product->fresh()->stock_quantity);

        // Verify low stock notification was dispatched to farmer
        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->farmer->id,
            'type'    => 'low_stock',
        ]);

        $notification = Notification::where('user_id', $this->farmer->id)
            ->where('type', 'low_stock')
            ->first();

        $this->assertStringContainsString('Desi Tamatar', $notification->title);
        $this->assertStringContainsString('Only 3 kg remaining', $notification->message);
    }

    public function test_order_placement_triggers_sold_out_notification_when_stock_hits_zero(): void
    {
        $product = Product::create([
            'farmer_id'      => $this->farmer->id,
            'category_id'    => $this->category->id,
            'name'           => 'Special Kadu',
            'unit'           => 'kg',
            'price'          => 90,
            'stock_quantity' => 4,
        ]);

        $pickupDate = Carbon::now()->addDays(3)->format('Y-m-d');

        // Customer buys all 4 kg
        $response = $this->actingAs($this->customer, 'sanctum')->postJson('/api/customer/orders', [
            'farmer_id'        => $this->farmer->id,
            'pickup_date'      => $pickupDate,
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
            'items'            => [
                ['product_id' => $product->id, 'quantity' => 4],
            ],
        ]);

        $response->assertStatus(201);
        $this->assertEquals(0, $product->fresh()->stock_quantity);
        $this->assertTrue($product->fresh()->is_sold_out);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->farmer->id,
            'type'    => 'stock_alert',
        ]);
    }
}
