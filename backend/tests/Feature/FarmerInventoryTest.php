<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FarmerInventoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_browse_markets(): void
    {
        Market::create([
            'name' => 'Model Town Sunday Bazaar',
            'address' => 'Model Town Central Park',
            'city' => 'Lahore',
            'latitude' => 31.4820,
            'longitude' => 74.3220,
            'operating_days' => ['Sunday'],
            'opening_time' => '08:00 AM',
            'closing_time' => '03:00 PM',
        ]);

        $response = $this->getJson('/api/markets?lat=31.5000&lng=74.3000');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertArrayHasKey('distance_km', $response->json('data.0'));
    }

    public function test_can_browse_categories(): void
    {
        Category::create([
            'name' => 'Vegetables',
            'slug' => 'vegetables',
        ]);

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    [
                        'name' => 'Vegetables',
                        'slug' => 'vegetables',
                    ],
                ],
            ]);
    }

    public function test_approved_farmer_can_create_and_manage_product(): void
    {
        $category = Category::create([
            'name' => 'Vegetables',
            'slug' => 'vegetables',
        ]);

        $farmer = User::create([
            'name' => 'Bashir Farmer',
            'email' => 'bashir@farm.com',
            'password' => bcrypt('password123'),
            'role' => 'farmer',
        ]);

        FarmerProfile::create([
            'user_id' => $farmer->id,
            'farm_name' => 'Green Fields',
            'approval_status' => 'approved',
        ]);

        $response = $this->actingAs($farmer, 'sanctum')->postJson('/api/farmer/products', [
            'category_id' => $category->id,
            'name' => 'Organic Fresh Tomatoes',
            'description' => 'Vine-ripened red tomatoes',
            'unit' => 'kg',
            'price' => 120.00,
            'stock_quantity' => 50,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Organic Fresh Tomatoes',
                    'stock_quantity' => 50,
                ],
            ]);

        $productId = $response->json('data.id');

        // Toggle sold out
        $toggleRes = $this->actingAs($farmer, 'sanctum')->patchJson("/api/farmer/products/{$productId}/toggle-status", [
            'field' => 'is_sold_out',
        ]);

        $toggleRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_sold_out' => true,
                ],
            ]);
    }

    public function test_pending_farmer_cannot_create_product(): void
    {
        $category = Category::create([
            'name' => 'Fruits',
            'slug' => 'fruits',
        ]);

        $farmer = User::create([
            'name' => 'Pending Farmer',
            'email' => 'pending@farm.com',
            'password' => bcrypt('password123'),
            'role' => 'farmer',
        ]);

        FarmerProfile::create([
            'user_id' => $farmer->id,
            'farm_name' => 'New Valley Farm',
            'approval_status' => 'pending',
        ]);

        $response = $this->actingAs($farmer, 'sanctum')->postJson('/api/farmer/products', [
            'category_id' => $category->id,
            'name' => 'Apples',
            'unit' => 'kg',
            'price' => 200,
            'stock_quantity' => 30,
        ]);

        $response->assertStatus(403);
    }

    public function test_farmer_weekly_recurring_stock_template(): void
    {
        $category = Category::create(['name' => 'Vegetables', 'slug' => 'vegetables']);

        $farmer = User::create([
            'name' => 'Rashid Farmer',
            'email' => 'rashid@farm.com',
            'password' => bcrypt('password123'),
            'role' => 'farmer',
        ]);

        FarmerProfile::create([
            'user_id' => $farmer->id,
            'farm_name' => 'Punjab Farm',
            'approval_status' => 'approved',
        ]);

        $product = Product::create([
            'farmer_id' => $farmer->id,
            'category_id' => $category->id,
            'name' => 'Spinach',
            'unit' => 'bunch',
            'price' => 50,
            'stock_quantity' => 100,
            'is_recurring' => true,
        ]);

        // Save template
        $saveRes = $this->actingAs($farmer, 'sanctum')->postJson('/api/farmer/stock-template/save');
        $saveRes->assertStatus(200);

        // Manually decrease product stock to 0 (sold out during weekend market)
        $product->update(['stock_quantity' => 0, 'is_sold_out' => true]);

        // Next week: Apply template
        $applyRes = $this->actingAs($farmer, 'sanctum')->postJson('/api/farmer/stock-template/apply');
        $applyRes->assertStatus(200);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 100,
            'is_sold_out' => false,
        ]);
    }

    public function test_product_details_shows_farm_to_fork_origin(): void
    {
        $market = Market::create([
            'name' => 'Liberty Market',
            'address' => 'Gulberg III',
            'latitude' => 31.5100,
            'longitude' => 74.3400,
            'operating_days' => ['Saturday'],
        ]);

        $category = Category::create(['name' => 'Dairy', 'slug' => 'dairy']);

        $farmer = User::create([
            'name' => 'Dairy Farmer',
            'email' => 'dairy@farm.com',
            'password' => bcrypt('password123'),
            'role' => 'farmer',
        ]);

        FarmerProfile::create([
            'user_id' => $farmer->id,
            'market_id' => $market->id,
            'farm_name' => 'Green Pastures Milk',
            'farm_latitude' => 31.2500,
            'farm_longitude' => 74.1500,
            'stall_number' => 'Stall #D-02',
            'stall_latitude' => 31.5102,
            'stall_longitude' => 74.3405,
            'approval_status' => 'approved',
        ]);

        $product = Product::create([
            'farmer_id' => $farmer->id,
            'category_id' => $category->id,
            'name' => 'Pure Desi Butter',
            'unit' => 'kg',
            'price' => 850,
            'stock_quantity' => 20,
        ]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'farm_to_fork_origin' => [
                        'farm_name' => 'Green Pastures Milk',
                        'farm_latitude' => 31.25,
                        'stall_number' => 'Stall #D-02',
                        'market_name' => 'Liberty Market',
                    ],
                ],
            ]);
    }
}
