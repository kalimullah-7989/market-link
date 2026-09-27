/**
 * MarketLink - Multi-Country & Multi-City Farmers Markets Dataset
 * Every country has 3+ major cities with accurate GPS coordinates and local bazaar stalls
 */

export const COUNTRIES_CONFIG = [
  {
    code: 'PK',
    name: 'Pakistan',
    defaultCity: 'Lahore',
    cities: [
      { name: 'Lahore', label: 'Lahore (لاہور)', coordinates: { lat: 31.5204, lng: 74.3587 }, zoom: 12 },
      { name: 'Karachi', label: 'Karachi (کراچی)', coordinates: { lat: 24.8607, lng: 67.0011 }, zoom: 12 },
      { name: 'Islamabad', label: 'Islamabad (اسلام آباد)', coordinates: { lat: 33.6844, lng: 73.0479 }, zoom: 12 },
      { name: 'Multan', label: 'Multan (ملتان)', coordinates: { lat: 30.1984, lng: 71.4687 }, zoom: 13 },
      { name: 'Faisalabad', label: 'Faisalabad (فیصل آباد)', coordinates: { lat: 31.4187, lng: 73.0791 }, zoom: 13 },
      { name: 'Peshawar', label: 'Peshawar (پشاور)', coordinates: { lat: 34.0151, lng: 71.5249 }, zoom: 13 },
      { name: 'Quetta', label: 'Quetta (کوئٹہ)', coordinates: { lat: 30.1798, lng: 66.9750 }, zoom: 13 }
    ]
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    defaultCity: 'Dubai',
    cities: [
      { name: 'Dubai', label: 'Dubai (دبي)', coordinates: { lat: 25.2048, lng: 55.2708 }, zoom: 12 },
      { name: 'Abu Dhabi', label: 'Abu Dhabi (أبو ظبي)', coordinates: { lat: 24.4539, lng: 54.3773 }, zoom: 12 },
      { name: 'Sharjah', label: 'Sharjah (الشارقة)', coordinates: { lat: 25.3573, lng: 55.4033 }, zoom: 13 }
    ]
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    defaultCity: 'Riyadh',
    cities: [
      { name: 'Riyadh', label: 'Riyadh (الرياض)', coordinates: { lat: 24.7136, lng: 46.6753 }, zoom: 12 },
      { name: 'Jeddah', label: 'Jeddah (جدة)', coordinates: { lat: 21.5433, lng: 39.1728 }, zoom: 12 },
      { name: 'Dammam', label: 'Dammam / Khobar (الدمام)', coordinates: { lat: 26.4207, lng: 50.0888 }, zoom: 12 }
    ]
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    defaultCity: 'London',
    cities: [
      { name: 'London', label: 'London', coordinates: { lat: 51.5074, lng: -0.1278 }, zoom: 12 },
      { name: 'Manchester', label: 'Manchester', coordinates: { lat: 53.4808, lng: -2.2426 }, zoom: 12 },
      { name: 'Edinburgh', label: 'Edinburgh', coordinates: { lat: 55.9533, lng: -3.1883 }, zoom: 12 }
    ]
  },
  {
    code: 'US',
    name: 'United States',
    defaultCity: 'New York',
    cities: [
      { name: 'New York', label: 'New York (NYC)', coordinates: { lat: 40.7128, lng: -74.0060 }, zoom: 12 },
      { name: 'Los Angeles', label: 'Los Angeles (LA)', coordinates: { lat: 34.0522, lng: -118.2437 }, zoom: 12 },
      { name: 'Chicago', label: 'Chicago', coordinates: { lat: 41.8781, lng: -87.6298 }, zoom: 12 }
    ]
  }
];

export const marketsData = [
  // ==========================================
  // PAKISTAN - LAHORE
  // ==========================================
  {
    id: 'market-lhr-1',
    name: 'Liberty Sunday Farmers Market',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Lahore',
    location: 'Liberty Roundabout Park, Gulberg III, Lahore',
    operatingDays: ['Saturday', 'Sunday'],
    timings: '08:00 AM - 02:00 PM',
    coordinates: { lat: 31.5122, lng: 74.3432 },
    activeFarmers: 24,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'Premier weekend organic bazaar featuring fresh vegetables, citrus, and dairy straight from surrounding Punjab farmsteads.'
  },
  {
    id: 'market-lhr-2',
    name: 'Model Town Organic Bazaar',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Lahore',
    location: 'Central Park Sports Complex, Model Town, Lahore',
    operatingDays: ['Sunday'],
    timings: '07:30 AM - 01:30 PM',
    coordinates: { lat: 31.4820, lng: 74.3220 },
    activeFarmers: 18,
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
    description: 'Popular community market specialized in chemical-free produce, fresh greens, farm honey, and free-range country eggs.'
  },
  {
    id: 'market-lhr-3',
    name: 'DHA Phase 5 Weekend Green Market',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Lahore',
    location: 'Sector C Commercial Park, DHA Phase 5, Lahore',
    operatingDays: ['Saturday', 'Sunday'],
    timings: '09:00 AM - 03:00 PM',
    coordinates: { lat: 31.4610, lng: 74.4020 },
    activeFarmers: 16,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Clean open-air farmer pavilion connecting premium organic growers with residents for pre-ordered vegetable crates.'
  },
  {
    id: 'market-lhr-4',
    name: 'Johar Town Model Kisan Mandi',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Lahore',
    location: 'Expo Centre Avenue, Block R1, Johar Town, Lahore',
    operatingDays: ['Wednesday', 'Sunday'],
    timings: '08:00 AM - 01:00 PM',
    coordinates: { lat: 31.4697, lng: 74.2728 },
    activeFarmers: 20,
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80',
    description: 'Direct grower-to-consumer agricultural market offering seasonal harvests at certified fair farmgate rates.'
  },

  // ==========================================
  // PAKISTAN - KARACHI
  // ==========================================
  {
    id: 'market-khi-1',
    name: 'Empress Market Organic Bazaar',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Karachi',
    location: 'Preedy Street, Saddar Heritage Zone, Karachi',
    operatingDays: ['Saturday', 'Sunday'],
    timings: '07:00 AM - 01:00 PM',
    coordinates: { lat: 24.8624, lng: 67.0270 },
    activeFarmers: 28,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'Historic open ground market with direct farm supply from Malir and Thatta farms. Known for heirloom vegetables and fresh herbs.'
  },
  {
    id: 'market-khi-2',
    name: 'Clifton Sunday Farmers Market',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Karachi',
    location: 'Boat Basin Park Promenade, Block 5, Clifton, Karachi',
    operatingDays: ['Sunday'],
    timings: '08:00 AM - 02:00 PM',
    coordinates: { lat: 24.8238, lng: 67.0315 },
    activeFarmers: 22,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Coastal breeze Sunday bazaar bringing certified organic hydroponic greens, cold-pressed oils, and fresh fruits.'
  },
  {
    id: 'market-khi-3',
    name: 'DHA Phase 5 Itwar Bazaar',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Karachi',
    location: 'Khayaban-e-Shamsheer Open Grounds, DHA Phase 5, Karachi',
    operatingDays: ['Sunday'],
    timings: '09:00 AM - 03:00 PM',
    coordinates: { lat: 24.8055, lng: 67.0650 },
    activeFarmers: 25,
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
    description: 'Dedicated farmer stalls featuring Sindh agricultural produce, fresh dates, sugarcane juice, and organic dairy.'
  },
  {
    id: 'market-khi-4',
    name: 'Gulshan-e-Iqbal Fresh Produce Mandi',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Karachi',
    location: 'University Road, Block 6, Gulshan-e-Iqbal, Karachi',
    operatingDays: ['Friday', 'Saturday'],
    timings: '08:00 AM - 01:30 PM',
    coordinates: { lat: 24.9180, lng: 67.0971 },
    activeFarmers: 19,
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80',
    description: 'Central hub for household shoppers to pick up pre-ordered weekend produce baskets directly from farm trucks.'
  },

  // ==========================================
  // PAKISTAN - ISLAMABAD / RAWALPINDI
  // ==========================================
  {
    id: 'market-isb-1',
    name: 'F-6 Super Market Fresh Farm Stalls',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Islamabad',
    location: 'School Road, Super Market, Sector F-6/1, Islamabad',
    operatingDays: ['Saturday', 'Sunday'],
    timings: '08:30 AM - 02:30 PM',
    coordinates: { lat: 33.7311, lng: 73.0645 },
    activeFarmers: 20,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'Margalla foothills gathering of organic growers from Chak Shahzad and Haripur orchards.'
  },
  {
    id: 'market-isb-2',
    name: 'H-9 Weekly Farmers & Harvest Mandi',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Islamabad',
    location: 'Kashmir Highway Bazaar Grounds, Sector H-9, Islamabad',
    operatingDays: ['Tuesday', 'Friday', 'Sunday'],
    timings: '07:00 AM - 02:00 PM',
    coordinates: { lat: 33.6780, lng: 73.0480 },
    activeFarmers: 35,
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
    description: 'The capital largest produce exchange with direct grower reservations and stall pickup checkpoints.'
  },
  {
    id: 'market-isb-3',
    name: 'Saddar Rawalpindi Kisan Bazaar',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Islamabad',
    location: 'Haider Road Sports Pavilion, Saddar, Rawalpindi',
    operatingDays: ['Saturday', 'Sunday'],
    timings: '08:00 AM - 01:00 PM',
    coordinates: { lat: 33.5975, lng: 73.0538 },
    activeFarmers: 17,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Pothohar regional farmers market offering seasonal garlic, potatoes, onions, and organic citrus fruits.'
  },

  // ==========================================
  // PAKISTAN - MULTAN
  // ==========================================
  {
    id: 'market-mul-1',
    name: 'Multan Cantt Officers Farmers Bazaar',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Multan',
    location: 'Askari Park Arena, Multan Cantt, Multan',
    operatingDays: ['Saturday', 'Sunday'],
    timings: '08:00 AM - 01:30 PM',
    coordinates: { lat: 30.2030, lng: 71.4650 },
    activeFarmers: 21,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'Famous South Punjab produce hub featuring Chaunsa mango groves, organic vegetables, and pure Desi Ghee.'
  },
  {
    id: 'market-mul-2',
    name: 'Ghalla Mandi Organic Agriculture Section',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Multan',
    location: 'Old Shujabad Road, Ghalla Mandi, Multan',
    operatingDays: ['Wednesday', 'Sunday'],
    timings: '07:30 AM - 02:00 PM',
    coordinates: { lat: 30.1870, lng: 71.4520 },
    activeFarmers: 26,
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80',
    description: 'Direct agricultural market for wholesale quality retail pickups of grains, pulses, and organic vegetables.'
  },
  {
    id: 'market-mul-3',
    name: 'Gulgasht Colony Weekend Produce Mart',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Multan',
    location: 'Gol Bagh Park Perimeter, Gulgasht Colony, Multan',
    operatingDays: ['Sunday'],
    timings: '08:30 AM - 01:00 PM',
    coordinates: { lat: 30.2240, lng: 71.4890 },
    activeFarmers: 15,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Friendly neighborhood market catering to family shoppers with fresh greens, farm eggs, and seasonal fruits.'
  },

  // ==========================================
  // PAKISTAN - FAISALABAD
  // ==========================================
  {
    id: 'market-fsd-1',
    name: 'D-Ground Farmers Fresh Bazaar',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Faisalabad',
    location: 'D-Ground Public Park, Peoples Colony No 1, Faisalabad',
    operatingDays: ['Saturday', 'Sunday'],
    timings: '08:00 AM - 02:00 PM',
    coordinates: { lat: 31.4110, lng: 73.0990 },
    activeFarmers: 22,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'Central agricultural hub connecting Faisalabad farm research growers with conscious local shoppers.'
  },
  {
    id: 'market-fsd-2',
    name: 'Jinnah Colony Weekly Produce Fair',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Faisalabad',
    location: 'University Agriculture Grounds, Jinnah Colony, Faisalabad',
    operatingDays: ['Sunday'],
    timings: '08:00 AM - 01:00 PM',
    coordinates: { lat: 31.4280, lng: 73.0780 },
    activeFarmers: 16,
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
    description: 'University collaboration market showcasing student-grown hydroponic strawberries and organic soil vegetables.'
  },

  // ==========================================
  // PAKISTAN - PESHAWAR
  // ==========================================
  {
    id: 'market-psh-1',
    name: 'Hayatabad Phase 3 Green Bazaar',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Peshawar',
    location: 'Tatara Park Boundary, Phase 3, Hayatabad, Peshawar',
    operatingDays: ['Saturday', 'Sunday'],
    timings: '08:30 AM - 02:00 PM',
    coordinates: { lat: 33.9850, lng: 71.4350 },
    activeFarmers: 18,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Khyber valley fresh harvest market with Swat apples, Charsadda walnuts, and Charsadda organic rice.'
  },
  {
    id: 'market-psh-2',
    name: 'Saddar Cantt Kisan Sabzi Mandi',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Peshawar',
    location: 'The Mall Road, Saddar Cantonment, Peshawar',
    operatingDays: ['Sunday'],
    timings: '08:00 AM - 01:00 PM',
    coordinates: { lat: 34.0040, lng: 71.5420 },
    activeFarmers: 14,
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80',
    description: 'Fresh vegetables and Peshawar valley stone fruits direct from local growers.'
  },

  // ==========================================
  // PAKISTAN - QUETTA
  // ==========================================
  {
    id: 'market-qta-1',
    name: 'Shahrah-e-Iqbal Fresh Fruit & Farm Bazaar',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Quetta',
    location: 'Liaquat Park Grounds, Shahrah-e-Iqbal, Quetta',
    operatingDays: ['Sunday'],
    timings: '09:00 AM - 02:00 PM',
    coordinates: { lat: 30.1833, lng: 66.9986 },
    activeFarmers: 15,
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80',
    description: 'Balochistan premier mountain farm marketplace offering fresh pomegranates, grapes, almonds, and dry fruits.'
  },
  {
    id: 'market-qta-2',
    name: 'Chaman Road Fresh Orchard Mandi',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Quetta',
    location: 'Chaman Road Produce Pavilion, Quetta Outskirts, Quetta',
    operatingDays: ['Friday', 'Saturday'],
    timings: '08:00 AM - 01:00 PM',
    coordinates: { lat: 30.2210, lng: 66.9820 },
    activeFarmers: 12,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Direct orchard trucks offering crisp apples, cherries, and high-altitude root vegetables.'
  },

  // ==========================================
  // UAE - DUBAI, ABU DHABI, SHARJAH (3 CITIES)
  // ==========================================
  {
    id: 'market-dxb-1',
    name: 'Ripe Organic Market - Academy Park',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Dubai',
    location: 'Dubai Police Academy Park, Umm Suqeim, Dubai, UAE',
    operatingDays: ['Saturday', 'Sunday'],
    timings: '09:00 AM - 07:00 PM',
    coordinates: { lat: 25.1390, lng: 55.1980 },
    activeFarmers: 30,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'Iconic UAE community gathering featuring local hydroponic farms, organic kale, dates, and artisanal foods.'
  },
  {
    id: 'market-dxb-2',
    name: 'Business Bay Canal Farmers Stalls',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Dubai',
    location: 'Marasi Drive Promenade, Business Bay, Dubai, UAE',
    operatingDays: ['Friday', 'Saturday'],
    timings: '08:00 AM - 01:00 PM',
    coordinates: { lat: 25.1850, lng: 55.2710 },
    activeFarmers: 16,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Waterfront organic harvest market featuring local vertical farm produce and desert honey.'
  },
  {
    id: 'market-auh-1',
    name: 'Mina Zayed Fresh Harvest & Agri Market',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Abu Dhabi',
    location: 'Port Zayed Waterfront, Abu Dhabi, UAE',
    operatingDays: ['Friday', 'Saturday'],
    timings: '07:00 AM - 02:00 PM',
    coordinates: { lat: 24.5150, lng: 54.3820 },
    activeFarmers: 20,
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
    description: 'Historic portside market featuring local desert greenhouse harvests and organic oasis crops.'
  },
  {
    id: 'market-auh-2',
    name: 'Yas Island Weekend Organic Souq',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Abu Dhabi',
    location: 'Yas Marina Waterfront Plaza, Abu Dhabi, UAE',
    operatingDays: ['Saturday'],
    timings: '08:30 AM - 02:30 PM',
    coordinates: { lat: 24.4680, lng: 54.6050 },
    activeFarmers: 14,
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80',
    description: 'Marina gathering of certified organic vegetable growers, organic date palms, and artisanal sourdough bakers.'
  },
  {
    id: 'market-shj-1',
    name: 'Souq Al Jubail Fresh Produce Market',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Sharjah',
    location: 'Corniche Street, Al Jubail District, Sharjah, UAE',
    operatingDays: ['Friday', 'Saturday', 'Sunday'],
    timings: '07:00 AM - 01:00 PM',
    coordinates: { lat: 25.3530, lng: 55.3850 },
    activeFarmers: 26,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'Major cultural emirate agricultural terminal offering fresh greens, greenhouse tomatoes, and fresh herbs.'
  },
  {
    id: 'market-shj-2',
    name: 'Al Majaz Waterfront Community Green Stalls',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Sharjah',
    location: 'Al Majaz Waterfront Park, Khalid Lagoon, Sharjah, UAE',
    operatingDays: ['Saturday'],
    timings: '08:00 AM - 02:00 PM',
    coordinates: { lat: 25.3310, lng: 55.3820 },
    activeFarmers: 15,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Open parkside farmers market supporting regional agricultural cooperatives and clean produce.'
  },

  // ==========================================
  // SAUDI ARABIA - RIYADH, JEDDAH, DAMMAM (3 CITIES)
  // ==========================================
  {
    id: 'market-ruh-1',
    name: 'Al-Murabba Organic Dates & Produce Souq',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Riyadh',
    location: 'King Saud Road, Al-Murabba, Riyadh, KSA',
    operatingDays: ['Thursday', 'Friday', 'Saturday'],
    timings: '08:00 AM - 01:00 PM',
    coordinates: { lat: 24.6560, lng: 46.7110 },
    activeFarmers: 25,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional Saudi agricultural souq with Al-Qassim dates, hydroponic tomatoes, and mountain herbs.'
  },
  {
    id: 'market-ruh-2',
    name: 'Diplomatic Quarter Farmers & Harvest Market',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Riyadh',
    location: 'Oud Square, Al Safarat, Diplomatic Quarter, Riyadh, KSA',
    operatingDays: ['Saturday'],
    timings: '09:00 AM - 03:00 PM',
    coordinates: { lat: 24.6850, lng: 46.6230 },
    activeFarmers: 18,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'Clean pedestrian bazaar featuring local certified hydroponic farms, Sidr honey, and organic produce.'
  },
  {
    id: 'market-jed-1',
    name: 'Al-Balad Traditional Farm Fresh Market',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Jeddah',
    location: 'Historic Al-Balad Plaza, Jeddah, KSA',
    operatingDays: ['Friday', 'Saturday'],
    timings: '08:00 AM - 01:30 PM',
    coordinates: { lat: 21.4858, lng: 39.1866 },
    activeFarmers: 18,
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80',
    description: 'Historic Red Sea farmers bazaar offering Taif roses, mountain honey, and local farmstead vegetables.'
  },
  {
    id: 'market-jed-2',
    name: 'Al-Corniche Weekend Harvest Fair',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Jeddah',
    location: 'North Corniche Promenade, Al Shatie, Jeddah, KSA',
    operatingDays: ['Saturday'],
    timings: '08:00 AM - 02:00 PM',
    coordinates: { lat: 21.5790, lng: 39.1110 },
    activeFarmers: 15,
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
    description: 'Coastal morning bazaar bringing fresh citrus, farm eggs, and seasonal vegetables from Makkah province farms.'
  },
  {
    id: 'market-dmm-1',
    name: 'Dammam Central Agri Produce Souq',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Dammam',
    location: 'King Fahd Road, Al Souq District, Dammam, KSA',
    operatingDays: ['Thursday', 'Friday', 'Saturday'],
    timings: '07:30 AM - 01:00 PM',
    coordinates: { lat: 26.4350, lng: 50.1040 },
    activeFarmers: 22,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'Eastern Province agricultural exchange connecting Al-Ahsa oasis vegetable and date growers with city shoppers.'
  },
  {
    id: 'market-dmm-2',
    name: 'Al-Khobar Corniche Organic Mart',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Dammam',
    location: 'Prince Turki Street, Waterfront, Al Khobar, KSA',
    operatingDays: ['Saturday'],
    timings: '08:30 AM - 02:00 PM',
    coordinates: { lat: 26.2820, lng: 50.2180 },
    activeFarmers: 14,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Breezy weekend market offering fresh strawberries, hydroponic lettuces, and organic honey.'
  },

  // ==========================================
  // UNITED KINGDOM - LONDON, MANCHESTER, EDINBURGH (3 CITIES)
  // ==========================================
  {
    id: 'market-lon-1',
    name: 'Borough Market Fresh Produce Stalls',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    location: '8 Southwark St, London SE1 1TL, UK',
    operatingDays: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timings: '10:00 AM - 05:00 PM',
    coordinates: { lat: 51.5055, lng: -0.0910 },
    activeFarmers: 32,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'World-renowned open-air produce market with farm-direct artisanal heritage crops and dairy.'
  },
  {
    id: 'market-lon-2',
    name: 'Marylebone Farmers Market',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    location: 'Aybrook Street, Marylebone, London W1U 4EP, UK',
    operatingDays: ['Sunday'],
    timings: '10:00 AM - 02:00 PM',
    coordinates: { lat: 51.5200, lng: -0.1550 },
    activeFarmers: 20,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'One of London flagship farmers markets with certified organic meat, game, seasonal vegetables, and sourdough.'
  },
  {
    id: 'market-man-1',
    name: 'Levenshulme Weekend Produce Market',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'Manchester',
    location: 'Station Car Park, Stockport Road, Levenshulme, Manchester, UK',
    operatingDays: ['Saturday'],
    timings: '10:00 AM - 04:00 PM',
    coordinates: { lat: 53.4440, lng: -2.1930 },
    activeFarmers: 22,
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80',
    description: 'Community-run market bringing Lancashire farmers, artisan cheese makers, and orchard growers together.'
  },
  {
    id: 'market-man-2',
    name: 'Northern Quarter Fresh Harvest Pavilion',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'Manchester',
    location: 'Stevenson Square, Northern Quarter, Manchester, UK',
    operatingDays: ['Sunday'],
    timings: '11:00 AM - 04:00 PM',
    coordinates: { lat: 53.4830, lng: -2.2350 },
    activeFarmers: 16,
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
    description: 'Urban gathering of organic farm trucks offering seasonal berries, free-range eggs, and artisan preserves.'
  },
  {
    id: 'market-edi-1',
    name: 'Edinburgh Castle Terrace Farmers Market',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'Edinburgh',
    location: 'Castle Terrace, Edinburgh EH1 2EN, UK',
    operatingDays: ['Saturday'],
    timings: '09:00 AM - 02:00 PM',
    coordinates: { lat: 55.9480, lng: -3.2030 },
    activeFarmers: 28,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'Picturesque market under Edinburgh Castle featuring Scottish Highland beef, fresh trout, and Lothian vegetables.'
  },
  {
    id: 'market-edi-2',
    name: 'Stockbridge Sunday Organic Bazaar',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'Edinburgh',
    location: 'Saunders Street, Stockbridge, Edinburgh EH3 6TQ, UK',
    operatingDays: ['Sunday'],
    timings: '10:00 AM - 04:00 PM',
    coordinates: { lat: 55.9580, lng: -3.2090 },
    activeFarmers: 20,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Beloved riverside weekly market with organic root vegetables, Scottish wild honey, and farmstead cheeses.'
  },

  // ==========================================
  // UNITED STATES - NEW YORK, LOS ANGELES, CHICAGO (3 CITIES)
  // ==========================================
  {
    id: 'market-nyc-1',
    name: 'Union Square Greenmarket',
    country: 'United States',
    countryCode: 'US',
    city: 'New York',
    location: 'Broadway & E 17th St, New York, NY 10003, USA',
    operatingDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timings: '08:00 AM - 06:00 PM',
    coordinates: { lat: 40.7359, lng: -73.9911 },
    activeFarmers: 35,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Flagship farmers market showcasing regional family farms with fresh apples, heirloom tomatoes, and organic bakery goods.'
  },
  {
    id: 'market-nyc-2',
    name: 'Grand Army Plaza Greenmarket (Brooklyn)',
    country: 'United States',
    countryCode: 'US',
    city: 'New York',
    location: 'Prospect Park West & Union St, Brooklyn, NY 11215, USA',
    operatingDays: ['Saturday'],
    timings: '08:00 AM - 03:00 PM',
    coordinates: { lat: 40.6738, lng: -73.9700 },
    activeFarmers: 24,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'Brooklyn premier farm destination with fresh Hudson Valley cider, farmstead butter, and fresh seasonal greens.'
  },
  {
    id: 'market-la-1',
    name: 'Santa Monica Downtown Farmers Market',
    country: 'United States',
    countryCode: 'US',
    city: 'Los Angeles',
    location: 'Arizona Ave & 2nd St, Santa Monica, CA 90401, USA',
    operatingDays: ['Wednesday', 'Saturday'],
    timings: '08:00 AM - 01:00 PM',
    coordinates: { lat: 34.0160, lng: -118.4970 },
    activeFarmers: 30,
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80',
    description: 'Renowned chef-favorite farmers market known for California avocados, organic citrus, berries, and microgreens.'
  },
  {
    id: 'market-la-2',
    name: 'Hollywood Sunday Organic Farmers Market',
    country: 'United States',
    countryCode: 'US',
    city: 'Los Angeles',
    location: 'Ivar Ave & Selma Ave, Hollywood, CA 90028, USA',
    operatingDays: ['Sunday'],
    timings: '08:30 AM - 01:30 PM',
    coordinates: { lat: 34.1010, lng: -118.3280 },
    activeFarmers: 26,
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
    description: 'Lively community market featuring organic nuts, heirloom squash, fresh herbs, and farmstead cheeses.'
  },
  {
    id: 'market-chi-1',
    name: 'Green City Market (Lincoln Park)',
    country: 'United States',
    countryCode: 'US',
    city: 'Chicago',
    location: '1817 N Clark St, Lincoln Park, Chicago, IL 60614, USA',
    operatingDays: ['Wednesday', 'Saturday'],
    timings: '07:00 AM - 01:00 PM',
    coordinates: { lat: 41.9210, lng: -87.6360 },
    activeFarmers: 28,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    description: 'Midwest premier sustainable market connecting certified sustainable Midwest growers with Chicago residents.'
  },
  {
    id: 'market-chi-2',
    name: 'Logan Square Sunday Farmers Market',
    country: 'United States',
    countryCode: 'US',
    city: 'Chicago',
    location: '3107 W Logan Blvd, Chicago, IL 60647, USA',
    operatingDays: ['Sunday'],
    timings: '08:30 AM - 03:00 PM',
    coordinates: { lat: 41.9280, lng: -87.7050 },
    activeFarmers: 20,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Vibrant neighborhood boulevard market with farm honey, local orchard fruit, and organic root crops.'
  }
];
