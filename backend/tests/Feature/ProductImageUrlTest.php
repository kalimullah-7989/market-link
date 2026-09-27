<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductImageUrlTest extends TestCase
{
    use RefreshDatabase;

    private $farmer;
    private $category;
    private $market;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

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

        $this->category = Category::create(['name' => 'Vegetables', 'slug' => 'vegetables']);
    }

    public function test_product_image_accessor_returns_full_url(): void
    {
        // Manually store a dummy file to the fake disk
        Storage::disk('public')->put('products/test-tomatoes.jpg', 'fake-image-content');

        $product = Product::create([
            'farmer_id'      => $this->farmer->id,
            'category_id'    => $this->category->id,
            'name'           => 'Fresh Tomatoes',
            'unit'           => 'kg',
            'price'          => 120,
            'stock_quantity' => 30,
            'image'          => 'products/test-tomatoes.jpg',
        ]);

        $this->assertNotNull($product->image);
        $this->assertStringContainsString('/storage/', $product->image);
        $this->assertStringContainsString('test-tomatoes.jpg', $product->image);
    }

    public function test_product_image_returns_null_when_not_set(): void
    {
        $product = Product::create([
            'farmer_id'      => $this->farmer->id,
            'category_id'    => $this->category->id,
            'name'           => 'Carrots',
            'unit'           => 'kg',
            'price'          => 60,
            'stock_quantity' => 20,
        ]);

        $response = $this->getJson('/api/products/' . $product->id);

        $response->assertStatus(200);
        $this->assertNull($response->json('data.product.image'));
    }

    public function test_public_product_list_image_field_is_full_url(): void
    {
        Storage::disk('public')->put('products/onions.jpg', 'fake-image-content');

        Product::create([
            'farmer_id'      => $this->farmer->id,
            'category_id'    => $this->category->id,
            'name'           => 'Red Onions',
            'unit'           => 'kg',
            'price'          => 90,
            'stock_quantity' => 40,
            'image'          => 'products/onions.jpg',
        ]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200);
        $imageUrl = $response->json('data.data.0.image');

        $this->assertNotNull($imageUrl);
        $this->assertStringContainsString('/storage/', $imageUrl);
    }
}
