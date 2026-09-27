<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LocalizationController extends Controller
{
    private array $countries = [
        [
            'country_code'    => 'PK',
            'country_name'    => 'Pakistan',
            'default_locale'  => 'ur',
            'language_name'   => 'Urdu',
            'direction'       => 'rtl',
            'currency_code'   => 'PKR',
            'currency_symbol' => 'Rs',
        ],
        [
            'country_code'    => 'GB',
            'country_name'    => 'United Kingdom',
            'default_locale'  => 'en',
            'language_name'   => 'English',
            'direction'       => 'ltr',
            'currency_code'   => 'GBP',
            'currency_symbol' => '£',
        ],
        [
            'country_code'    => 'US',
            'country_name'    => 'United States',
            'default_locale'  => 'en',
            'language_name'   => 'English',
            'direction'       => 'ltr',
            'currency_code'   => 'USD',
            'currency_symbol' => '$',
        ],
        [
            'country_code'    => 'SA',
            'country_name'    => 'Saudi Arabia',
            'default_locale'  => 'ar',
            'language_name'   => 'Arabic',
            'direction'       => 'rtl',
            'currency_code'   => 'SAR',
            'currency_symbol' => 'SAR',
        ],
        [
            'country_code'    => 'AE',
            'country_name'    => 'United Arab Emirates',
            'default_locale'  => 'ar',
            'language_name'   => 'Arabic',
            'direction'       => 'rtl',
            'currency_code'   => 'AED',
            'currency_symbol' => 'AED',
        ],
    ];

    public function countries()
    {
        return $this->success($this->countries, 'Supported countries and locales retrieved successfully');
    }

    public function translations(string $locale)
    {
        $supported = ['en', 'ur', 'ar'];
        $selectedLocale = in_array(strtolower($locale), $supported) ? strtolower($locale) : 'en';

        $translations = $this->loadDictionary($selectedLocale);

        return $this->success([
            'locale'       => $selectedLocale,
            'direction'    => in_array($selectedLocale, ['ur', 'ar']) ? 'rtl' : 'ltr',
            'translations' => $translations,
        ], 'Translations retrieved successfully');
    }

    public function getPreference(Request $request)
    {
        $user = $request->user();

        return $this->success([
            'preferred_country' => $user->preferred_country ?? 'PK',
            'preferred_locale'  => $user->preferred_locale ?? 'en',
        ], 'Localization preferences retrieved');
    }

    public function setPreference(Request $request)
    {
        $validated = $request->validate([
            'country_code' => 'required|string|size:2',
            'locale'       => 'required|string|in:en,ur,ar',
        ]);

        $user = $request->user();
        $user->update([
            'preferred_country' => strtoupper($validated['country_code']),
            'preferred_locale'  => strtolower($validated['locale']),
        ]);

        return $this->success([
            'preferred_country' => $user->preferred_country,
            'preferred_locale'  => $user->preferred_locale,
        ], 'Localization preference updated successfully');
    }

    private function loadDictionary(string $locale): array
    {
        $dictionaries = [
            'en' => [
                'app_title'               => 'MarketLink',
                'app_tagline'             => 'Farm Fresh Just a Click Away',
                'nav_home'                => 'Home',
                'nav_markets'             => 'Farmers Markets',
                'nav_products'            => 'Fresh Products',
                'nav_login'               => 'Login',
                'nav_register'            => 'Register',
                'nav_dashboard'           => 'Dashboard',
                'nav_logout'              => 'Logout',
                'btn_preorder'            => 'Pre-Order Now',
                'btn_add_to_cart'         => 'Add to Cart',
                'btn_search'              => 'Search',
                'search_placeholder'      => 'Search organic produce, farmers, or markets...',
                'filter_category'         => 'Category',
                'filter_market'           => 'Market',
                'filter_price'            => 'Price',
                'badge_low_stock'         => 'Low Stock Alert',
                'badge_sold_out'          => 'Sold Out',
                'badge_harvested_today'   => 'Harvested Today',
                'badge_harvested_yester'  => 'Harvested Yesterday',
                'order_cutoff_warning'    => 'Order cutoff approaching',
                'two_step_title'          => 'Two-Step Verification',
                'two_step_instruction'    => 'Enter the 6-digit code sent to your email',
                'essential_cookies_title' => 'Essential Cookies Policy',
                'essential_cookies_desc'  => 'MarketLink uses essential cookies strictly for secure authentication and order management.',
                'btn_accept_cookies'      => 'Accept Essential Cookies',
                'status_open'             => 'Open Now',
                'status_closed'           => 'Closed',
                'status_closing_soon'     => 'Closing Soon',
            ],
            'ur' => [
                'app_title'               => 'مارکیٹ لنک',
                'app_tagline'             => 'تازہ ترین زرعی پیداوار، صرف ایک کلک پر',
                'nav_home'                => 'مرکزی صفحہ',
                'nav_markets'             => 'کسان منڈیاں',
                'nav_products'            => 'تازہ پیداوار',
                'nav_login'               => 'لاگ ان',
                'nav_register'            => 'اکاؤنٹ بنائیں',
                'nav_dashboard'           => 'ڈیش بورڈ',
                'nav_logout'              => 'لاگ آؤٹ',
                'btn_preorder'            => 'پیشگی بکنگ کریں',
                'btn_add_to_cart'         => 'ٹوکری میں شامل کریں',
                'btn_search'              => 'تلاش کریں',
                'search_placeholder'      => 'تازہ سبزیاں، پھل، کسان یا منڈی تلاش کریں...',
                'filter_category'         => 'اقسام',
                'filter_market'           => 'منڈی',
                'filter_price'            => 'قیمت',
                'badge_low_stock'         => 'اسٹاک ختم ہونے کے قریب',
                'badge_sold_out'          => 'اسٹاک ختم ہو چکا ہے',
                'badge_harvested_today'   => 'آج صبح کی تازہ پیداوار',
                'badge_harvested_yester'  => 'کل کی پیداوار',
                'order_cutoff_warning'    => 'آرڈر بکنگ کا آخری وقت قریب ہے',
                'two_step_title'          => 'دو مرحلہ سیکیورٹی تصدیق',
                'two_step_instruction'    => 'اپنے ای میل پر بھیجا گیا 6 ہندسوں کا کوڈ درج کریں',
                'essential_cookies_title' => 'ضروری کوکیز پالیسی',
                'essential_cookies_desc'  => 'مارکیٹ لنک محفوظ لاگ ان اور آرڈر کے تسلسل کے لیے ضروری کوکیز استعمال کرتا ہے۔',
                'btn_accept_cookies'      => 'ضروری کوکیز قبول کریں',
                'status_open'             => 'کھلی ہے',
                'status_closed'           => 'بند ہے',
                'status_closing_soon'     => 'جلد بند ہونے والی ہے',
            ],
            'ar' => [
                'app_title'               => 'ماركت لينك',
                'app_tagline'             => 'منتجات المزرعة الطازجة بنقرة واحدة',
                'nav_home'                => 'الرئيسية',
                'nav_markets'             => 'أسواق المزارعين',
                'nav_products'            => 'المنتجات الطازجة',
                'nav_login'               => 'تسجيل الدخول',
                'nav_register'            => 'إنشاء حساب',
                'nav_dashboard'           => 'لوحة التحكم',
                'nav_logout'              => 'تسجيل الخروج',
                'btn_preorder'            => 'طلب مسبق الآن',
                'btn_add_to_cart'         => 'أضف إلى السلة',
                'btn_search'              => 'بحث',
                'search_placeholder'      => 'ابحث عن المنتجات العضوية والمزارعين والأسواق...',
                'filter_category'         => 'الفئات',
                'filter_market'           => 'السوق',
                'filter_price'            => 'السعر',
                'badge_low_stock'         => 'الكمية أوشكت على الانتهاء',
                'badge_sold_out'          => 'نفدت الكمية',
                'badge_harvested_today'   => 'محصود اليوم',
                'badge_harvested_yester'  => 'محصود الأمس',
                'order_cutoff_warning'    => 'يقترب الموعد النهائي لتأكيد الطلب',
                'two_step_title'          => 'التحقق بخطوتين',
                'two_step_instruction'    => 'أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك الإلكتروني',
                'essential_cookies_title' => 'سياسة ملفات تعريف الارتباط الأساسية',
                'essential_cookies_desc'  => 'يستخدم ماركت لينك ملفات تعريف الارتباط الأساسية للحفاظ على أمان الحساب والطلبات.',
                'btn_accept_cookies'      => 'قبول ملفات تعريف الارتباط الأساسية',
                'status_open'             => 'مفتوح الآن',
                'status_closed'           => 'مغلق',
                'status_closing_soon'     => 'يغلق قريباً',
            ],
        ];

        return $dictionaries[$locale] ?? $dictionaries['en'];
    }
}
