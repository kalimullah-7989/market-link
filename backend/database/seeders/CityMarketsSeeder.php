<?php

namespace Database\Seeders;

use App\Models\Market;
use Illuminate\Database\Seeder;

class CityMarketsSeeder extends Seeder
{
    public function run(): void
    {
        $markets = [
            // Karachi Markets
            [
                'name' => 'Empress Market Organic Bazaar',
                'city' => 'Karachi',
                'address' => 'Preedy Street, Saddar Heritage Zone, Karachi',
                'operating_days' => ['Saturday', 'Sunday'],
                'opening_time' => '07:00 AM',
                'closing_time' => '01:00 PM',
                'latitude' => 24.86240000,
                'longitude' => 67.02700000,
                'description' => 'Historic open ground market with direct farm supply from Malir and Thatta farms. Known for heirloom vegetables and fresh herbs.',
                'image_url' => 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'Clifton Sunday Farmers Market',
                'city' => 'Karachi',
                'address' => 'Boat Basin Park Promenade, Block 5, Clifton, Karachi',
                'operating_days' => ['Sunday'],
                'opening_time' => '08:00 AM',
                'closing_time' => '02:00 PM',
                'latitude' => 24.82380000,
                'longitude' => 67.03150000,
                'description' => 'Coastal breeze Sunday bazaar bringing certified organic hydroponic greens, cold-pressed oils, and fresh fruits.',
                'image_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'DHA Phase 5 Itwar Bazaar',
                'city' => 'Karachi',
                'address' => 'Khayaban-e-Shamsheer Open Grounds, DHA Phase 5, Karachi',
                'operating_days' => ['Sunday'],
                'opening_time' => '09:00 AM',
                'closing_time' => '03:00 PM',
                'latitude' => 24.80550000,
                'longitude' => 67.06500000,
                'description' => 'Dedicated farmer stalls featuring Sindh agricultural produce, fresh dates, sugarcane juice, and organic dairy.',
                'image_url' => 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'Gulshan-e-Iqbal Fresh Produce Mandi',
                'city' => 'Karachi',
                'address' => 'University Road, Block 6, Gulshan-e-Iqbal, Karachi',
                'operating_days' => ['Friday', 'Saturday'],
                'opening_time' => '08:00 AM',
                'closing_time' => '01:30 PM',
                'latitude' => 24.91800000,
                'longitude' => 67.09710000,
                'description' => 'Central hub for household shoppers to pick up pre-ordered weekend produce baskets directly from farm trucks.',
                'image_url' => 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],

            // Lahore Markets
            [
                'name' => 'Liberty Sunday Farmers Market',
                'city' => 'Lahore',
                'address' => 'Liberty Roundabout Park, Gulberg III, Lahore',
                'operating_days' => ['Saturday', 'Sunday'],
                'opening_time' => '08:00 AM',
                'closing_time' => '02:00 PM',
                'latitude' => 31.51220000,
                'longitude' => 74.34320000,
                'description' => 'Premier weekend organic bazaar featuring fresh vegetables, citrus, and dairy straight from surrounding Punjab farmsteads.',
                'image_url' => 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'Model Town Organic Bazaar',
                'city' => 'Lahore',
                'address' => 'Central Park Sports Complex, Model Town, Lahore',
                'operating_days' => ['Sunday'],
                'opening_time' => '07:30 AM',
                'closing_time' => '01:30 PM',
                'latitude' => 31.48200000,
                'longitude' => 74.32200000,
                'description' => 'Popular community market specialized in chemical-free produce, fresh greens, farm honey, and free-range country eggs.',
                'image_url' => 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'DHA Phase 5 Fresh Saturday Market',
                'city' => 'Lahore',
                'address' => 'Sector C Commercial Area, DHA Phase 5, Lahore',
                'operating_days' => ['Saturday'],
                'opening_time' => '08:30 AM',
                'closing_time' => '03:00 PM',
                'latitude' => 31.46800000,
                'longitude' => 74.39100000,
                'description' => 'High-quality local farm produce and specialty organic goods.',
                'image_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'Johar Town Model Kisan Mandi',
                'city' => 'Lahore',
                'address' => 'Expo Centre Avenue, Block R1, Johar Town, Lahore',
                'operating_days' => ['Wednesday', 'Sunday'],
                'opening_time' => '08:00 AM',
                'closing_time' => '01:00 PM',
                'latitude' => 31.46970000,
                'longitude' => 74.27280000,
                'description' => 'Direct grower-to-consumer agricultural market offering seasonal harvests at certified fair farmgate rates.',
                'image_url' => 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],

            // Islamabad & Rawalpindi
            [
                'name' => 'F-6 Super Market Fresh Farm Stalls',
                'city' => 'Islamabad',
                'address' => 'School Road, Super Market, Sector F-6/1, Islamabad',
                'operating_days' => ['Saturday', 'Sunday'],
                'opening_time' => '08:30 AM',
                'closing_time' => '02:30 PM',
                'latitude' => 33.73110000,
                'longitude' => 73.06450000,
                'description' => 'Margalla foothills gathering of organic growers from Chak Shahzad and Haripur orchards.',
                'image_url' => 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],
            [
                'name' => 'E-7 Hillview Organic Bazaar',
                'city' => 'Islamabad',
                'address' => 'Faisal Avenue Greens, Sector E-7, Islamabad',
                'operating_days' => ['Sunday'],
                'opening_time' => '09:00 AM',
                'closing_time' => '02:00 PM',
                'latitude' => 33.72500000,
                'longitude' => 73.05000000,
                'description' => 'Weekly green market featuring alpine honey, mountain apples, and zero-pesticide salad vegetables.',
                'image_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],

            // Multan
            [
                'name' => 'Multan Cantt Officers Farmers Bazaar',
                'city' => 'Multan',
                'address' => 'Askari Park Arena, Multan Cantt, Multan',
                'operating_days' => ['Saturday', 'Sunday'],
                'opening_time' => '08:00 AM',
                'closing_time' => '01:30 PM',
                'latitude' => 30.20300000,
                'longitude' => 71.46500000,
                'description' => 'Famous South Punjab produce hub featuring Chaunsa mango groves, organic vegetables, and pure Desi Ghee.',
                'image_url' => 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],

            // Faisalabad
            [
                'name' => 'Agriculture University (UAF) Farmers Bazaar',
                'city' => 'Faisalabad',
                'address' => 'Jail Road, UAF Sports Complex Ground, Faisalabad',
                'operating_days' => ['Saturday', 'Sunday'],
                'opening_time' => '07:30 AM',
                'closing_time' => '01:00 PM',
                'latitude' => 31.43100000,
                'longitude' => 73.07200000,
                'description' => 'University-backed sustainable agricultural showcase featuring agronomy research farmers and fresh produce.',
                'image_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],

            // Peshawar
            [
                'name' => 'Hayatabad Organic Kisan Market',
                'city' => 'Peshawar',
                'address' => 'Tatara Park Open Grounds, Phase 4, Hayatabad, Peshawar',
                'operating_days' => ['Sunday'],
                'opening_time' => '08:00 AM',
                'closing_time' => '02:00 PM',
                'latitude' => 33.99800000,
                'longitude' => 71.43500000,
                'description' => 'KP provincial farmers market with mountain walnuts, dry fruits, Peshawari greens, and fresh honey.',
                'image_url' => 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ],

            // Quetta
            [
                'name' => 'Serena Open Grounds Fruit & Organic Bazaar',
                'city' => 'Quetta',
                'address' => 'Zarghoon Road, Cantonment Area, Quetta',
                'operating_days' => ['Friday', 'Saturday'],
                'opening_time' => '09:00 AM',
                'closing_time' => '03:00 PM',
                'latitude' => 30.19800000,
                'longitude' => 67.01200000,
                'description' => 'Balochistan fresh harvest hub offering high-altitude pomegranates, apples, cherries, and organic dates.',
                'image_url' => 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80',
                'is_active' => true,
            ]
        ];

        foreach ($markets as $m) {
            Market::updateOrCreate(
                ['name' => $m['name']],
                $m
            );
        }
    }
}
