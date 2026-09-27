<?php

namespace Tests\Feature;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    private function makeMarket(): Market
    {
        return Market::create([
            'name'           => 'Lahore Sunday Bazaar',
            'address'        => 'Gulberg, Lahore',
            'latitude'       => 31.52,
            'longitude'      => 74.35,
            'operating_days' => ['Sunday', 'Wednesday'],
        ]);
    }

    private function makeCustomer(): User
    {
        static $idx = 0;
        $idx++;
        return User::create([
            'name'     => "Test Customer {$idx}",
            'email'    => "customer{$idx}@test.com",
            'password' => bcrypt('password123'),
            'role'     => 'customer',
            'phone'    => '03001234567',
        ]);
    }

    private function makeApprovedFarmer(Market $market): User
    {
        static $idx = 0;
        $idx++;
        $farmer = User::create([
            'name'     => "Test Farmer {$idx}",
            'email'    => "farmer{$idx}@test.com",
            'password' => bcrypt('password123'),
            'role'     => 'farmer',
        ]);

        FarmerProfile::create([
            'user_id'         => $farmer->id,
            'market_id'       => $market->id,
            'farm_name'       => "Farm {$idx}",
            'stall_number'    => "Stall #{$idx}",
            'cutoff_hours'    => 2,
            'approval_status' => 'approved',
        ]);

        return $farmer;
    }

    private function makeCategory(): Category
    {
        static $idx = 0;
        $idx++;
        return Category::create(['name' => "Category {$idx}", 'slug' => "category-{$idx}"]);
    }

    private function makeProduct(User $farmer, array $attrs = []): Product
    {
        return Product::create(array_merge([
            'farmer_id'                  => $farmer->id,
            'category_id'                => $this->makeCategory()->id,
            'name'                       => 'Fresh Tomatoes',
            'unit'                       => 'kg',
            'price'                      => 100.00,
            'stock_quantity'             => 50,
            'is_sold_out'                => false,
            'is_temporarily_unavailable' => false,
        ], $attrs));
    }

    public function test_customer_can_view_empty_cart()
    {
        $customer = $this->makeCustomer();

        $response = $this->actingAs($customer, 'sanctum')->getJson('/api/customer/cart');

        $response->assertOk()
            ->assertJsonPath('data.item_count', 0)
            ->assertJsonPath('data.grand_total', 0)
            ->assertJsonPath('data.payment_method', 'cash_on_pickup');
    }

    public function test_customer_can_add_item_to_cart()
    {
        $market   = $this->makeMarket();
        $farmer   = $this->makeApprovedFarmer($market);
        $product  = $this->makeProduct($farmer);
        $customer = $this->makeCustomer();

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart', [
            'product_id' => $product->id,
            'quantity'   => 3,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.product_id', $product->id)
            ->assertJsonPath('data.quantity', 3)
            ->assertJsonPath('data.subtotal', 300);

        $this->assertDatabaseHas('cart_items', [
            'user_id'    => $customer->id,
            'product_id' => $product->id,
            'quantity'   => 3,
        ]);
    }

    public function test_adding_same_product_again_increases_quantity()
    {
        $market   = $this->makeMarket();
        $farmer   = $this->makeApprovedFarmer($market);
        $product  = $this->makeProduct($farmer);
        $customer = $this->makeCustomer();

        $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart', [
            'product_id' => $product->id,
            'quantity'   => 2,
        ]);

        $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart', [
            'product_id' => $product->id,
            'quantity'   => 5,
        ]);

        $this->assertDatabaseHas('cart_items', [
            'user_id'    => $customer->id,
            'product_id' => $product->id,
            'quantity'   => 7,
        ]);
    }

    public function test_cannot_add_out_of_stock_product_to_cart()
    {
        $market   = $this->makeMarket();
        $farmer   = $this->makeApprovedFarmer($market);
        $product  = $this->makeProduct($farmer, ['is_sold_out' => true, 'stock_quantity' => 0]);
        $customer = $this->makeCustomer();

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart', [
            'product_id' => $product->id,
            'quantity'   => 1,
        ]);

        $response->assertStatus(400);
    }

    public function test_cannot_exceed_available_stock_in_cart()
    {
        $market   = $this->makeMarket();
        $farmer   = $this->makeApprovedFarmer($market);
        $product  = $this->makeProduct($farmer, ['stock_quantity' => 5]);
        $customer = $this->makeCustomer();

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart', [
            'product_id' => $product->id,
            'quantity'   => 10,
        ]);

        $response->assertStatus(422);
    }

    public function test_customer_can_update_cart_item_quantity()
    {
        $market   = $this->makeMarket();
        $farmer   = $this->makeApprovedFarmer($market);
        $product  = $this->makeProduct($farmer);
        $customer = $this->makeCustomer();

        $add = $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart', [
            'product_id' => $product->id,
            'quantity'   => 2,
        ]);

        $cartItemId = $add->json('data.cart_item_id');

        $response = $this->actingAs($customer, 'sanctum')->patchJson("/api/customer/cart/{$cartItemId}", [
            'quantity' => 8,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.quantity', 8);

        $this->assertDatabaseHas('cart_items', [
            'id'       => $cartItemId,
            'quantity' => 8,
        ]);
    }

    public function test_customer_can_remove_single_cart_item()
    {
        $market   = $this->makeMarket();
        $farmer   = $this->makeApprovedFarmer($market);
        $product  = $this->makeProduct($farmer);
        $customer = $this->makeCustomer();

        $add = $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart', [
            'product_id' => $product->id,
            'quantity'   => 1,
        ]);

        $cartItemId = $add->json('data.cart_item_id');

        $response = $this->actingAs($customer, 'sanctum')->deleteJson("/api/customer/cart/{$cartItemId}");

        $response->assertOk();
        $this->assertDatabaseMissing('cart_items', ['id' => $cartItemId]);
    }

    public function test_customer_can_clear_entire_cart()
    {
        $market   = $this->makeMarket();
        $farmer   = $this->makeApprovedFarmer($market);
        $customer = $this->makeCustomer();

        $p1 = $this->makeProduct($farmer, ['name' => 'Onions']);
        $p2 = $this->makeProduct($farmer, ['name' => 'Garlic']);

        $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart', ['product_id' => $p1->id, 'quantity' => 1]);
        $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart', ['product_id' => $p2->id, 'quantity' => 2]);

        $response = $this->actingAs($customer, 'sanctum')->deleteJson('/api/customer/cart');

        $response->assertOk();
        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_checkout_creates_order_from_cart_and_clears_cart()
    {
        $market   = $this->makeMarket();
        $farmer   = $this->makeApprovedFarmer($market);
        $product  = $this->makeProduct($farmer, ['stock_quantity' => 20, 'price' => 100.00]);
        $customer = $this->makeCustomer();

        $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart', [
            'product_id' => $product->id,
            'quantity'   => 3,
        ]);

        $pickupDate = now()->addDays(3)->format('Y-m-d');

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart/checkout', [
            'pickup_date'      => $pickupDate,
            'pickup_time_slot' => '10:00 AM - 12:00 PM',
        ]);

        $response->assertStatus(201);

        $orders = $response->json('data.orders');
        $this->assertNotEmpty($orders);
        $this->assertEquals('cash_on_pickup', $orders[0]['payment_method']);

        $this->assertDatabaseCount('cart_items', 0);
        $this->assertEquals(17, $product->fresh()->stock_quantity);
    }

    public function test_checkout_decrements_stock_correctly()
    {
        $market   = $this->makeMarket();
        $farmer   = $this->makeApprovedFarmer($market);
        $product  = $this->makeProduct($farmer, ['stock_quantity' => 10]);
        $customer = $this->makeCustomer();

        $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart', [
            'product_id' => $product->id,
            'quantity'   => 4,
        ]);

        $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart/checkout', [
            'pickup_date'      => now()->addDays(2)->format('Y-m-d'),
            'pickup_time_slot' => '08:00 AM - 10:00 AM',
        ]);

        $this->assertEquals(6, $product->fresh()->stock_quantity);
    }

    public function test_checkout_fails_when_cart_is_empty()
    {
        $customer = $this->makeCustomer();

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/customer/cart/checkout', [
            'pickup_date'      => now()->addDays(2)->format('Y-m-d'),
            'pickup_time_slot' => '08:00 AM - 10:00 AM',
        ]);

        $response->assertStatus(400);
    }

    public function test_farmer_cannot_access_cart_endpoints()
    {
        $market = $this->makeMarket();
        $farmer = $this->makeApprovedFarmer($market);

        $response = $this->actingAs($farmer, 'sanctum')->getJson('/api/customer/cart');

        $response->assertStatus(403);
    }

    public function test_admin_cannot_access_cart_endpoints()
    {
        $admin = User::create([
            'name'     => 'Admin User',
            'email'    => 'marketlink118@gmail.com',
            'password' => bcrypt('admin123'),
            'role'     => 'admin',
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/customer/cart');

        $response->assertStatus(403);
    }
}
