<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FreshnessIndicatorTest extends TestCase
{
    use RefreshDatabase;

    private $farmer;
    private $market;
    private $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->market = Market::create([
            'name'           => 'Liberty Market',
            'address'        => 'Lahore',
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

        $this->category = Category::create([
            'name' => 'Vegetables',
            'slug' => 'vegetables',
        ]);
    }

    public function test_product_harvested_today_shows_correct_freshness_tag(): void
    {
        $product = Product::create([
            'farmer_id'      => $this->farmer->id,
            'category_id'    => $this->category->id,
            'name'           => 'Fresh Desi Tamatar',
            'unit'           => 'kg',
            'price'          => 120,
            'stock_quantity' => 20,
            'harvested_at'   => Carbon::now()->subHours(2),
        ]);

        $response = $this->getJson('/api/products/' . $product->id);
        $response->assertStatus(200);

        $data = $response->json('data.product');
        $this->assertTrue($data['is_harvested_today']);
        $this->assertEquals('Harvested Today', $data['freshness_tag']);
    }

    public function test_product_harvested_yesterday_shows_yesterday_tag(): void
    {
        $product = Product::create([
            'farmer_id'      => $this->farmer->id,
            'category_id'    => $this->category->id,
            'name'           => 'Fresh Palak',
            'unit'           => 'bunch',
            'price'          => 50,
            'stock_quantity' => 15,
            'harvested_at'   => Carbon::now()->subDay()->subHours(2),
        ]);

        $response = $this->getJson('/api/products/' . $product->id);
        $response->assertStatus(200);

        $data = $response->json('data.product');
        $this->assertFalse($data['is_harvested_today']);
        $this->assertEquals('Harvested Yesterday', $data['freshness_tag']);
    }

    public function test_product_older_than_two_days_has_no_freshness_tag(): void
    {
        $product = Product::create([
            'farmer_id'      => $this->farmer->id,
            'category_id'    => $this->category->id,
            'name'           => 'Piyaz',
            'unit'           => 'kg',
            'price'          => 90,
            'stock_quantity' => 40,
            'harvested_at'   => Carbon::now()->subDays(4),
        ]);

        $response = $this->getJson('/api/products/' . $product->id);
        $response->assertStatus(200);

        $data = $response->json('data.product');
        $this->assertFalse($data['is_harvested_today']);
        $this->assertNull($data['freshness_tag']);
    }

    public function test_farmer_can_set_and_update_harvest_date(): void
    {
        $harvestTime = Carbon::now()->subHours(3)->format('Y-m-d H:i:s');

        $response = $this->actingAs($this->farmer, 'sanctum')->postJson('/api/farmer/products', [
            'category_id'    => $this->category->id,
            'name'           => 'Organic Kheera',
            'unit'           => 'kg',
            'price'          => 70,
            'stock_quantity' => 30,
            'harvested_at'   => $harvestTime,
        ]);

        $response->assertStatus(201);
        $productId = $response->json('data.id');

        $this->assertDatabaseHas('products', [
            'id'   => $productId,
            'name' => 'Organic Kheera',
        ]);

        $this->assertEquals('Harvested Today', $response->json('data.freshness_tag'));

        // Update harvest time
        $updatedTime = Carbon::now()->subDays(3)->format('Y-m-d H:i:s');
        $updateResponse = $this->actingAs($this->farmer, 'sanctum')->putJson('/api/farmer/products/' . $productId, [
            'harvested_at' => $updatedTime,
        ]);

        $updateResponse->assertStatus(200);
        $this->assertNull($updateResponse->json('data.freshness_tag'));
    }
}
