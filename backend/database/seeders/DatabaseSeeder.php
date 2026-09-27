<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin User
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'marketlink118@gmail.com',
            'password' => Hash::make('#marketlink118@'),
            'phone' => '0300-1112233',
            'address' => 'MarketLink Head Office, Lahore',
            'role' => 'admin',
            'is_active' => true,
        ]);

        // 2. Markets (with real Lahore coordinates)
        $marketLiberty = Market::create([
            'name' => 'Liberty Sunday Farmers Market',
            'description' => 'Weekly organic and fresh harvest market in the heart of Gulberg.',
            'address' => 'Liberty Roundabout Park, Gulberg III',
            'city' => 'Lahore',
            'latitude' => 31.51220000,
            'longitude' => 74.34320000,
            'operating_days' => ['Saturday', 'Sunday'],
            'opening_time' => '08:00 AM',
            'closing_time' => '02:00 PM',
            'image_url' => 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        $marketModelTown = Market::create([
            'name' => 'Model Town Organic Bazaar',
            'description' => 'Fresh vegetables, organic dairy, and seasonal fruits directly from surrounding farms.',
            'address' => 'Central Park Sports Complex, Model Town',
            'city' => 'Lahore',
            'latitude' => 31.48200000,
            'longitude' => 74.32200000,
            'operating_days' => ['Sunday'],
            'opening_time' => '07:30 AM',
            'closing_time' => '01:30 PM',
            'image_url' => 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        $marketDHA = Market::create([
            'name' => 'DHA Phase 5 Fresh Saturday Market',
            'description' => 'High-quality local farm produce and specialty organic goods.',
            'address' => 'Sector C Commercial Area, DHA Phase 5',
            'city' => 'Lahore',
            'latitude' => 31.46800000,
            'longitude' => 74.39100000,
            'operating_days' => ['Saturday'],
            'opening_time' => '08:30 AM',
            'closing_time' => '03:00 PM',
            'image_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        $marketEmpress = Market::create([
            'name' => 'Empress Market Organic Bazaar',
            'description' => 'Historic open ground market with direct farm supply from Malir and Thatta farms.',
            'address' => 'Preedy Street, Saddar Heritage Zone',
            'city' => 'Karachi',
            'latitude' => 24.86240000,
            'longitude' => 67.02700000,
            'operating_days' => ['Saturday', 'Sunday'],
            'opening_time' => '07:00 AM',
            'closing_time' => '01:00 PM',
            'image_url' => 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        $marketClifton = Market::create([
            'name' => 'Clifton Sunday Farmers Market',
            'description' => 'Coastal breeze Sunday bazaar bringing certified organic hydroponic greens and fresh fruits.',
            'address' => 'Boat Basin Park Promenade, Block 5, Clifton',
            'city' => 'Karachi',
            'latitude' => 24.82380000,
            'longitude' => 67.03150000,
            'operating_days' => ['Sunday'],
            'opening_time' => '08:00 AM',
            'closing_time' => '02:00 PM',
            'image_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        $marketIslamabad = Market::create([
            'name' => 'F-6 Super Market Fresh Farm Stalls',
            'description' => 'Margalla foothills gathering of organic growers from Chak Shahzad and Haripur orchards.',
            'address' => 'School Road, Super Market, Sector F-6/1',
            'city' => 'Islamabad',
            'latitude' => 33.73110000,
            'longitude' => 73.06450000,
            'operating_days' => ['Saturday', 'Sunday'],
            'opening_time' => '08:30 AM',
            'closing_time' => '02:30 PM',
            'image_url' => 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        $marketMultan = Market::create([
            'name' => 'Multan Cantt Officers Farmers Bazaar',
            'description' => 'Famous South Punjab produce hub featuring Chaunsa mango groves, organic vegetables, and pure Desi Ghee.',
            'address' => 'Askari Park Arena, Multan Cantt',
            'city' => 'Multan',
            'latitude' => 30.20300000,
            'longitude' => 71.46500000,
            'operating_days' => ['Saturday', 'Sunday'],
            'opening_time' => '08:00 AM',
            'closing_time' => '01:30 PM',
            'image_url' => 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
        ]);

        // 3. Categories
        $catVeg = Category::create(['name' => 'Fresh Vegetables', 'slug' => 'fresh-vegetables', 'icon' => 'carrot']);
        $catFruit = Category::create(['name' => 'Seasonal Fruits', 'slug' => 'seasonal-fruits', 'icon' => 'apple-alt']);
        $catDairy = Category::create(['name' => 'Farm Dairy & Eggs', 'slug' => 'farm-dairy-eggs', 'icon' => 'egg']);
        $catHerbs = Category::create(['name' => 'Herbs & Greens', 'slug' => 'herbs-greens', 'icon' => 'leaf']);
        $catHoney = Category::create(['name' => 'Honey & Preserves', 'slug' => 'honey-preserves', 'icon' => 'jar']);

        // 4. Approved Farmers
        // Farmer 1: Tariq Mehmood (Vegetables specialist at Liberty)
        $farmer1 = User::create([
            'name' => 'Tariq Mehmood',
            'email' => 'tariq@punjabfarm.com',
            'password' => Hash::make('password123'),
            'phone' => '0301-5556677',
            'address' => 'Kasur Agricultural Belt',
            'role' => 'farmer',
            'is_active' => true,
        ]);

        $profile1 = FarmerProfile::create([
            'user_id' => $farmer1->id,
            'market_id' => $marketLiberty->id,
            'farm_name' => 'Punjab Green Organic Farm',
            'stall_number' => 'Stall #A-04',
            'farm_address' => 'Kasur Rural Dist., 32km from Lahore',
            'farm_latitude' => 31.11500000,
            'farm_longitude' => 74.45000000,
            'stall_latitude' => 31.51240000,
            'stall_longitude' => 74.34350000,
            'pickup_slots' => ['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 02:00 PM'],
            'cutoff_hours' => 4,
            'approval_status' => 'approved',
            'bio' => 'Growing pesticide-free organic vegetables and fresh root crops for over 15 years.',
        ]);

        // Farmer 2: Chaudhry Bashir (Dairy & greens at Model Town)
        $farmer2 = User::create([
            'name' => 'Chaudhry Bashir',
            'email' => 'bashir@dairyfarm.com',
            'password' => Hash::make('password123'),
            'phone' => '0322-8889900',
            'address' => 'Sheikhupura Canal Road',
            'role' => 'farmer',
            'is_active' => true,
        ]);

        $profile2 = FarmerProfile::create([
            'user_id' => $farmer2->id,
            'market_id' => $marketModelTown->id,
            'farm_name' => 'Al-Razaq Pure Dairy & Cattle Farm',
            'stall_number' => 'Stall #B-12',
            'farm_address' => 'Sheikhupura Rural Area',
            'farm_latitude' => 31.71300000,
            'farm_longitude' => 73.98500000,
            'stall_latitude' => 31.48220000,
            'stall_longitude' => 74.32240000,
            'pickup_slots' => ['07:30 AM - 09:30 AM', '09:30 AM - 11:30 AM', '11:30 AM - 01:30 PM'],
            'cutoff_hours' => 3,
            'approval_status' => 'approved',
            'bio' => 'Pure unadulterated cow milk, cultured butter, and free-range desi chicken eggs.',
        ]);

        // Farmer 3: Haji Rasheed (Fruits & honey at DHA)
        $farmer3 = User::create([
            'name' => 'Haji Rasheed',
            'email' => 'rasheed@citrusfarm.com',
            'password' => Hash::make('password123'),
            'phone' => '0333-4443322',
            'address' => 'Sargodha Orchard Valley',
            'role' => 'farmer',
            'is_active' => true,
        ]);

        $profile3 = FarmerProfile::create([
            'user_id' => $farmer3->id,
            'market_id' => $marketDHA->id,
            'farm_name' => 'Sargodha Citrus & Sidr Honey Orchard',
            'stall_number' => 'Stall #C-08',
            'farm_address' => 'Bhalwal Citrus Belt, Sargodha',
            'farm_latitude' => 32.08360000,
            'farm_longitude' => 72.67110000,
            'stall_latitude' => 31.46820000,
            'stall_longitude' => 74.39120000,
            'pickup_slots' => ['08:30 AM - 10:30 AM', '10:30 AM - 12:30 PM', '12:30 PM - 02:30 PM'],
            'cutoff_hours' => 6,
            'approval_status' => 'approved',
            'bio' => 'Fresh sweet mandarins, handpicked citrus, and unheated raw Sidr honey.',
        ]);

        // Farmer 4: Pending Approval (For Admin Live Approval Demo!)
        $farmerPending = User::create([
            'name' => 'Aslam Khan',
            'email' => 'aslam@pendingfarm.com',
            'password' => Hash::make('password123'),
            'phone' => '0345-9988776',
            'address' => 'Pattoki Floriculture',
            'role' => 'farmer',
            'is_active' => true,
        ]);

        FarmerProfile::create([
            'user_id' => $farmerPending->id,
            'farm_name' => 'Khan Natural Hydroponics',
            'stall_number' => 'Stall #P-01',
            'pickup_slots' => ['09:00 AM - 11:00 AM'],
            'cutoff_hours' => 4,
            'approval_status' => 'pending',
            'bio' => 'Hydroponic crisp greens and heirloom berry varieties awaiting verification.',
        ]);

        // 5. Products Setup
        // Products for Farmer 1 (Tariq Mehmood)
        $p1 = Product::create([
            'farmer_id' => $farmer1->id,
            'category_id' => $catVeg->id,
            'name' => 'Farm Fresh Vine Tomatoes',
            'description' => 'Naturally vine-ripened red juicy tomatoes, harvested early morning before market.',
            'unit' => 'kg',
            'price' => 140.00,
            'stock_quantity' => 60,
            'image' => 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
            'is_sold_out' => false,
            'is_recurring' => true,
        ]);

        $p2 = Product::create([
            'farmer_id' => $farmer1->id,
            'category_id' => $catVeg->id,
            'name' => 'Organic Red Potatoes',
            'description' => 'Unwashed soil-fresh red skin potatoes, perfect for boiling and roasting.',
            'unit' => 'kg',
            'price' => 90.00,
            'stock_quantity' => 100,
            'image' => 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80',
            'is_sold_out' => false,
            'is_recurring' => true,
        ]);

        $p3 = Product::create([
            'farmer_id' => $farmer1->id,
            'category_id' => $catHerbs->id,
            'name' => 'Fresh Green Spinach (Palak)',
            'description' => 'Tender green leaves, washed in clean tube-well water.',
            'unit' => 'bunch',
            'price' => 50.00,
            'stock_quantity' => 40,
            'image' => 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80',
            'is_sold_out' => false,
            'is_recurring' => true,
        ]);

        $p4 = Product::create([
            'farmer_id' => $farmer1->id,
            'category_id' => $catVeg->id,
            'name' => 'Crunchy Cucumbers (Kheera)',
            'description' => 'Crisp local salad cucumbers, zero bitter taste.',
            'unit' => 'kg',
            'price' => 80.00,
            'stock_quantity' => 35,
            'image' => 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=400&q=80',
            'is_sold_out' => false,
            'is_recurring' => true,
        ]);

        // Products for Farmer 2 (Chaudhry Bashir)
        $p5 = Product::create([
            'farmer_id' => $farmer2->id,
            'category_id' => $catDairy->id,
            'name' => 'Pure Fresh Cow Milk',
            'description' => 'Whole unskimmed raw farm milk chilled immediately after milking.',
            'unit' => 'litre',
            'price' => 220.00,
            'stock_quantity' => 50,
            'image' => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
            'is_sold_out' => false,
            'is_recurring' => true,
        ]);

        $p6 = Product::create([
            'farmer_id' => $farmer2->id,
            'category_id' => $catDairy->id,
            'name' => 'Free-Range Desi Eggs',
            'description' => 'Brown nutrient-dense eggs from pastured, grain-fed hens.',
            'unit' => 'dozen',
            'price' => 360.00,
            'stock_quantity' => 30,
            'image' => 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80',
            'is_sold_out' => false,
            'is_recurring' => true,
        ]);

        $p7 = Product::create([
            'farmer_id' => $farmer2->id,
            'category_id' => $catDairy->id,
            'name' => 'Homemade Cultured Makhan (Butter)',
            'description' => 'Churned traditionally from cow curd, aromatic and golden.',
            'unit' => '500g',
            'price' => 650.00,
            'stock_quantity' => 15,
            'image' => 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
            'is_sold_out' => false,
            'is_recurring' => true,
        ]);

        // Products for Farmer 3 (Haji Rasheed)
        $p8 = Product::create([
            'farmer_id' => $farmer3->id,
            'category_id' => $catFruit->id,
            'name' => 'Sweet Kinnow Mandarins',
            'description' => 'Export-grade juicy sweet Kinnow from prime Sargodha orchards.',
            'unit' => 'dozen',
            'price' => 280.00,
            'stock_quantity' => 50,
            'image' => 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=400&q=80',
            'is_sold_out' => false,
            'is_recurring' => true,
        ]);

        $p9 = Product::create([
            'farmer_id' => $farmer3->id,
            'category_id' => $catHoney->id,
            'name' => 'Pure Raw Wild Berry (Sidr) Honey',
            'description' => '100% natural unfiltered honey harvested directly from wild hives.',
            'unit' => '500g jar',
            'price' => 1200.00,
            'stock_quantity' => 20,
            'image' => 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
            'is_sold_out' => false,
            'is_recurring' => true,
        ]);

        // Save Weekly Recurring Template for Farmer 1
        $profile1->update([
            'stock_template' => [
                ['id' => $p1->id, 'name' => $p1->name, 'price' => $p1->price, 'stock_quantity' => 60, 'unit' => 'kg', 'category_id' => $catVeg->id],
                ['id' => $p2->id, 'name' => $p2->name, 'price' => $p2->price, 'stock_quantity' => 100, 'unit' => 'kg', 'category_id' => $catVeg->id],
                ['id' => $p3->id, 'name' => $p3->name, 'price' => $p3->price, 'stock_quantity' => 40, 'unit' => 'bunch', 'category_id' => $catHerbs->id],
                ['id' => $p4->id, 'name' => $p4->name, 'price' => $p4->price, 'stock_quantity' => 35, 'unit' => 'kg', 'category_id' => $catVeg->id],
            ],
        ]);

        // 6. Customers & Orders are generated dynamically via real registration & checkout
    }
}
