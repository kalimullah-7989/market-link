/**
 * MarketLink - Multi-Country & Multi-Language Produce Catalog
 * 
 * Provides authentic local farm harvest products tailored to each country and language.
 * - Pakistan (PK): Chaunsa mangoes, Kasuri methi, Buffalo milk, Swat apples, Desi eggs
 * - UAE (AE): Emirates Medjool/Khalas dates, Al Ain camel milk, Hatta Sidr honey, Liwa tomatoes, Dubai hydroponic greens
 * - Saudi Arabia (SA): Madinah Ajwa dates, Taif pomegranates, Al-Kharj pure milk, Qassim wheat, Asir mountain honey
 * - United Kingdom (GB): Kent Bramley apples, Somerset farmhouse cheddar, Scottish oats, Cotswolds eggs, Yorkshire carrots
 * - United States (US): California Hass avocados, Washington Honeycrisp apples, Wisconsin cheddar, Hudson Valley tomatoes
 */

export const COUNTRY_PRODUCTS = {
  // ==========================================================================
  // UNITED ARAB EMIRATES (الإمارات العربية المتحدة)
  // ==========================================================================
  AE: [
    {
      id: 201,
      category: 'fruits',
      price: 24, // in AED equivalent (corresponds to ~$6.5)
      oldPrice: 30,
      stockQuantity: 45,
      farmerId: 'ae-1',
      harvestHoursAgo: 5,
      image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
      names: {
        ar: 'رطب خلاص إماراتي فاخر (طازج من النخيل)',
        en: 'Fresh Emirates Khalas Dates (Premium Oasis Harvest)',
        ur: 'اماراتی تازہ خالص کھجوریں'
      },
      farmers: {
        ar: 'مزرعة واحة الذيد للنخيل (كشك #D-01) • الشارقة',
        en: 'Al Dhaid Palm Oasis Farm (Stall #D-01) • Sharjah',
        ur: 'الذید پام فارم (اسٹال #D-01) • شارجہ'
      },
      markets: {
        ar: 'سوق الجبيل للمنتجات الطازجة (الشارقة)',
        en: 'Souq Al Jubail Fresh Market (Sharjah)',
        ur: 'سوق الجبیل فریش مارکیٹ (شارجہ)'
      },
      units: { ar: 'كغ', en: 'kg', ur: 'کلو' },
      badges: { ar: 'قطاف الصباح', en: 'Morning Harvest', ur: 'صبح کی چنائی' },
      timeLabels: { ar: 'اليوم، 06:00 صباحاً', en: 'Today, 06:00 AM', ur: 'آج، صبح 06:00 بجے' },
      descriptions: {
        ar: 'تمور خلاص إماراتية عضوية طازجة مروية بالمياه الجوفية العذبة، غنية بالمعادن والألياف الطبيعية وبدون أي سكريات مضافة أو مبيدات.',
        en: 'Naturally ripened sweet organic Khalas dates harvested fresh from indigenous date palms in Sharjah oasis. Chemical-free and rich in natural energy.',
        ur: 'شارجہ کے نخلستان سے تازہ چنی ہوئی میٹھی قدرتی خلاص کھجوریں، بغیر کسی کیمیکل کے۔'
      }
    },
    {
      id: 202,
      category: 'dairy',
      price: 18,
      oldPrice: 22,
      stockQuantity: 30,
      farmerId: 'ae-2',
      harvestHoursAgo: 3,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      names: {
        ar: 'حليب نوق العين الطازج 100% طبيعي',
        en: 'Al Ain Fresh Camel Milk (100% Pure Organic)',
        ur: 'العین کا تازہ قدرتی اونٹنی کا دودھ'
      },
      farmers: {
        ar: 'مزرعة العين للألبان العضوية (كشك #A-05) • أبوظبي',
        en: 'Al Ain Organic Camel Dairy (Stall #A-05) • Abu Dhabi',
        ur: 'العین آرگینک اونٹ فارم (اسٹال #A-05) • ابوظہبی'
      },
      markets: {
        ar: 'سوق ميناء زايد العضوي (أبوظبي)',
        en: 'Mina Zayed Organic Farmers Market (Abu Dhabi)',
        ur: 'مینا زاید آرگینک مارکیٹ (ابوظہبی)'
      },
      units: { ar: 'لتر', en: 'litre', ur: 'لیٹر' },
      badges: { ar: 'طازج جداً', en: 'Ultra Fresh', ur: 'انتہائی تازہ' },
      timeLabels: { ar: 'اليوم، 05:30 صباحاً', en: 'Today, 05:30 AM', ur: 'آج، صبح 05:30 بجے' },
      descriptions: {
        ar: 'حليب نوق إماراتي طازج غير مبستر مبستر برفق، غني بفيتامين C والحديد وسهل الهضم من إبل ترعى على النباتات الصحراوية الطبيعية.',
        en: 'Raw pasture-grazed fresh camel milk bottled at dawn in Al Ain. Naturally low in fat, packed with immunoglobulins and essential minerals.',
        ur: 'العین کے صحرائی چراگاہوں سے صبح سویرے حاصل کیا گیا خالص تازہ اونٹنی کا دودھ۔'
      }
    },
    {
      id: 203,
      category: 'bakery',
      price: 65,
      oldPrice: 80,
      stockQuantity: 25,
      farmerId: 'ae-3',
      harvestHoursAgo: 24,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      names: {
        ar: 'عسل سدر إماراتي جبلي حر (حتا)',
        en: 'Pure UAE Hatta Mountain Sidr Honey',
        ur: 'حتا پہاڑوں کا خالص اماراتی سدر شہد'
      },
      farmers: {
        ar: 'مناحل جبال حتا الطبيعية (كشك #H-02) • دبي',
        en: 'Hatta Mountain Bee Apiaries (Stall #H-02) • Dubai',
        ur: 'حتا ماؤنٹین بی فارم (اسٹال #H-02) • دبئی'
      },
      markets: {
        ar: 'سوق رايب العضوي - حديقة الأكاديمية (دبي)',
        en: 'Ripe Organic Market - Academy Park (Dubai)',
        ur: 'رائپ آرگینک مارکیٹ - اکیڈمی پارک (دبئی)'
      },
      units: { ar: 'برطمان', en: 'jar (500g)', ur: 'جار (500 گرام)' },
      badges: { ar: 'عسل حر 100%', en: '100% Pure', ur: '100% خالص' },
      timeLabels: { ar: 'قطاف الأسبوع', en: 'Harvested This Week', ur: 'اس ہفتے کا شہد' },
      descriptions: {
        ar: 'عسل سدر جبلي نقي تم جمعه من أزهار أشجار السدر البرية في جبال حتا الشاهقة، معروف بنكهته الغنية وخصائصه العلاجية الطبيعية.',
        en: 'Unfiltered, raw mountain Sidr honey harvested from wild Sidr blooms in the rugged Hatta mountain range. Dark, intensely aromatic and medicinal grade.',
        ur: 'دبئی کے حتا پہاڑوں سے قدرتی بیری کے درختوں سے حاصل کردہ خالص قدرتی سدر شہد۔'
      }
    },
    {
      id: 204,
      category: 'vegetables',
      price: 12,
      oldPrice: 15,
      stockQuantity: 60,
      farmerId: 'ae-4',
      harvestHoursAgo: 4,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      names: {
        ar: 'طماطم واحة ليوا العضوية العنقودية',
        en: 'Liwa Oasis Vine-Ripened Organic Tomatoes',
        ur: 'واحہ لیوا کے نامیاتی گچھے دار ٹماٹر'
      },
      farmers: {
        ar: 'مزارع واحة ليوا النموذجية (كشك #L-09) • أبوظبي',
        en: 'Liwa Oasis Greenhouses (Stall #L-09) • Abu Dhabi',
        ur: 'لیوا اویسس گرین ہاؤس (اسٹال #L-09) • ابوظہبی'
      },
      markets: {
        ar: 'سوق جزيرة ياس الأسبوعي العضوي (أبوظبي)',
        en: 'Yas Island Weekend Organic Souq (Abu Dhabi)',
        ur: 'یاس آئی لینڈ ویک اینڈ آرگینک مارکیٹ (ابوظہبی)'
      },
      units: { ar: 'كغ', en: 'kg', ur: 'کلو' },
      badges: { ar: 'حصاد الحقل', en: 'Field Fresh', ur: 'کھیت سے تازہ' },
      timeLabels: { ar: 'اليوم، 06:30 صباحاً', en: 'Today, 06:30 AM', ur: 'آج، صبح 06:30 بجے' },
      descriptions: {
        ar: 'طماطم حمراء نضرة تم قطفها طازجة من البيوت المحمية العضوية في واحة ليوا بأبوظبي، حلوة المذاق ومثالية للسلطات والأطباق المتوسطية.',
        en: 'Sweet and juicy vine tomatoes grown in organic micro-climate shade greenhouses in Liwa Oasis. Pesticide-free with exceptional lycopene aroma.',
        ur: 'ابوظہبی کے لیوا نخلستان سے تازہ چنے ہوئے سرخ رسیلے آرگینک ٹماٹر۔'
      }
    },
    {
      id: 205,
      category: 'vegetables',
      price: 9,
      oldPrice: 12,
      stockQuantity: 70,
      farmerId: 'ae-5',
      harvestHoursAgo: 2,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      names: {
        ar: 'خضار ورقية مائية طازجة (جرجير ونعناع دبي)',
        en: 'Dubai Fresh Hydroponic Greens & Arugula',
        ur: 'دبئی ہائیڈروپونک تازہ سلاد و پودینہ'
      },
      farmers: {
        ar: 'مزارع دبي المائية العضوية (كشك #D-12) • دبي',
        en: 'Dubai Hydroponic Vertical Greens (Stall #D-12) • Dubai',
        ur: 'دبئی ہائیڈروپونک ورٹیکل گرینز (اسٹال #D-12) • دبئی'
      },
      markets: {
        ar: 'أكشاك قناة الخليج التجاري المائية (دبي)',
        en: 'Business Bay Canal Farmers Stalls (Dubai)',
        ur: 'بزنس بے کینال فارمرز اسٹالز (دبئی)'
      },
      units: { ar: 'حزمة', en: 'bunch', ur: 'گڈی' },
      badges: { ar: 'زراعة مائية', en: 'Hydroponic', ur: 'ہائیڈروپونک' },
      timeLabels: { ar: 'اليوم، 07:15 صباحاً', en: 'Today, 07:15 AM', ur: 'آج، صبح 07:15 بجے' },
      descriptions: {
        ar: 'جرجير وروكا ونعناع طازج يزرع بتقنية الزراعة المائية الذكية بدون تربة، مغسول وجاهز للتناول بطعم مقرمش ورائحة زكية.',
        en: 'Crisp, peppery wild rocket, baby spinach, and mint grown sustainably in indoor climate-controlled vertical hydroponic towers in Dubai.',
        ur: 'دبئی کے جدید ورٹیکل ہائیڈروپونک فارم سے حاصل کردہ تازہ کرکرا جرجیر اور پودینہ۔'
      }
    },
    {
      id: 206,
      category: 'dairy',
      price: 15,
      oldPrice: 18,
      stockQuantity: 40,
      farmerId: 'ae-6',
      harvestHoursAgo: 6,
      image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
      names: {
        ar: 'بيض دجاج بلدي طازج مرعى حر (الخوانيج)',
        en: 'Al Khawaneej Free-Range Organic Farm Eggs',
        ur: 'الخوانیج دیسی فارم کے تازہ انڈے'
      },
      farmers: {
        ar: 'مزرعة الخوانيج للطيور البلدية (كشك #K-03) • دبي',
        en: 'Al Khawaneej Free-Range Poultry (Stall #K-03) • Dubai',
        ur: 'الخوانیج پولٹری فارم (اسٹال #K-03) • دبئی'
      },
      markets: {
        ar: 'سوق رايب العضوي - حديقة الأكاديمية (دبي)',
        en: 'Ripe Organic Market - Academy Park (Dubai)',
        ur: 'رائپ آرگینک مارکیٹ - اکیڈمی پارک (دبئی)'
      },
      units: { ar: 'طبق (10 بيضات)', en: 'pack (10 pcs)', ur: 'پیک (10 عدد)' },
      badges: { ar: 'مرعى حر', en: 'Free-Range', ur: 'کھلی چراگاہ' },
      timeLabels: { ar: 'اليوم، 05:00 صباحاً', en: 'Today, 05:00 AM', ur: 'آج، صبح 05:00 بجے' },
      descriptions: {
        ar: 'بيض بلدي عضوي من دجاج يتغذى على الحبوب الطبيعية والأعشاب الخضراء ويسرح في مزارع الخوانيج المفتوحة بدبي، صفار غني ولذيذ.',
        en: 'Farm-fresh organic golden-yolk eggs from pastured, hormone-free hens enjoying natural desert sunshine in Al Khawaneej, Dubai.',
        ur: 'دبئی کے الخوانیج فارمز میں کھلی دھوپ اور قدرتی اناج پر پلنے والی مرغیوں کے سنہری زردی والے انڈے۔'
      }
    }
  ],

  // ==========================================================================
  // SAUDI ARABIA (المملكة العربية السعودية)
  // ==========================================================================
  SA: [
    {
      id: 301,
      category: 'fruits',
      price: 45, // in SAR
      oldPrice: 55,
      stockQuantity: 50,
      farmerId: 'sa-1',
      harvestHoursAgo: 8,
      image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
      names: {
        ar: 'عجوة المدينة المنورة العالية العضوية (فاخرة)',
        en: 'Organic Madinah Ajwa Dates (Premium Quality)',
        ur: 'مدینہ منورہ کی خالص عجوہ کھجور'
      },
      farmers: {
        ar: 'مزارع عوالي المدينة المنورة (كشك #M-01) • المدينة',
        en: 'Madinah Awali Date Orchards (Stall #M-01) • Madinah',
        ur: 'مدینہ منورہ پام آرچرڈز (اسٹال #M-01) • مدینہ'
      },
      markets: {
        ar: 'سوق المربع الموسمي العضوي (الرياض)',
        en: 'Al-Murabba Seasonal Organic Souq (Riyadh)',
        ur: 'المربع آرگینک بازار (ریاض)'
      },
      units: { ar: 'كغ', en: 'kg', ur: 'کلو' },
      badges: { ar: 'عجوة مباركة', en: 'Holy Ajwa', ur: 'مبارک عجوہ' },
      timeLabels: { ar: 'حصاد الأمس', en: 'Yesterday Harvest', ur: 'کل کا تازہ حصاد' },
      descriptions: {
        ar: 'عجوة المدينة المنورة الأصلية من مزارع العوالي المباركة، معبأة يدوياً وبدون أي إضافات كيميائية، غنية بالقيمة الغذائية والروحية.',
        en: 'Authentic Ajwa dates harvested from the historic palm groves of Al-Awali, Madinah. Naturally soft, dark, and full of natural antioxidants.',
        ur: 'مدینہ منورہ کے تاریخی باغات کی خالص عجوہ کھجور، بغیر کسی کیمیکل پروسیسنگ کے۔'
      }
    },
    {
      id: 302,
      category: 'dairy',
      price: 14,
      oldPrice: 18,
      stockQuantity: 40,
      farmerId: 'sa-2',
      harvestHoursAgo: 3,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      names: {
        ar: 'حليب بقر طازج نقي من مزارع الخرج',
        en: 'Al-Kharj Pure Farm Fresh Cow Milk',
        ur: 'الخرج فارمز کا تازہ قدرتی گائے کا دودھ'
      },
      farmers: {
        ar: 'مزارع ألبان الخرج الريفية (كشك #K-04) • الرياض',
        en: 'Al-Kharj Traditional Dairy (Stall #K-04) • Riyadh',
        ur: 'الخرج ڈیری فارم (اسٹال #K-04) • ریاض'
      },
      markets: {
        ar: 'سوق حي السفارات للمزارعين (الرياض)',
        en: 'Diplomatic Quarter Farmers Market (Riyadh)',
        ur: 'ڈپلومیٹک کوارٹر فارمرز مارکیٹ (ریاض)'
      },
      units: { ar: 'لتر', en: 'litre', ur: 'لیٹر' },
      badges: { ar: 'حليب الصباح', en: 'Morning Milk', ur: 'صبح کا تازہ دودھ' },
      timeLabels: { ar: 'اليوم، 05:45 صباحاً', en: 'Today, 05:45 AM', ur: 'آج، صبح 05:45 بجے' },
      descriptions: {
        ar: 'حليب أبقار طازج ونقي من مزارع الخرج الخصبة، كامل الدسم وبدون أي مواد حافظة أو هرمونات، نكهة ريفية سعودية أصيلة.',
        en: 'Rich, creamy full-fat organic cow milk from pasture-fed herds in the agricultural heartland of Al-Kharj. Bottled fresh every morning.',
        ur: 'سعودی عرب کے زرخیز خطے الخرج سے تازہ گائے کا قدرتی فل کریم دودھ۔'
      }
    },
    {
      id: 303,
      category: 'fruits',
      price: 32,
      oldPrice: 38,
      stockQuantity: 35,
      farmerId: 'sa-3',
      harvestHoursAgo: 6,
      image: 'https://images.unsplash.com/photo-1541344999736-83eca872f242?auto=format&fit=crop&w=600&q=80',
      names: {
        ar: 'رمان الطائف الجبلي السكري الفاخر',
        en: 'Taif Mountain Sweet Pomegranates',
        ur: 'طائف کے پہاڑوں کا میٹھا انار'
      },
      farmers: {
        ar: 'بساتين مرتفعات الطائف (كشك #T-02) • الطائف',
        en: 'Taif Highland Orchards (Stall #T-02) • Taif',
        ur: 'طائف ہائی لینڈز آرچرڈ (اسٹال #T-02) • طائف'
      },
      markets: {
        ar: 'سوق البلد للخضار والفاكهة العضوية (جدة)',
        en: 'Al-Balad Organic Produce Souq (Jeddah)',
        ur: 'البلد آرگینک مارکیٹ (جدہ)'
      },
      units: { ar: 'كغ', en: 'kg', ur: 'کلو' },
      badges: { ar: 'رمان جبلي', en: 'Mountain Sweet', ur: 'پہاڑی میٹھا' },
      timeLabels: { ar: 'اليوم، 06:15 صباحاً', en: 'Today, 06:15 AM', ur: 'آج، صبح 06:15 بجے' },
      descriptions: {
        ar: 'رمان طائفي حلو المذاق ذو حبات حمراء ياقوتية مروية بمياه أمطار جبال الطائف العذبة، غني بمضادات الأكسدة وممتاز للعصير الطازج.',
        en: 'Prized sweet mountain pomegranates from the cooler slopes of Taif. Plump ruby-red arils bursting with sweet, refreshing juice.',
        ur: 'طائف کی سرد پہاڑیوں سے میٹھے لال دانوں والے تازہ ترین انار۔'
      }
    },
    {
      id: 304,
      category: 'bakery',
      price: 25,
      oldPrice: 30,
      stockQuantity: 80,
      farmerId: 'sa-4',
      harvestHoursAgo: 48,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      names: {
        ar: 'دقيق قمح القصيم الأسمر البلدي العضوي',
        en: 'Qassim Stone-Ground Whole Wheat Flour',
        ur: 'القصیم کا خالص دیسی گندم کا آٹا'
      },
      farmers: {
        ar: 'مزارع سنابل القصيم (كشك #Q-07) • القصيم',
        en: 'Qassim Heritage Grain Farms (Stall #Q-07) • Qassim',
        ur: 'قصیم ہیرٹیج گرین فارمز (اسٹال #Q-07) • القصیم'
      },
      markets: {
        ar: 'سوق الشاطئ الأسبوعي للمزارعين (الدمام)',
        en: 'Al-Shati Coastal Farmers Market (Dammam)',
        ur: 'الشاطی کوسٹل فارمرز مارکیٹ (دمام)'
      },
      units: { ar: 'كيس (5 كغ)', en: 'bag (5kg)', ur: 'تھیلا (5 کلو)' },
      badges: { ar: 'مطحون بالحجر', en: 'Stone Milled', ur: 'چکی کا آٹا' },
      timeLabels: { ar: 'طحن طازج', en: 'Freshly Milled', ur: 'تازہ پسا ہوا' },
      descriptions: {
        ar: 'قمح عضوي كامل تمت زراعته في مزارع القصيم المشهورة وتم طحنه على الرحى الحجرية الباردة للمحافظة على كامل نخالته وفيتاميناته الطبيعية.',
        en: 'Traditional stone-ground whole wheat flour milled from non-GMO heritage wheat grown under the hot Qassim sun. Excellent for artisan flatbreads.',
        ur: 'سعودی خطے القصیم کی بہترین گندم سے روایتی چکی پر پسا ہوا غذائیت سے بھرپور آٹا۔'
      }
    },
    {
      id: 305,
      category: 'vegetables',
      price: 8,
      oldPrice: 11,
      stockQuantity: 65,
      farmerId: 'sa-5',
      harvestHoursAgo: 4,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
      names: {
        ar: 'بطاطس حائل العضوية الطازجة',
        en: 'Hail Valley Organic Golden Potatoes',
        ur: 'حائل کی تازہ سنہری نامیاتی آلو'
      },
      farmers: {
        ar: 'مزارع سهول حائل (كشك #H-05) • حائل',
        en: 'Hail Agricultural Plains (Stall #H-05) • Hail',
        ur: 'حائل اگریکلچرل پلینز (اسٹال #H-05) • حائل'
      },
      markets: {
        ar: 'سوق المربع الموسمي العضوي (الرياض)',
        en: 'Al-Murabba Seasonal Organic Souq (Riyadh)',
        ur: 'المربع آرگینک بازار (ریاض)'
      },
      units: { ar: 'كغ', en: 'kg', ur: 'کلو' },
      badges: { ar: 'طازج من الحقل', en: 'Field Fresh', ur: 'کھیت سے تازہ' },
      timeLabels: { ar: 'اليوم، 06:00 صباحاً', en: 'Today, 06:00 AM', ur: 'آج، صبح 06:00 بجے' },
      descriptions: {
        ar: 'بطاطس ذهبية قشرتها رقيقة تم جنيها من التربة البركانية الخصبة لمنطقة حائل، قوام متماسك وطعم ترابي غني بدون أي مواد كيميائية.',
        en: 'Golden thin-skinned organic potatoes harvested fresh from mineral-rich soils in Hail. Perfect for baking, roasting, and traditional stews.',
        ur: 'حائل کی معدنیات سے بھرپور زرخیز مٹی سے کھودے گئے تازہ سنہری نامیاتی آلو۔'
      }
    },
    {
      id: 306,
      category: 'bakery',
      price: 85,
      oldPrice: 110,
      stockQuantity: 20,
      farmerId: 'sa-6',
      harvestHoursAgo: 36,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      names: {
        ar: 'عسل سدر جبال عسير البري الصافي',
        en: 'Asir Wild Mountain Raw Sidr Honey',
        ur: 'عسیر کے بلند پہاڑوں کا خالص سدر شہد'
      },
      farmers: {
        ar: 'مناحل مرتفعات السودة (كشك #A-11) • عسير',
        en: 'Al-Soodah Mountain Apiaries (Stall #A-11) • Asir',
        ur: 'السودہ ماؤنٹین فارم (اسٹال #A-11) • عسیر'
      },
      markets: {
        ar: 'سوق البلد للخضار والفاكهة العضوية (جدة)',
        en: 'Al-Balad Organic Produce Souq (Jeddah)',
        ur: 'البلد آرگینک مارکیٹ (جدہ)'
      },
      units: { ar: 'برطمان', en: 'jar (500g)', ur: 'جار (500 گرام)' },
      badges: { ar: 'عسل جبلي نادر', en: 'Rare Mountain', ur: 'نایاب پہاڑی شہد' },
      timeLabels: { ar: 'طبيعي 100%', en: '100% Raw', ur: '100% قدرتی' },
      descriptions: {
        ar: 'عسل سدر أصلي معتوق من أشجار السدر في قمم جبال عسير الضبابية، غني بالإنزيمات الحية ولون عنبري داكن وطعم فريد لا يقاوم.',
        en: 'Unpasteurized wild amber Sidr honey collected by native Arabian honeybees in the misty high-altitude peaks of Asir. Prized for its wellness benefits.',
        ur: 'سعودی عرب کے بلند ترین پہاڑوں عسیر سے حاصل کردہ خالص نایاب امبر سدر شہد۔'
      }
    }
  ],

  // ==========================================================================
  // UNITED KINGDOM (UK)
  // ==========================================================================
  GB: [
    {
      id: 401,
      category: 'fruits',
      price: 4.5, // in GBP
      oldPrice: 5.8,
      stockQuantity: 40,
      farmerId: 'gb-1',
      harvestHoursAgo: 6,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
      names: {
        en: 'Kent Orchard Crisp Bramley & Gala Apples',
        ar: 'تفاح كينت البريطاني المقرمش العضوي',
        ur: 'برطانیہ کے باغات کے تازہ کرکرے سیب'
      },
      farmers: {
        en: 'Kent Fruit Growers Collective (Stall #K-02) • Kent',
        ar: 'تعاونية مزارعي فواكه كينت (كشك #K-02) • كينت',
        ur: 'کینٹ فروٹ گرورز (اسٹال #K-02) • کینٹ'
      },
      markets: {
        en: 'Borough Market Fresh Produce Stalls (London)',
        ar: 'أكشاك سوق بورو للمنتجات الطازجة (لندن)',
        ur: 'بورو مارکیٹ فریش پروڈیوس (لندن)'
      },
      units: { en: 'kg', ar: 'كغ', ur: 'کلو' },
      badges: { en: 'Tree Picked', ar: 'مقطوف من الشجر', ur: 'درخت سے چنا ہوا' },
      timeLabels: { en: 'Today, 06:00 AM', ar: 'اليوم، 06:00 صباحاً', ur: 'آج، صبح 06:00 بجے' },
      descriptions: {
        en: 'Sweet and crisp heritage English apples plucked directly from traditional organic Kentish orchards. Free of synthetic waxes and pesticides.',
        ar: 'تفاح إنجليزي تراثي مقرمش ولذيذ مقطوف مباشرة من بساتين كينت العضوية العريقة بدون أي مواد شمعية أو مبيدات.',
        ur: 'برطانیہ کے روایتی نامیاتی باغات سے بغیر کسی کیمیکل یا مومی پالش کے چنے ہوئے تازہ سیب۔'
      }
    },
    {
      id: 402,
      category: 'dairy',
      price: 6.2,
      oldPrice: 7.5,
      stockQuantity: 25,
      farmerId: 'gb-2',
      harvestHoursAgo: 24,
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
      names: {
        en: 'Somerset Traditional Raw Farmhouse Cheddar',
        ar: 'جبن شيدر سومرسيت الريفي التقليدي',
        ur: 'سومرسیٹ روایتی فارم ہاؤس چیڈر چیز'
      },
      farmers: {
        en: 'Somerset Pasture Creamery (Stall #S-08) • Somerset',
        ar: 'ألبان مراعي سومرسيت (كشك #S-08) • سومرسيت',
        ur: 'سومرسیٹ پاسچر کریمری (اسٹال #S-08)'
      },
      markets: {
        en: 'Marylebone Weekly Farmers Market (London)',
        ar: 'سوق ماريليبون الأسبوعي للمزارعين (لندن)',
        ur: 'میریلیبون فارمرز مارکیٹ (لندن)'
      },
      units: { en: 'block (400g)', ar: 'قطعة (400غ)', ur: 'بلاؤک (400 گرام)' },
      badges: { en: 'Artisan Raw', ar: 'حرفي تقليدي', ur: 'آرٹیسن چیز' },
      timeLabels: { en: 'Aged 12 Months', ar: 'معتق 12 شهراً', ur: '12 ماہ پرانی' },
      descriptions: {
        en: 'Handcrafted clothbound farmhouse cheddar made with raw unpasteurized milk from grass-fed cows grazing lush Somerset pastures.',
        ar: 'جبن شيدر حرفي تقليدي مصنوع من حليب الأبقار الطازج التي ترعى في مروج سومرسيت الخضراء، معتق بطرق تقليدية لنكهة غنية.',
        ur: 'سبز چراگاہوں میں چرنے والی گائے کے خالص دودھ سے روایتی طریقے سے تیار کردہ چیڈر پنیر۔'
      }
    },
    {
      id: 403,
      category: 'bakery',
      price: 3.8,
      oldPrice: 4.6,
      stockQuantity: 60,
      farmerId: 'gb-3',
      harvestHoursAgo: 30,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      names: {
        en: 'Scottish Highlands Stone-Milled Organic Oats',
        ar: 'شوفان المرتفعات الاسكتلندية العضوي المطحون',
        ur: 'اسکاٹش ہائی لینڈز نامیاتی جئی (اوٹس)'
      },
      farmers: {
        en: 'Highland Traditional Grain Mill (Stall #H-04) • Perthshire',
        ar: 'مطاحن الحبوب الاسكتلندية التقليدية (كشك #H-04)',
        ur: 'ہائی لینڈ ٹریڈیشنل گرین مل (اسٹال #H-04)'
      },
      markets: {
        en: 'Edinburgh Castle Terrace Farmers Market',
        ar: 'سوق إدنبرة كاسل تيراس للمزارعين',
        ur: 'ایڈنبرا کیسل ٹیرس فارمرز مارکیٹ'
      },
      units: { en: 'bag (1kg)', ar: 'كيس (1 كغ)', ur: 'تھیلا (1 کلو)' },
      badges: { en: 'Stone Ground', ar: 'طحن يدوي', ur: 'چکی کا پسا' },
      timeLabels: { en: 'Freshly Milled', ar: 'طحن حديث', ur: 'تازہ پسا ہوا' },
      descriptions: {
        en: 'Whole grain rolled Scottish jumbo oats, slowly stone-milled in the Highlands. Perfect for wholesome creamy morning porridge.',
        ar: 'شوفان اسكتلندي كامل الحبة تم طحنه ببطء على الحجارة المائية، يمنحك وجبة إفطار دافئة وغنية بالألياف الطبيعية.',
        ur: 'اسکاٹ لینڈ کے روایتی خطے میں چکی پر پسا ہوا غذائیت بخش نامیاتی دیسی دلیہ (اوٹس)۔'
      }
    },
    {
      id: 404,
      category: 'vegetables',
      price: 2.8,
      oldPrice: 3.5,
      stockQuantity: 70,
      farmerId: 'gb-4',
      harvestHoursAgo: 5,
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=600&q=80',
      names: {
        en: 'Yorkshire Soil Organic Heritage Carrots',
        ar: 'جزر يوركشاير العضوي الطازج بالتربة',
        ur: 'یارکشائر کی تازہ مٹی والی گاجریں'
      },
      farmers: {
        en: 'Yorkshire Dales Organic Farm (Stall #Y-06) • Leeds',
        ar: 'مزرعة يوركشاير ديلز العضوية (كشك #Y-06) • ليدز',
        ur: 'یارکشائر ڈیلز آرگینک فارم (اسٹال #Y-06)'
      },
      markets: {
        en: 'Levenshulme Community Market (Manchester)',
        ar: 'سوق ليفينشولم المجتمعي (مانشستر)',
        ur: 'لیونشولم کمیونٹی مارکیٹ (مانچسٹر)'
      },
      units: { en: 'bunch (1kg)', ar: 'حزمة (1 كغ)', ur: 'گڈی (1 کلو)' },
      badges: { en: 'Farm Fresh', ar: 'طازج من الحقل', ur: 'کھیت سے تازہ' },
      timeLabels: { en: 'Today, 05:30 AM', ar: 'اليوم، 05:30 صباحاً', ur: 'آج، صبح 05:30 بجے' },
      descriptions: {
        en: 'Earthy, crunchy sweet carrots with green feathery tops freshly pulled from fertile Yorkshire organic loam. Unwashed for maximum natural freshness.',
        ar: 'جزر بريطاني حلو ومقرمش تم اقتلاعه طازجاً من تربة يوركشاير الزراعية الغنية، يحتفظ برائحته ونضارته الطبيعية الكاملة.',
        ur: 'یارکشائر کے سرسبز کھیتوں سے صبح سویرے زمین سے نکالی گئی میٹھی اور کرکری گاجریں۔'
      }
    },
    {
      id: 405,
      category: 'dairy',
      price: 3.8,
      oldPrice: 4.5,
      stockQuantity: 50,
      farmerId: 'gb-5',
      harvestHoursAgo: 7,
      image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
      names: {
        en: 'Cotswolds Pastured Free-Range Brown Eggs',
        ar: 'بيض كوتسوولدز البلدي البني الطازج',
        ur: 'کوٹسوولڈز کی کھلی چراگاہوں کے تازہ دیسی انڈے'
      },
      farmers: {
        en: 'Cotswold Valley Free-Range Pastures (Stall #C-09) • Oxford',
        ar: 'مراعي كوتسوولد فالي الحرة (كشك #C-09) • أكسفورد',
        ur: 'کوٹسوولڈ فری رینج فارم (اسٹال #C-09)'
      },
      markets: {
        en: 'Borough Market Fresh Produce Stalls (London)',
        ar: 'أكشاك سوق بورو للمنتجات الطازجة (لندن)',
        ur: 'بورو مارکیٹ فریش پروڈیوس (لندن)'
      },
      units: { en: 'pack (6 eggs)', ar: 'طبق (6 بيضات)', ur: 'پیک (6 عدد)' },
      badges: { en: 'Free-Range', ar: 'مرعى حر', ur: 'کھلی چراگاہ' },
      timeLabels: { en: 'Today, 06:15 AM', ar: 'اليوم، 06:15 صباحاً', ur: 'آج، صبح 06:15 بجے' },
      descriptions: {
        en: 'Deep orange yolk eggs laid by hens roaming freely across the rolling limestone hills of the Cotswolds. Naturally nutritious and rich in taste.',
        ar: 'بيض بريطاني طازج بصفار برتقالي غني من دجاج يتجول بحرية في تلال كوتسوولدز الريفية الجميلة ويتغذى على الحبوب الطبيعية.',
        ur: 'آکسفورڈ کے سرسبز پہاڑی چراگاہوں میں کھلی فضا میں پلنے والی دیسی مرغیوں کے خالص غذائیت بخش انڈے۔'
      }
    },
    {
      id: 406,
      category: 'dairy',
      price: 2.2,
      oldPrice: 2.8,
      stockQuantity: 45,
      farmerId: 'gb-6',
      harvestHoursAgo: 4,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      names: {
        en: 'Devonshire Heritage Farm Fresh Whole Milk',
        ar: 'حليب ديفونشاير الريفي الطازج كامل الدسم',
        ur: 'ڈیون شائر کا تازہ خالص فارم دودھ'
      },
      farmers: {
        en: 'Devon Heritage Dairy Family (Stall #D-03) • Exeter',
        ar: 'ألبان ديفون التراثية العائلية (كشك #D-03) • إكستر',
        ur: 'ڈیون ہیرٹیج ڈیری (اسٹال #D-03)'
      },
      markets: {
        en: 'Marylebone Weekly Farmers Market (London)',
        ar: 'سوق ماريليبون الأسبوعي للمزارعين (لندن)',
        ur: 'میریلیبون فارمرز مارکیٹ (لندن)'
      },
      units: { en: 'bottle (1L)', ar: 'زجاجة (1 لتر)', ur: 'بوتل (1 لیٹر)' },
      badges: { en: 'Cream Top', ar: 'كامل الدسم', ur: 'بالائی والا' },
      timeLabels: { en: 'Today, 05:00 AM', ar: 'اليوم، 05:00 صباحاً', ur: 'آج، صبح 05:00 بجے' },
      descriptions: {
        en: 'Rich unhomogenized farm milk with a thick layer of natural cream on top, sourced from Channel Island cows grazing seaside Devon meadows.',
        ar: 'حليب مزارع طبيعي تعلوه طبقة سميكة من القشطة الطبيعية، من أبقار تتغذى على مروج ديفونشاير البحرية الخضراء.',
        ur: 'برطانیہ کے ساحلی خطے ڈیون کے سرسبز سبزہ زاروں سے حاصل کردہ گاڑھی بالائی والا خالص گائے کا دودھ۔'
      }
    }
  ],

  // ==========================================================================
  // UNITED STATES (USA)
  // ==========================================================================
  US: [
    {
      id: 501,
      category: 'fruits',
      price: 5.5, // in USD
      oldPrice: 7.0,
      stockQuantity: 50,
      farmerId: 'us-1',
      harvestHoursAgo: 5,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
      names: {
        en: 'California Hass Tree-Ripened Organic Avocados',
        ar: 'أفوكادو كاليفورنيا هاس العضوي الطازج',
        ur: 'کیلیفورنیا کے تازہ نامیاتی ایوکاڈو'
      },
      farmers: {
        en: 'Ventura Coastal Organic Groves (Stall #V-01) • Ventura, CA',
        ar: 'بساتين فينتورا الساحلية العضوية (كشك #V-01) • كاليفورنيا',
        ur: 'وینٹورا کوسٹل آرچرڈز (اسٹال #V-01) • کیلیفورنیا'
      },
      markets: {
        en: 'Santa Monica Organic Farmers Market (Los Angeles)',
        ar: 'سوق سانتا مونيكا العضوي للمزارعين (لوس أنجلوس)',
        ur: 'سانتا مونیکا فارمرز مارکیٹ (لاس اینجلس)'
      },
      units: { en: 'bag (3 pcs)', ar: 'كيس (3 حبات)', ur: 'پیک (3 عدد)' },
      badges: { en: 'Tree Ripened', ar: 'ناضج على الشجر', ur: 'درخت پر پکا' },
      timeLabels: { en: 'Today, 06:00 AM', ar: 'اليوم، 06:00 صباحاً', ur: 'آج، صبح 06:00 بجے' },
      descriptions: {
        en: 'Rich, buttery organic Hass avocados bathed in California coastal sunshine. Perfectly cream-textured and nutrient-dense.',
        ar: 'أفوكادو كاليفورنيا هاس الشهير بقوامه الكريمي ونكهته الغنية بالدهون الصحية غير المشبعة، مروي بالمياه النقية تحت شمس كاليفورنيا.',
        ur: 'کیلیفورنیا کے ساحلی باغات سے مکھن جیسے ملائم اور غذائیت سے بھرپور تازہ نامیاتی ایوکاڈو۔'
      }
    },
    {
      id: 502,
      category: 'fruits',
      price: 4.8,
      oldPrice: 6.0,
      stockQuantity: 45,
      farmerId: 'us-2',
      harvestHoursAgo: 8,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
      names: {
        en: 'Washington Crisp Honeycrisp Organic Apples',
        ar: 'تفاح واشنطن هاني كريسب العضوي الفاخر',
        ur: 'واشنگٹن کے میٹھے ہنی کرسپ سیب'
      },
      farmers: {
        en: 'Yakima Valley Mountain Orchards (Stall #Y-08) • Yakima, WA',
        ar: 'بساتين وادي ياكيما الجبلية (كشك #Y-08) • واشنطن',
        ur: 'یاکیما ویلی آرچرڈز (اسٹال #Y-08) • واشنگٹن'
      },
      markets: {
        en: 'Union Square Greenmarket (New York City)',
        ar: 'سوق يونيون سكوير الأخضر (نيويورك)',
        ur: 'یونین اسکوائر گرین مارکیٹ (نیویارک)'
      },
      units: { en: 'kg', ar: 'كغ', ur: 'کلو' },
      badges: { en: 'Super Crisp', ar: 'فائق القرمشة', ur: 'انتہائی کرکرا' },
      timeLabels: { en: 'Today, 05:00 AM', ar: 'اليوم، 05:00 صباحاً', ur: 'آج، صبح 05:00 بجے' },
      descriptions: {
        en: 'Unrivaled crunch with explosive sweet-tart juice. Hand-picked from mineral-rich volcanic soil along the Yakima River in Washington State.',
        ar: 'تفاح واشنطن هاني كريسب فائق القرمشة بطعم سكري متوازن وعصير وفير، مقطوف يدوياً من وادي ياكيما الخصيب بدون أي مواد تلميع.',
        ur: 'واشنگٹن اسٹیٹ کے مشہور وادی یاکیما سے چنے ہوئے رس دار، کرکرے اور انتہائی میٹھے نامیاتی سیب۔'
      }
    },
    {
      id: 503,
      category: 'dairy',
      price: 7.5,
      oldPrice: 9.0,
      stockQuantity: 30,
      farmerId: 'us-3',
      harvestHoursAgo: 24,
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
      names: {
        en: 'Wisconsin Grass-Fed Aged Artisan Sharp Cheddar',
        ar: 'جبن شيدر ويسكونسن الحرفي المعتق',
        ur: 'وسکونسن کا روایتی آرٹیسن شارپ چیڈر پنیر'
      },
      farmers: {
        en: 'Green County Heritage Pasture Dairies (Stall #G-04) • Monroe, WI',
        ar: 'ألبان مقاطعة غرين الريفية (كشك #G-04) • ويسكونسن',
        ur: 'گرین کاؤنٹی ڈیری (اسٹال #G-04) • وسکونسن'
      },
      markets: {
        en: 'Green City Market - Lincoln Park (Chicago)',
        ar: 'سوق المدينة الخضراء - لينكون بارك (شيكاگو)',
        ur: 'گرین سٹی مارکیٹ - لنکن پارک (شکاگو)'
      },
      units: { en: 'block (350g)', ar: 'قطعة (350غ)', ur: 'بلاؤک (350 گرام)' },
      badges: { en: 'Award Winner', ar: 'حائز جوائز', ur: 'ایوارڈ یافتہ' },
      timeLabels: { en: 'Aged 18 Months', ar: 'معتق 18 شهراً', ur: '18 ماہ پرانی' },
      descriptions: {
        en: 'Sharp, complex, crumbly Wisconsin cheese handcrafted in copper vats from pasture-raised Holstein cow milk.',
        ar: 'جبن شيدر أمريكي عريق من ولاية ويسكونسن المشهورة بالألبان، مصنوع يدوياً في أواني نحاسية ومعتق بعناية ليمنحك طعماً لا ينسى.',
        ur: 'امریکہ کی مشہور ڈیری ریاست وسکونسن سے کاپر کے برتنوں میں تیار کردہ خالص چیڈر پنیر۔'
      }
    },
    {
      id: 504,
      category: 'vegetables',
      price: 6.0,
      oldPrice: 7.5,
      stockQuantity: 55,
      farmerId: 'us-4',
      harvestHoursAgo: 4,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      names: {
        en: 'Hudson Valley Heirloom Multi-Color Tomatoes',
        ar: 'طماطم وادي هدسون التراثية الملونة العضوية',
        ur: 'ہڈسن ویلی کے رنگ برنگے روایتی نامیاتی ٹماٹر'
      },
      farmers: {
        en: 'Hudson River Organic Family Growers (Stall #H-03) • New York',
        ar: 'مزارع عائلة وادي هدسون العضوية (كشك #H-03) • نيويورك',
        ur: 'ہڈسن ریور آرگینک فارم (اسٹال #H-03) • نیویارک'
      },
      markets: {
        en: 'Union Square Greenmarket (New York City)',
        ar: 'سوق يونيون سكوير الأخضر (نيويورك)',
        ur: 'یونین اسکوائر گرین مارکیٹ (نیویارک)'
      },
      units: { en: 'kg', ar: 'كغ', ur: 'کلو' },
      badges: { en: 'Heirloom', ar: 'سلالة تراثية', ur: 'ہیر لوم' },
      timeLabels: { en: 'Today, 05:45 AM', ar: 'اليوم، 05:45 صباحاً', ur: 'آج، صبح 05:45 بجے' },
      descriptions: {
        en: 'Bursting with complex natural sugars and deep tomato acidity. Grown without synthetic sprays on fertile black soil near the Hudson River.',
        ar: 'طماطم تراثية ملونة بنكهة طماطم أصلية عميقة ولذيذة، تمت زراعتها على ضفاف نهر هدسون بنيويورك بدون أي رشاشات كيميائية.',
        ur: 'نیویارک کے ہڈسن ریور کی زرخیز مٹی سے اگائے گئے رنگ برنگے نامیاتی رسیلے ٹماٹر۔'
      }
    },
    {
      id: 505,
      category: 'fruits',
      price: 4.2,
      oldPrice: 5.5,
      stockQuantity: 65,
      farmerId: 'us-5',
      harvestHoursAgo: 10,
      image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
      names: {
        en: 'Florida Indian River Sun-Ripened Sweet Oranges',
        ar: 'برتقال فلوريدا إنديان ريفر السكري العصيري',
        ur: 'فلوریڈا کے رس بھرے میٹھے مالٹے'
      },
      farmers: {
        en: 'Indian River Citrus Groves (Stall #I-05) • Vero Beach, FL',
        ar: 'بساتين إنديان ريفر للحمضيات (كشك #I-05) • فلوريدا',
        ur: 'انڈین ریور سٹرس گرووز (اسٹال #I-05) • فلوریڈا'
      },
      markets: {
        en: 'Grand Army Plaza Greenmarket (Brooklyn, NYC)',
        ar: 'سوق غراند أرمي بلازا الأخضر (بروكلين، نيويورك)',
        ur: 'گرینڈ آرمی پلازہ گرین مارکیٹ (نیویارک)'
      },
      units: { en: 'bag (2kg)', ar: 'كيس (2 كغ)', ur: 'تھیلا (2 کلو)' },
      badges: { en: 'Sweet & Juicy', ar: 'حلو وعصيري', ur: 'رس بھرا' },
      timeLabels: { en: 'Freshly Picked', ar: 'مقطوف طازجاً', ur: 'تازہ چنا ہوا' },
      descriptions: {
        en: 'Plump, thin-skinned sweet oranges heavy with refreshing vitamin-C juice. Naturally tree-ripened under warm subtropical Florida sunshine.',
        ar: 'برتقال فلوريدا الشهير برائحته المنعشة وعصيره الوفير، نضج تحت أشعة شمس فلوريدا الدافئة وغني بفيتامين C الطبيعي.',
        ur: 'فلوریڈا کی سنہری دھوپ میں قدرتی طور پر پکے ہوئے رسیلے اور وٹامن سی سے بھرپور میٹھے مالٹے۔'
      }
    },
    {
      id: 506,
      category: 'bakery',
      price: 11.5,
      oldPrice: 14.0,
      stockQuantity: 30,
      farmerId: 'us-6',
      harvestHoursAgo: 72,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      names: {
        en: 'Vermont Pure Grade A Amber Rich Maple Syrup',
        ar: 'شراب القيقب العضوي النقي من فيرمونت',
        ur: 'ورمونٹ کا خالص قدرتی میپل سیرپ'
      },
      farmers: {
        en: 'Green Mountain Sugarhouse (Stall #G-12) • Ludlow, VT',
        ar: 'معاصر غابات غرين ماونتن (كشك #G-12) • فيرمونت',
        ur: 'گرین ماؤنٹین شوگر ہاؤس (اسٹال #G-12) • ورمونٹ'
      },
      markets: {
        en: 'Union Square Greenmarket (New York City)',
        ar: 'سوق يونيون سكوير الأخضر (نيويورك)',
        ur: 'یونین اسکوائر گرین مارکیٹ (نیویارک)'
      },
      units: { en: 'bottle (500ml)', ar: 'زجاجة (500 مل)', ur: 'بوتل (500 ملی لیٹر)' },
      badges: { en: '100% Pure', ar: 'نقي 100%', ur: '100% خالص' },
      timeLabels: { en: 'Small Batch', ar: 'دفعة صغيرة', ur: 'سمال بیچ' },
      descriptions: {
        en: 'Wood-fired organic pure maple syrup tapped from sugar maple trees in the pristine mountain forests of Vermont. No corn syrup or additives.',
        ar: 'شراب قيقب نقي 100% مستخلص من أشجار القيقب في غابات فيرمونت البكر وتم غليه على الحطب التقليدي لنكهة كرملية غنية.',
        ur: 'ورمونٹ کے قدرتی جنگلات کے میپل درختوں سے روایتی لکڑی کی آگ پر پکایا گیا 100 فیصد خالص میپل سیرپ۔'
      }
    }
  ],

  // ==========================================================================
  // PAKISTAN (پاکستان)
  // ==========================================================================
  PK: [
    {
      id: 101,
      category: 'fruits',
      price: 320,
      oldPrice: 380,
      stockQuantity: 65,
      farmerId: 'pk-1',
      harvestHoursAgo: 14,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
      names: {
        ur: 'ملتان کا شاہانہ میٹھا چونسہ آم',
        en: 'Multani Sweet Royal Chaunsa Mangoes',
        ar: 'مانجو شونسا ملتان الملكي الحلو'
      },
      farmers: {
        ur: 'البرکہ سٹرس اینڈ مینگو آرچرڈز (اسٹال #D-08) • ملتان',
        en: 'Al-Barakah Mango Orchards (Stall #D-08) • Multan',
        ar: 'بساتين البركة للمانجو (كشك #D-08) • ملتان'
      },
      markets: {
        ur: 'ملتان کینٹ آفیسرز فارمرز بازار (ملتان)',
        en: 'Multan Cantt Officers Farmers Bazaar (Multan)',
        ar: 'سوق ملتان الزراعي للضباط (ملتان)'
      },
      units: { ur: 'کلو', en: 'kg', ar: 'كغ' },
      badges: { ur: 'درخت پر پکا', en: 'Tree Ripened', ar: 'ناضج طبيعياً' },
      timeLabels: { ur: 'کل شام چنا ہوا', en: 'Yesterday Evening', ar: 'مساء الأمس' },
      descriptions: {
        ur: 'دنیا بھر میں مشہور خوشبودار ملتانی چونسہ آم، 100 فیصد درخت پر پکا ہوا بغیر کسی کاربائیڈ مصالحے کے۔ بے مثال مٹھاس اور عرق۔',
        en: 'World-famous aromatic Multani Chaunsa mangoes, 100% naturally tree-ripened without harmful calcium carbide chemicals. Unmatched sweetness.',
        ar: 'مانجو شونسا ملتان الشهير برائحته العطرية الفواحة وحلاوته الفائقة، نضج بشكل طبيعي بدون أي مواد كيميائية.'
      }
    },
    {
      id: 102,
      category: 'dairy',
      price: 240,
      oldPrice: 270,
      stockQuantity: 50,
      farmerId: 'pk-2',
      harvestHoursAgo: 4,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      names: {
        ur: 'اوکاڑہ فارم کا خالص نیلی راوی بھینس کا دودھ',
        en: 'Pure Nili Ravi Buffalo Milk (Khaalis Bhains)',
        ar: 'حليب جاموس نيلي رافي الطازج 100%'
      },
      farmers: {
        ur: 'الرزاق پیور ڈیری اینڈ کیٹل فارم (اسٹال #B-12) • اوکاڑہ',
        en: 'Al-Razaq Pure Dairy & Cattle Farm (Stall #B-12) • Okara',
        ar: 'مزرعة الرزاق للألبان الطبيعية (كشك #B-12) • أوكارا'
      },
      markets: {
        ur: 'ماڈل ٹاؤن سی بلاک اتوار بازار (لاہور)',
        en: 'Model Town C-Block Sunday Bazaar (Lahore)',
        ar: 'سوق موديل تاون الأحد الزراعي (لاهور)'
      },
      units: { ur: 'لیٹر', en: 'litre', ar: 'لتر' },
      badges: { ur: 'خالص بالائی والا', en: 'Full Cream', ar: 'كامل الدسم' },
      timeLabels: { ur: 'آج، صبح 04:30 بجے', en: 'Today, 04:30 AM', ar: 'اليوم، 04:30 صباحاً' },
      descriptions: {
        ur: 'اوکاڑہ کی سرسبز چراگاہوں میں روایتی چارہ کھانے والی نیلی راوی بھینس کا گاڑھا بالائی والا 100 فیصد خالص غیر ملاوٹ شدہ دودھ۔',
        en: 'Pure, thick full-cream raw buffalo milk from pasture-fed indigenous Nili Ravi livestock in Okara. Rich in natural cream and Calcium.',
        ur: 'اوکاڑہ کی سرسبز چراگاہوں سے حاصل کردہ خالص بھینس کا دودھ۔'
      }
    },
    {
      id: 103,
      category: 'vegetables',
      price: 140,
      oldPrice: 170,
      stockQuantity: 75,
      farmerId: 'pk-3',
      harvestHoursAgo: 3,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      names: {
        ur: 'قصور فارم کے تازہ دیسی لال ٹماٹر',
        en: 'Kasur Farm Fresh Vine-Ripened Red Tomatoes',
        ur: 'قصور کے تازہ دیسی لال ٹماٹر',
        ar: 'طماطم حمراء طازجة من مزارع قصور'
      },
      farmers: {
        ur: 'پنجاب گرین آرگینک فارم (اسٹال #A-04) • قصور',
        en: 'Punjab Green Organic Farm (Stall #A-04) • Kasur',
        ar: 'مزرعة خضار البنجاب العضوية (كشك #A-04)'
      },
      markets: {
        ur: 'لبرٹی سنڈے فارمرز مارکیٹ (لاہور)',
        en: 'Liberty Sunday Farmers Market (Lahore)',
        ar: 'سوق ليبرتي الأحد للمزارعين (لاهور)'
      },
      units: { ur: 'کلو', en: 'kg', ar: 'كغ' },
      badges: { ur: 'صبح کی چنائی', en: 'Morning Pluck', ar: 'قطاف الصباح' },
      timeLabels: { ur: 'آج، صبح 05:30 بجے', en: 'Today, 05:30 AM', ar: 'اليوم، 05:30 صباحاً' },
      descriptions: {
        ur: 'قصور کے نامیاتی زرخیز کھیتوں سے صبح سویرے توڑے گئے لال رسیلے دیسی ٹماٹر، کیمیکل اور کیڑے مار ادویات سے بالکل پاک۔',
        en: 'Naturally vine-ripened deep red juicy tomatoes harvested early morning from Kasur farm soil. Rich in lycopene and chemical-free.',
        ar: 'طماطم حمراء طازجة مقطوفة عند الفجر من حقول قصور الخصبة، غنية بالليكوبين وبدون أي مبيدات كيميائية.'
      }
    },
    {
      id: 104,
      category: 'bakery',
      price: 1200,
      oldPrice: 1450,
      stockQuantity: 30,
      farmerId: 'pk-4',
      harvestHoursAgo: 24,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      names: {
        ur: 'پوٹھوہار ویلی کا خالص قدرتی بیری کا شہد (سدر)',
        en: 'Pure Pothohar Valley Wild Sidr Honey (Beri)',
        ar: 'عسل سدر وادي بوثوهار الباكستاني النقي'
      },
      farmers: {
        ur: 'پوٹھوہار وائلڈ بی فارمز (اسٹال #P-03) • چکوال',
        en: 'Pothohar Wild Bee Farms (Stall #P-03) • Chakwal',
        ar: 'مناحل بوثوهار البرية (كشك #P-03) • شاكوال'
      },
      markets: {
        ur: 'ایف سکس سپر مارکیٹ فارم اسٹالز (اسلام آباد)',
        en: 'F-6 Super Market Fresh Farm Stalls (Islamabad)',
        ar: 'سوق إف-6 سوبر ماركت الزراعي (إسلام آباد)'
      },
      units: { ur: 'جار (500 گرام)', en: 'jar (500g)', ar: 'برطمان' },
      badges: { ur: '100% بیری کا شہد', en: '100% Pure Sidr', ar: 'سدر صافي' },
      timeLabels: { ur: 'تازہ کشید', en: 'Fresh Extraction', ar: 'استخلاص طازج' },
      descriptions: {
        ur: 'پوٹھوہار اور چکوال کے جنگلی بیری کے درختوں کے پھولوں سے حاصل کردہ خالص، کچا اور ان فلٹرڈ شہد۔ زبردست ذائقہ اور قدرتی شفا۔',
        en: 'Raw, unheated wild Sidr (Beri) honey harvested from native desert Jujube trees in Chakwal. Amber gold, thick and medicinal grade.',
        ar: 'عسل سدر باكستاني أصلي خام مستخلص من أشجار السدر البرية في جبال بوثوهار، غير مسخن وغني بالمعادن.'
      }
    },
    {
      id: 105,
      category: 'dairy',
      price: 360,
      oldPrice: 420,
      stockQuantity: 40,
      farmerId: 'pk-5',
      harvestHoursAgo: 6,
      image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
      names: {
        ur: 'فری رینج دیسی مرغی کے خالص انڈے',
        en: 'Free-Range Desi Farm Eggs (Asal Murghi)',
        ar: 'بيض دجاج بلدي عضوي حر المزرعة'
      },
      farmers: {
        ur: 'شیخوپورہ دیسی پولٹری فارم (اسٹال #P-09) • شیخوپورہ',
        en: 'Sheikhupura Desi Poultry (Stall #P-09) • Sheikhupura',
        ar: 'مداجن شيخوبورا للطيور البلدية (كشك #P-09)'
      },
      markets: {
        ur: 'لبرٹی سنڈے فارمرز مارکیٹ (لاہور)',
        en: 'Liberty Sunday Farmers Market (Lahore)',
        ar: 'سوق ليبرتي الأحد للمزارعين (لاهور)'
      },
      units: { ur: 'درجن (12 عدد)', en: 'dozen', ar: 'طبق (12 بيضة)' },
      badges: { ur: 'اصیل دیسی', en: 'Authentic Desi', ar: 'بلدي أصيل' },
      timeLabels: { ur: 'آج، صبح 05:00 بجے', en: 'Today, 05:00 AM', ar: 'اليوم، 05:00 صباحاً' },
      descriptions: {
        ur: 'کھلے کھیتوں میں قدرتی اناج اور گھاس پر پلنے والی دیسی مرغیوں کے خالص، تازہ اور زردی دار انڈے۔ فیڈ اور ہارمونز سے مکمل پاک۔',
        en: 'Farm-fresh organic brown eggs laid by free-roaming indigenous desi hens. Deep yellow yolks packed with natural protein and omega-3.',
        ar: 'بيض دجاج بلدي باكستاني أصيل من دجاج يرعى بحرية في الحقول المفتوحة، صفار ذهبي طبيعي بدون أي أعلاف كيميائية.'
      }
    },
    {
      id: 106,
      category: 'vegetables',
      price: 60,
      oldPrice: 80,
      stockQuantity: 50,
      farmerId: 'pk-6',
      harvestHoursAgo: 4,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
      names: {
        ur: 'ملیر ویلی کی تازہ دیسی پالک',
        en: 'Malir Valley Fresh Organic Spinach (Palak)',
        ar: 'سبانخ بلدية طازجة من وادي ملير'
      },
      farmers: {
        ur: 'ملیر ریور آرگینک ویلی (اسٹال #M-02) • کراچی',
        en: 'Malir River Organic Valley (Stall #M-02) • Karachi',
        ar: 'مزارع وادي ملير العضوية (كشك #M-02) • كراتشي'
      },
      markets: {
        ur: 'ایمپریس مارکیٹ آرگینک بازار (کراچی)',
        en: 'Empress Market Organic Bazaar (Karachi)',
        ar: 'سوق إمبريس العضوي (كراتشي)'
      },
      units: { ur: 'گڈی', en: 'bunch', ar: 'حزمة' },
      badges: { ur: 'تازہ پتے', en: 'Crisp Leaves', ar: 'أوراق طازجة' },
      timeLabels: { ur: 'آج، صبح 05:15 بجے', en: 'Today, 05:15 AM', ar: 'اليوم، 05:15 صباحاً' },
      descriptions: {
        ur: 'کراچی کے ملیر ریور فارمز سے صبح سویرے کٹی ہوئی نرم و ملائم دیسی پالک، آئرن اور فولک ایسڈ سے بھرپور، بغیر کسی زہریلے پانی کے۔',
        en: 'Tender baby spinach leaves hand-cut at sunrise in Malir agricultural farms. Washed with clean well water, rich in natural iron and vitamin A.',
        ar: 'سبانخ بلدية طازجة وطرية مقطوفة يدوياً عند شروق الشمس من مزارع وادي ملير، مغسولة بمياه الآبار العذبة وغنية بالحديد.'
      }
    }
  ]
};

/**
 * Returns localized products tailored to current country and active language.
 * Falls back seamlessly if a country or locale is missing.
 */
export function getLocalizedProducts(countryCode = 'PK', locale = 'ur') {
  const normCountry = (countryCode || 'PK').toUpperCase();
  const normLocale = (locale || 'ur').toLowerCase();

  const productList = COUNTRY_PRODUCTS[normCountry] || COUNTRY_PRODUCTS.PK;

  return productList.map((p) => {
    const name = p.names?.[normLocale] || p.names?.en || p.name;
    const farmerName = p.farmers?.[normLocale] || p.farmers?.en || p.farmerName;
    const marketName = p.markets?.[normLocale] || p.markets?.en || p.marketName;
    const unit = p.units?.[normLocale] || p.units?.en || p.unit;
    const badge = p.badges?.[normLocale] || p.badges?.en || p.badge;
    const harvestTimeLabel = p.timeLabels?.[normLocale] || p.timeLabels?.en || p.harvestTimeLabel;
    const description = p.descriptions?.[normLocale] || p.descriptions?.en || p.description;

    return {
      ...p,
      name,
      farmerName,
      marketName,
      unit,
      badge,
      harvestTimeLabel,
      description,
      countryCode: normCountry
    };
  });
}
