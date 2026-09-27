<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RichProductsCatalogSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Categories exist
        $catVeg = Category::firstOrCreate(['slug' => 'fresh-vegetables'], [
            'name' => 'Fresh Vegetables',
            'icon' => 'carrot',
            'is_active' => true,
        ]);

        $catFruit = Category::firstOrCreate(['slug' => 'seasonal-fruits'], [
            'name' => 'Seasonal Fruits',
            'icon' => 'apple-alt',
            'is_active' => true,
        ]);

        $catDairy = Category::firstOrCreate(['slug' => 'farm-dairy-eggs'], [
            'name' => 'Farm Dairy & Eggs',
            'icon' => 'egg',
            'is_active' => true,
        ]);

        $catHerbs = Category::firstOrCreate(['slug' => 'herbs-greens'], [
            'name' => 'Herbs & Greens',
            'icon' => 'leaf',
            'is_active' => true,
        ]);

        $catHoney = Category::firstOrCreate(['slug' => 'honey-preserves'], [
            'name' => 'Honey & Preserves',
            'icon' => 'jar',
            'is_active' => true,
        ]);

        $catBakery = Category::firstOrCreate(['slug' => 'bakery-grains'], [
            'name' => 'Flour, Grains & Oils',
            'icon' => 'bread-slice',
            'is_active' => true,
        ]);

        // 2. Fetch or create farmers across Lahore, Karachi, Islamabad, and Multan
        // Farmer 1: Tariq Mehmood (Kasur / Lahore - Liberty)
        $farmerTariq = User::firstOrCreate(
            ['email' => 'tariq@punjabfarm.com'],
            [
                'name' => 'Tariq Mehmood',
                'password' => Hash::make('password123'),
                'phone' => '0301-5556677',
                'address' => 'Kasur Agricultural Belt',
                'city' => 'Lahore',
                'country' => 'Pakistan',
                'role' => 'farmer',
                'is_active' => true,
            ]
        );
        $mLiberty = Market::where('name', 'like', '%Liberty%')->first() ?? Market::first();
        FarmerProfile::updateOrCreate(
            ['user_id' => $farmerTariq->id],
            [
                'market_id' => $mLiberty?->id ?? 1,
                'farm_name' => 'Punjab Green Organic Farm',
                'stall_number' => 'Stall #A-04',
                'stall_category' => 'Organic Vegetables & Fresh Greens',
                'stall_items' => 'Vine Tomatoes, Red Potatoes, Carrots, Cucumbers, Bell Peppers',
                'farm_address' => 'Kasur Rural Dist., 32km from Lahore',
                'city' => 'Lahore',
                'country' => 'Pakistan',
                'approval_status' => 'approved',
                'bio' => 'Growing pesticide-free seasonal vegetables on fertile riverbed soil with clean tubewell irrigation.',
                'cutoff_hours' => 4,
                'operating_days' => ['Saturday', 'Sunday'],
            ]
        );

        // Farmer 2: Chaudhry Bashir (Sheikhupura / Lahore - Model Town)
        $farmerBashir = User::firstOrCreate(
            ['email' => 'bashir@dairyfarm.com'],
            [
                'name' => 'Chaudhry Bashir',
                'password' => Hash::make('password123'),
                'phone' => '0322-8889900',
                'address' => 'Sheikhupura Canal Road',
                'city' => 'Lahore',
                'country' => 'Pakistan',
                'role' => 'farmer',
                'is_active' => true,
            ]
        );
        $mModelTown = Market::where('name', 'like', '%Model Town%')->first() ?? $mLiberty;
        FarmerProfile::updateOrCreate(
            ['user_id' => $farmerBashir->id],
            [
                'market_id' => $mModelTown?->id ?? 2,
                'farm_name' => 'Al-Razaq Pure Dairy & Cattle Farm',
                'stall_number' => 'Stall #B-12',
                'stall_category' => 'Fresh Farm Dairy, Milk & Desi Ghee',
                'stall_items' => 'Pure Buffalo Milk, Fresh Cow Milk, Desi Makhan, Free-Range Eggs, Artisan Paneer',
                'farm_address' => 'Sheikhupura Pastures',
                'city' => 'Lahore',
                'country' => 'Pakistan',
                'approval_status' => 'approved',
                'bio' => '100% natural, unadulterated raw dairy from grass-fed Sahiwal cows and Nili-Ravi buffaloes.',
                'cutoff_hours' => 3,
                'operating_days' => ['Sunday'],
            ]
        );

        // Farmer 3: Haji Rasheed (Sargodha / Lahore - DHA Phase 5)
        $farmerRasheed = User::firstOrCreate(
            ['email' => 'rasheed@citrusfarm.com'],
            [
                'name' => 'Haji Rasheed',
                'password' => Hash::make('password123'),
                'phone' => '0333-4443322',
                'address' => 'Bhalwal Citrus Belt, Sargodha',
                'city' => 'Lahore',
                'country' => 'Pakistan',
                'role' => 'farmer',
                'is_active' => true,
            ]
        );
        $mDHA = Market::where('name', 'like', '%DHA Phase 5 Weekend%')->first() ?? Market::where('city', 'Lahore')->first();
        FarmerProfile::updateOrCreate(
            ['user_id' => $farmerRasheed->id],
            [
                'market_id' => $mDHA?->id ?? 3,
                'farm_name' => 'Sargodha Citrus & Sidr Honey Orchard',
                'stall_number' => 'Stall #C-08',
                'stall_category' => 'Herbs, Spices & Natural Sidr Honey',
                'stall_items' => 'Export Kinnow Mandarins, Wild Sidr Honey, Raw Turmeric',
                'farm_address' => 'Bhalwal Orchard Valley, Sargodha',
                'city' => 'Lahore',
                'country' => 'Pakistan',
                'approval_status' => 'approved',
                'bio' => 'Award-winning citrus groves and unheated raw Sidr honey gathered from wild mountain hives.',
                'cutoff_hours' => 6,
                'operating_days' => ['Saturday', 'Sunday'],
            ]
        );

        // Farmer 4: Rasheed Maliri (Karachi - Empress Market)
        $farmerKarachi1 = User::firstOrCreate(
            ['email' => 'rasheed.karachi@marketlink.pk'],
            [
                'name' => 'Rasheed Ahmed Maliri',
                'password' => Hash::make('password123'),
                'phone' => '0300-8273645',
                'address' => 'Malir River Farmlands, Karachi',
                'city' => 'Karachi',
                'country' => 'Pakistan',
                'role' => 'farmer',
                'is_active' => true,
            ]
        );
        $mEmpress = Market::where('city', 'Karachi')->where('name', 'like', '%Empress%')->first() ?? Market::where('city', 'Karachi')->first();
        FarmerProfile::updateOrCreate(
            ['user_id' => $farmerKarachi1->id],
            [
                'market_id' => $mEmpress?->id ?? 4,
                'farm_name' => 'Malir River Organic Valley',
                'stall_number' => 'Stall #M-02',
                'stall_category' => 'Organic Vegetables & Fresh Greens',
                'stall_items' => 'Tender Spinach, Desi Ladyfinger (Bhindi), Fresh Mint, Pink Onions',
                'farm_address' => 'Malir River Basin, Thatta Road, Karachi',
                'city' => 'Karachi',
                'country' => 'Pakistan',
                'approval_status' => 'approved',
                'bio' => 'Fresh green vegetables harvested daily at 4:00 AM from Malir farms for Empress Market consumers.',
                'cutoff_hours' => 4,
                'operating_days' => ['Saturday', 'Sunday'],
            ]
        );

        // Farmer 5: Bismillah Goth / Sindh Palm Groves (Karachi - Clifton Sunday Market)
        $farmerKarachi2 = User::firstOrCreate(
            ['email' => 'bismillah@sindhorganic.pk'],
            [
                'name' => 'Mir Ghulam Rasool',
                'password' => Hash::make('password123'),
                'phone' => '0334-9182736',
                'address' => 'Khairpur Palm Groves & Clifton',
                'city' => 'Karachi',
                'country' => 'Pakistan',
                'role' => 'farmer',
                'is_active' => true,
            ]
        );
        $mClifton = Market::where('city', 'Karachi')->where('name', 'like', '%Clifton%')->first() ?? $mEmpress;
        FarmerProfile::updateOrCreate(
            ['user_id' => $farmerKarachi2->id],
            [
                'market_id' => $mClifton?->id ?? 5,
                'farm_name' => 'Sindh Palm & Fruit Syndicate',
                'stall_number' => 'Stall #K-05',
                'stall_category' => 'Seasonal Fresh Fruits & Citrus',
                'stall_items' => 'Organic Aseel Dates, Larkana Guava, Sindhri Mangoes',
                'farm_address' => 'Khairpur & Sukkur Agricultural Orchards',
                'city' => 'Karachi',
                'country' => 'Pakistan',
                'approval_status' => 'approved',
                'bio' => 'Pure unpolished Aseel dates, coastal guavas, and premium ripe Sindh fruits.',
                'cutoff_hours' => 5,
                'operating_days' => ['Sunday'],
            ]
        );

        // Farmer 6: Gulzar Ahmed (Swat & Hazara / Islamabad - F-6 Super Market)
        $farmerIslamabad = User::firstOrCreate(
            ['email' => 'gulzar.swat@marketlink.pk'],
            [
                'name' => 'Gulzar Ahmed Swati',
                'password' => Hash::make('password123'),
                'phone' => '0344-9988112',
                'address' => 'Matta Valley, Swat',
                'city' => 'Islamabad',
                'country' => 'Pakistan',
                'role' => 'farmer',
                'is_active' => true,
            ]
        );
        $mIslamabad = Market::where('city', 'Islamabad')->first() ?? $mLiberty;
        FarmerProfile::updateOrCreate(
            ['user_id' => $farmerIslamabad->id],
            [
                'market_id' => $mIslamabad?->id ?? 9,
                'farm_name' => 'Swat High Altitude Orchards',
                'stall_number' => 'Stall #S-11',
                'stall_category' => 'Seasonal Fresh Fruits & Citrus',
                'stall_items' => 'Royal Red Apples, Mountain Apricots, Himalayan Shilajit, Acacia Honey',
                'farm_address' => 'Upper Swat Valley, Khyber Pakhtunkhwa',
                'city' => 'Islamabad',
                'country' => 'Pakistan',
                'approval_status' => 'approved',
                'bio' => 'High-altitude organic mountain produce, non-waxed crisp apples, and pure natural bee honey.',
                'cutoff_hours' => 6,
                'operating_days' => ['Saturday', 'Sunday'],
            ]
        );

        // Farmer 7: Malik Akhtar (Multan - Multan Cantt Farmers Bazaar)
        $farmerMultan = User::firstOrCreate(
            ['email' => 'akhtar.multan@marketlink.pk'],
            [
                'name' => 'Malik Akhtar Hussain',
                'password' => Hash::make('password123'),
                'phone' => '0302-7711223',
                'address' => 'Shujabad Mango Belt, Multan',
                'city' => 'Multan',
                'country' => 'Pakistan',
                'role' => 'farmer',
                'is_active' => true,
            ]
        );
        $mMultan = Market::where('city', 'Multan')->first() ?? $mLiberty;
        FarmerProfile::updateOrCreate(
            ['user_id' => $farmerMultan->id],
            [
                'market_id' => $mMultan?->id ?? 11,
                'farm_name' => 'Cholistan Desi Dairy & Ghee',
                'stall_number' => 'Stall #D-08',
                'stall_category' => 'Fresh Farm Dairy, Milk & Desi Ghee',
                'stall_items' => 'Pure Bilona Desi Ghee, Chaunsa Mangoes, Cold-Pressed Mustard Oil',
                'farm_address' => 'Raza Abad, Shujabad Road, Multan',
                'city' => 'Multan',
                'country' => 'Pakistan',
                'approval_status' => 'approved',
                'bio' => 'Traditional bilona desi ghee made from grass-fed Cholistani cattle, cold-pressed Kohlu oils, and sweet Chaunsa.',
                'cutoff_hours' => 4,
                'operating_days' => ['Saturday', 'Sunday'],
            ]
        );

        // 3. Products Catalog Setup (31 Authentic Pakistani Farm Products)
        $productsCatalog = [
            // ================================================================
            // VEGETABLES (Sabziyan)
            // ================================================================
            [
                'farmer_id' => $farmerTariq->id,
                'category_id' => $catVeg->id,
                'name' => 'Farm Fresh Vine Tomatoes (Taaza Tamatar)',
                'description' => 'Naturally vine-ripened deep red juicy tomatoes harvested early morning from Kasur farm soil. Rich in lycopene and free from chemical spray.',
                'unit' => 'kg',
                'price' => 140.00,
                'stock_quantity' => 75,
                'image' => 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 3,
            ],
            [
                'farmer_id' => $farmerTariq->id,
                'category_id' => $catVeg->id,
                'name' => 'Organic Desi Red Potatoes (Desi Lal Aloo)',
                'description' => 'Earthy, thin-skinned desi red potatoes freshly dug from organic soil. Firm texture, non-sweet, ideal for traditional aloo bhujia and samosas.',
                'unit' => 'kg',
                'price' => 95.00,
                'stock_quantity' => 120,
                'image' => 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 6,
            ],
            [
                'farmer_id' => $farmerKarachi1->id,
                'category_id' => $catHerbs->id,
                'name' => 'Fresh Green Spinach (Taaza Desi Palak)',
                'description' => 'Dark green, iron-packed tender desi spinach bunches freshly cut at dawn from Malir organic riverbeds and washed in sweet tube-well water.',
                'unit' => 'bunch',
                'price' => 60.00,
                'stock_quantity' => 50,
                'image' => 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 2,
            ],
            [
                'farmer_id' => $farmerTariq->id,
                'category_id' => $catVeg->id,
                'name' => 'Crisp Salad Cucumbers (Taaza Desi Kheera)',
                'description' => 'Crisp, cooling desi green salad cucumbers with thin edible skin and zero bitterness. Grown under tunnel protection without artificial enhancers.',
                'unit' => 'kg',
                'price' => 85.00,
                'stock_quantity' => 45,
                'image' => 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 4,
            ],
            [
                'farmer_id' => $farmerKarachi1->id,
                'category_id' => $catVeg->id,
                'name' => 'Desi Pink Onions (Taaza Gulabi Pyaz)',
                'description' => 'Firm, aromatic Sindh pink onions with sharp pungent flavor. Sun-cured in open fields for long kitchen preservation.',
                'unit' => 'kg',
                'price' => 130.00,
                'stock_quantity' => 100,
                'image' => 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 12,
            ],
            [
                'farmer_id' => $farmerTariq->id,
                'category_id' => $catVeg->id,
                'name' => 'Glossy Green Bell Peppers (Shimla Mirch)',
                'description' => 'Crunchy, thick-walled green capsicum picked at peak maturity. Sweet grassy aroma and rich in vitamin C.',
                'unit' => 'kg',
                'price' => 160.00,
                'stock_quantity' => 35,
                'image' => 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 5,
            ],
            [
                'farmer_id' => $farmerKarachi1->id,
                'category_id' => $catVeg->id,
                'name' => 'Tender Farm Ladyfinger (Taaza Bhindi)',
                'description' => 'Hand-picked small tender ladyfingers (okra) without woody fibers. Snaps easily between fingers, cooks non-slimy.',
                'unit' => 'kg',
                'price' => 140.00,
                'stock_quantity' => 40,
                'image' => 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 3,
            ],
            [
                'farmer_id' => $farmerTariq->id,
                'category_id' => $catVeg->id,
                'name' => 'Sweet Red Farm Carrots (Lal Desi Gajar)',
                'description' => 'Crisp, bright red Punjab winter carrots naturally sweet and crunchy. Ideal for fresh morning juicing and traditional gajar ka halwa.',
                'unit' => 'kg',
                'price' => 110.00,
                'stock_quantity' => 60,
                'image' => 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 5,
            ],
            [
                'farmer_id' => $farmerTariq->id,
                'category_id' => $catVeg->id,
                'name' => 'Fresh Garlic & Ginger Roots (Desi Lehsan & Adrak)',
                'description' => 'Aromatic organic desi purple-striped garlic and soil-fresh ginger rhizomes harvested from alluvial Punjab soil.',
                'unit' => '500g pack',
                'price' => 280.00,
                'stock_quantity' => 30,
                'image' => 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 16,
            ],

            // ================================================================
            // FRUITS (Mousami Phal)
            // ================================================================
            [
                'farmer_id' => $farmerMultan->id,
                'category_id' => $catFruit->id,
                'name' => 'Multani Sweet Chaunsa Mangoes (Shahana Aam)',
                'description' => 'World-famous aromatic Multani Chaunsa mangoes, 100% tree-ripened without harmful calcium carbide chemicals. Unmatched sweetness and nectar aroma.',
                'unit' => 'kg',
                'price' => 320.00,
                'stock_quantity' => 65,
                'image' => 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 14,
            ],
            [
                'farmer_id' => $farmerRasheed->id,
                'category_id' => $catFruit->id,
                'name' => 'Sargodha Export Kinnow Mandarins (Meetha Kinnow)',
                'description' => 'Juicy sweet Kinnow mandarins with thin easy-peel rinds directly from prime Bhalwal orchards. Heavy with refreshing vitamin-packed juice.',
                'unit' => 'dozen',
                'price' => 280.00,
                'stock_quantity' => 80,
                'image' => 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 7,
            ],
            [
                'farmer_id' => $farmerIslamabad->id,
                'category_id' => $catFruit->id,
                'name' => 'Swat Valley Royal Red Apples (Kala Kula Saib)',
                'description' => 'Crisp, sweet, chemical-free red mountain apples from high-altitude Matta orchards watered by fresh glacial melting streams.',
                'unit' => 'kg',
                'price' => 260.00,
                'stock_quantity' => 55,
                'image' => 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 18,
            ],
            [
                'farmer_id' => $farmerKarachi2->id,
                'category_id' => $catFruit->id,
                'name' => 'Sukkur Organic Aseel Dates (Khaalis Khajoor)',
                'description' => 'Soft, caramel-sweet natural Aseel dates handpicked and sun-dried on organic palm groves in Khairpur/Sukkur. Zero added syrup.',
                'unit' => 'kg',
                'price' => 480.00,
                'stock_quantity' => 40,
                'image' => 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 24,
            ],
            [
                'farmer_id' => $farmerIslamabad->id,
                'category_id' => $catFruit->id,
                'name' => 'Skardu Organic Sun-Dried Apricots (Khubani)',
                'description' => 'Golden organic apricots naturally sun-dried in the fresh mountain air of Baltistan. Sweet with edible bitter-free almond kernels inside.',
                'unit' => '500g pack',
                'price' => 550.00,
                'stock_quantity' => 35,
                'image' => 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 36,
            ],
            [
                'farmer_id' => $farmerTariq->id,
                'category_id' => $catFruit->id,
                'name' => 'Farm Plucked Sweet Strawberries (Taaza Strawberry)',
                'description' => 'Fragrant, bright ruby-red strawberries picked at 5:00 AM from Kasur strawberry beds. Naturally sweet and aromatic.',
                'unit' => 'box (400g)',
                'price' => 340.00,
                'stock_quantity' => 25,
                'image' => 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 3,
            ],
            [
                'farmer_id' => $farmerKarachi2->id,
                'category_id' => $catFruit->id,
                'name' => 'Larkana Fragrant Guavas (Meetha Desi Amrood)',
                'description' => 'Round white-fleshed Larkana guavas with floral fragrance and soft edible seeds. Rich in natural dietary fiber and vitamin C.',
                'unit' => 'kg',
                'price' => 180.00,
                'stock_quantity' => 45,
                'image' => 'https://images.unsplash.com/photo-1536511135899-7a549d479361?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 8,
            ],

            // ================================================================
            // DAIRY & EGGS (Taaza Dairy aur Desi Anday)
            // ================================================================
            [
                'farmer_id' => $farmerBashir->id,
                'category_id' => $catDairy->id,
                'name' => '100% Pure Buffalo Milk (Khaalis Bhains ka Doodh)',
                'description' => 'Whole raw unpasteurized buffalo milk with 7.5%+ natural butterfat, chilled immediately after morning milking in sterile food-grade milk cans.',
                'unit' => 'litre',
                'price' => 240.00,
                'stock_quantity' => 70,
                'image' => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 2,
            ],
            [
                'farmer_id' => $farmerBashir->id,
                'category_id' => $catDairy->id,
                'name' => 'Farm Fresh Desi Cow Milk (Gaaye ka Taaza Doodh)',
                'description' => 'Naturally sweet A2 milk from pastured Sahiwal breed cows. Light, easily digestible, and golden with natural beta-carotene.',
                'unit' => 'litre',
                'price' => 210.00,
                'stock_quantity' => 50,
                'image' => 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 2,
            ],
            [
                'farmer_id' => $farmerBashir->id,
                'category_id' => $catDairy->id,
                'name' => 'Free-Range Desi Eggs (Asal Desi Murghi k Anday)',
                'description' => 'Authentic brown nutrient-dense eggs laid by pastured desi chickens roaming freely in open farm fields and fed natural grains.',
                'unit' => 'dozen',
                'price' => 380.00,
                'stock_quantity' => 45,
                'image' => 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 6,
            ],
            [
                'farmer_id' => $farmerBashir->id,
                'category_id' => $catDairy->id,
                'name' => 'Traditional Hand-Churned Makhan (Khaalis Desi Makhan)',
                'description' => 'Slowly churned from cultured cow dahi using traditional wooden madhani. Unsalted, fragrant, and packed with healthy natural probiotics.',
                'unit' => '500g',
                'price' => 750.00,
                'stock_quantity' => 25,
                'image' => 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 10,
            ],
            [
                'farmer_id' => $farmerMultan->id,
                'category_id' => $catDairy->id,
                'name' => 'Pure Bilona Desi Ghee (Khaalis Danedaar Desi Ghee)',
                'description' => 'Prepared strictly via the ancient Vedic Bilona method from curdled cow milk, slow-simmered on low flame until golden, aromatic, and granular.',
                'unit' => '1kg jar',
                'price' => 2400.00,
                'stock_quantity' => 30,
                'image' => 'https://images.unsplash.com/photo-1573812461383-e5f8b759d12e?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 24,
            ],
            [
                'farmer_id' => $farmerBashir->id,
                'category_id' => $catDairy->id,
                'name' => 'Fresh Artisan Desi Paneer (Khaalis Paneer)',
                'description' => 'Preservative-free soft cottage cheese crafted from whole buffalo milk and curdled with fresh lemon juice. High protein, soft texture.',
                'unit' => '500g block',
                'price' => 650.00,
                'stock_quantity' => 20,
                'image' => 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 4,
            ],
            [
                'farmer_id' => $farmerBashir->id,
                'category_id' => $catDairy->id,
                'name' => 'Organic Clay Pot Dahi (Matka Desi Yogurt)',
                'description' => 'Thick, creamy whole-milk yogurt fermented overnight in porous terracotta clay pots that absorb excess water, yielding natural thick curd.',
                'unit' => '1kg clay pot',
                'price' => 260.00,
                'stock_quantity' => 35,
                'image' => 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 6,
            ],

            // ================================================================
            // HONEY, HERBS & SPICES (Shehad, Masalay aur Bootiyan)
            // ================================================================
            [
                'farmer_id' => $farmerRasheed->id,
                'category_id' => $catHoney->id,
                'name' => 'Karak Mountain Wild Sidr Honey (Khaalis Beri Shehad)',
                'description' => '100% monofloral raw wild Sidr (Beri) honey harvested from Karak and Kohat desert hills. Unheated, unfiltered, rich caramel taste with proven medicinal qualities.',
                'unit' => '500g jar',
                'price' => 1600.00,
                'stock_quantity' => 40,
                'image' => 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 24,
            ],
            [
                'farmer_id' => $farmerIslamabad->id,
                'category_id' => $catHoney->id,
                'name' => 'Northern Acacia Flower Honey (Safaid Palosa Shehad)',
                'description' => 'Clear golden honey collected from wild Acacia blossoms in the pine-scented Hazara hills. Mild pleasant sweetness and slow crystallization.',
                'unit' => '500g jar',
                'price' => 1250.00,
                'stock_quantity' => 30,
                'image' => 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 48,
            ],
            [
                'farmer_id' => $farmerKarachi1->id,
                'category_id' => $catHerbs->id,
                'name' => 'Fresh Garden Mint & Coriander (Pudina aur Dhanya)',
                'description' => 'Vibrant aromatic spearmint and fresh green coriander with tender roots attached. Hand-bunched at sunrise for maximum aroma.',
                'unit' => 'combo bunch',
                'price' => 50.00,
                'stock_quantity' => 60,
                'image' => 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 2,
            ],
            [
                'farmer_id' => $farmerIslamabad->id,
                'category_id' => $catHerbs->id,
                'name' => 'Raw Mountain Turmeric Rhizomes (Taaza Kachi Haldi)',
                'description' => 'Freshly un-earthed golden turmeric roots from Swat valley slopes. High natural curcumin concentration, perfect for organic golden latte and remedies.',
                'unit' => '500g pack',
                'price' => 240.00,
                'stock_quantity' => 25,
                'image' => 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 24,
            ],
            [
                'farmer_id' => $farmerIslamabad->id,
                'category_id' => $catHerbs->id,
                'name' => 'Pure Himalayan Mountain Shilajit (Khaalis Salajeet)',
                'description' => 'Authentic Grade-A gold-grade Himalayan Shilajit resin purified through natural sunlight drying at high altitude in Baltistan. 100% lab tested.',
                'unit' => '20g jar',
                'price' => 1950.00,
                'stock_quantity' => 20,
                'image' => 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 72,
            ],

            // ================================================================
            // FLOUR, GRAINS & COLD-PRESSED OILS (Chakki Atta, Makai aur Sarson)
            // ================================================================
            [
                'farmer_id' => $farmerTariq->id,
                'category_id' => $catBakery->id,
                'name' => 'Stone-Ground Chakki Whole Wheat Atta (Khaalis Gandum Atta)',
                'description' => '100% whole grain wheat ground slowly on traditional stone chakki at low temperatures. Retains full natural bran (choker) and wheat germ nutrients.',
                'unit' => '5kg bag',
                'price' => 680.00,
                'stock_quantity' => 50,
                'image' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 12,
            ],
            [
                'farmer_id' => $farmerTariq->id,
                'category_id' => $catBakery->id,
                'name' => 'Desi Chakki Maize Flour (Taaza Makai ka Atta)',
                'description' => 'Finely stone-milled yellow cornmeal from indigenous non-GMO maize. Perfect for rustic Punjabi makai ki roti paired with fresh saag.',
                'unit' => 'kg',
                'price' => 190.00,
                'stock_quantity' => 40,
                'image' => 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 14,
            ],
            [
                'farmer_id' => $farmerMultan->id,
                'category_id' => $catBakery->id,
                'name' => 'Cold-Pressed Raw Mustard Oil (Kachhi Ghani Sarson Tail)',
                'description' => 'Extracted from clean yellow mustard seeds on traditional wooden Kohlu without heat or chemicals. Pungent, unrefined, golden and 100% pure.',
                'unit' => '1 litre bottle',
                'price' => 720.00,
                'stock_quantity' => 35,
                'image' => 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
                'harvest_hours' => 24,
            ],
        ];

        // Seed or update products
        foreach ($productsCatalog as $item) {
            $hours = $item['harvest_hours'] ?? 4;
            unset($item['harvest_hours']);

            $item['harvested_at'] = Carbon::now()->subHours($hours);
            $item['is_sold_out'] = false;
            $item['is_temporarily_unavailable'] = false;
            $item['is_recurring'] = true;

            Product::updateOrCreate(
                ['name' => $item['name'], 'farmer_id' => $item['farmer_id']],
                $item
            );
        }

        $this->command->info('Rich products catalog seeded successfully with ' . count($productsCatalog) . ' realistic products across all Pakistani categories!');
    }
}
