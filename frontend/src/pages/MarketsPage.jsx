import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MarketsHeroCarousel from '../components/MarketsHeroCarousel';
import MarketsMap from '../components/MarketsMap';
import { useLanguage } from '../context/LanguageContext';
import { useCutoffTimer } from '../hooks/useCutoffTimer';
import { COUNTRIES_CONFIG, marketsData } from '../data/marketsData';
import { farmersData } from '../data/farmersData';
import { productsData } from '../data/products';
import { marketsAPI, farmersAPI, productsAPI } from '../services/api';

const COUNTRY_NAMES_MAP = {
  en: { PK: 'Pakistan', AE: 'United Arab Emirates', SA: 'Saudi Arabia', GB: 'United Kingdom', US: 'United States' },
  ur: { PK: 'پاکستان', AE: 'متحدہ عرب امارات', SA: 'سعودی عرب', GB: 'برطانیہ', US: 'امریکہ' },
  ar: { PK: 'باكستان', AE: 'الإمارات العربية المتحدة', SA: 'المملكة العربية السعودية', GB: 'المملكة المتحدة', US: 'الولايات المتحدة' }
};

const CITY_NAMES_MAP = {
  en: {
    Lahore: 'Lahore', Karachi: 'Karachi', Islamabad: 'Islamabad', Multan: 'Multan', Faisalabad: 'Faisalabad', Peshawar: 'Peshawar', Quetta: 'Quetta',
    Dubai: 'Dubai', 'Abu Dhabi': 'Abu Dhabi', Sharjah: 'Sharjah',
    Riyadh: 'Riyadh', Jeddah: 'Jeddah', Dammam: 'Dammam',
    London: 'London', Manchester: 'Manchester', Edinburgh: 'Edinburgh',
    'New York': 'New York', 'Los Angeles': 'Los Angeles', Chicago: 'Chicago'
  },
  ur: {
    Lahore: 'لاہور', Karachi: 'کراچی', Islamabad: 'اسلام آباد', Multan: 'ملتان', Faisalabad: 'فیصل آباد', Peshawar: 'پشاور', Quetta: 'کوئٹہ',
    Dubai: 'دبئی', 'Abu Dhabi': 'ابو ظہبی', Sharjah: 'شارجہ',
    Riyadh: 'ریاض', Jeddah: 'جدہ', Dammam: 'دمام',
    London: 'لندن', Manchester: 'مانچسٹر', Edinburgh: 'ایڈنبرا',
    'New York': 'نیو یارک', 'Los Angeles': 'لاس اینجلس', Chicago: 'شکاگو'
  },
  ar: {
    Lahore: 'لاهور', Karachi: 'كراتشي', Islamabad: 'إسلام آباد', Multan: 'ملتان', Faisalabad: 'فيصل آباد', Peshawar: 'بيشاور', Quetta: 'كويتا',
    Dubai: 'دبي', 'Abu Dhabi': 'أبو ظبي', Sharjah: 'الشارقة',
    Riyadh: 'الرياض', Jeddah: 'جدة', Dammam: 'الدمام',
    London: 'لندن', Manchester: 'مانشستر', Edinburgh: 'إدنبرة',
    'New York': 'نيويورك', 'Los Angeles': 'لوس أنجلوس', Chicago: 'شيكاغو'
  }
};

const UI_TEXT = {
  en: {
    geoBadge: 'OpenStreetMap Geolocation',
    title: 'Find Fresh Bazaars & Farmers Near You',
    subtitle: 'Select your Country and City below to explore open-air weekend farmers markets, stall locations, and directions.',
    country: 'Country',
    city: 'City',
    allCitiesIn: 'All Cities in',
    searchPlaceholder: 'e.g. Liberty, Empress, Corniche, Souq...',
    searchLabel: 'Search Bazaar Name',
    marketDay: 'Market Day',
    allDays: 'All Days',
    quickCities: 'Quick Cities:',
    allCities: 'All Cities',
    mapHeading: 'Interactive OpenStreetMap & Bazaar Stalls',
    showingCount: 'Showing',
    bazaarsIn: 'Bazaars in',
    activeVenue: 'Active Venue',
    days: 'Days:',
    stalls: 'Active Farm Stalls:',
    stallsSuffix: 'Stalls',
    getDirections: 'Get GPS Directions',
    browseProduce: 'Browse & Pre-Order Produce',
    exploreHeading: 'Explore All Bazaars in',
    noMarkets: 'No Bazaars found matching your criteria',
    noMarketsSub: 'Try switching the day filter or selecting another city.',
    resetFilters: 'Reset Filters',
    selected: 'Selected',
    viewOnMap: 'View on Map',
    preOrder: 'Pre-Order'
  },
  ur: {
    geoBadge: 'اوپن اسٹریٹ میپ لوکیشن',
    title: 'اپنے قریبی کسان بازار اور منڈیاں تلاش کریں',
    subtitle: 'اپنا ملک اور شہر منتخب کریں اور ہفتہ وار کھلی منڈیوں کے اسٹالز اور لائیو لوکیشنز دیکھیں۔',
    country: 'ملک',
    city: 'شہر',
    allCitiesIn: 'کے تمام شہر',
    searchPlaceholder: 'بازار تلاش کریں...',
    searchLabel: 'بازار کا نام تلاش کریں',
    marketDay: 'منڈی کا دن',
    allDays: 'تمام دن',
    quickCities: 'شہر منتخب کریں:',
    allCities: 'تمام شہر',
    mapHeading: 'انٹرایکٹو نقشہ اور کسان اسٹالز',
    showingCount: 'موجود',
    bazaarsIn: 'میں بازار',
    activeVenue: 'فعال مارکیٹ',
    days: 'کھلنے کے دن:',
    stalls: 'فعال فارم اسٹالز:',
    stallsSuffix: 'اسٹالز',
    getDirections: 'گوگل میپ رہنمائی',
    browseProduce: 'فصل دیکھیں اور پیشگی آرڈر کریں',
    exploreHeading: 'کے تمام کسان بازار',
    noMarkets: 'کوئی بازار نہیں ملا',
    noMarketsSub: 'فلٹر تبدیل کریں یا کوئی دوسرا شہر منتخب کریں۔',
    resetFilters: 'فلٹرز ری سیٹ کریں',
    selected: 'منتخب شدہ',
    viewOnMap: 'نقشے پر دیکھیں',
    preOrder: 'پیشگی آرڈر'
  },
  ar: {
    geoBadge: 'خريطة تفاعلية وموقع جغرافي',
    title: 'ابحث عن أسواق المزارعين القريبة منك',
    subtitle: 'اختر الدولة والمدينة لاستكشاف أسواق المزارعين الأسبوعية وأماكن الأكشاك ومواقعها.',
    country: 'الدولة',
    city: 'المدينة',
    allCitiesIn: 'جميع مدن',
    searchPlaceholder: 'مثال: سوق المربعة، الكورنيش، اليوبيل...',
    searchLabel: 'بحث باسم السوق',
    marketDay: 'يوم السوق',
    allDays: 'جميع الأيام',
    quickCities: 'المدن السريعة:',
    allCities: 'جميع المدن',
    mapHeading: 'خريطة تفاعلية وأكشاك السوق',
    showingCount: 'عرض',
    bazaarsIn: 'أسواق في',
    activeVenue: 'سوق نشط',
    days: 'أيام العمل:',
    stalls: 'الأكشاك الزراعية النشطة:',
    stallsSuffix: 'أكشاك',
    getDirections: 'اتجاهات الخريطة GPS',
    browseProduce: 'تصفح المحاصيل واحجز مسبقاً',
    exploreHeading: 'استكشف جميع الأسواق في',
    noMarkets: 'لم يتم العثور على أسواق مطابقة للبحث',
    noMarketsSub: 'جرّب تغيير يوم السوق أو اختيار مدينة أخرى.',
    resetFilters: 'إعادة ضبط التصفية',
    selected: 'محدد حالياً',
    viewOnMap: 'عرض على الخريطة',
    preOrder: 'حجز مسبق'
  }
};

export default function MarketsPage() {
  const { t, isRTL, currentCountry: globalCountry, currentLocale, changeCountry } = useLanguage();
  const { formattedString } = useCutoffTimer();

  const [markets, setMarkets] = useState(marketsData);
  const [farmers, setFarmers] = useState(farmersData);
  const [products, setProducts] = useState(productsData);

  // Geographic Selection State initialized from LanguageContext
  const [selectedCountryCode, setSelectedCountryCode] = useState(() => globalCountry || 'PK');
  const [selectedCity, setSelectedCity] = useState(() => {
    const initCountry = COUNTRIES_CONFIG.find((c) => c.code === (globalCountry || 'PK')) || COUNTRIES_CONFIG[0];
    return initCountry.defaultCity || initCountry.cities[0]?.name || 'Lahore';
  });

  const [dayFilter, setDayFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Map center focus
  const [focusCenter, setFocusCenter] = useState(() => {
    const initCountry = COUNTRIES_CONFIG.find((c) => c.code === (globalCountry || 'PK')) || COUNTRIES_CONFIG[0];
    const defCity = initCountry.defaultCity || initCountry.cities[0]?.name || 'Lahore';
    const cConfig = initCountry.cities.find((c) => c.name === defCity);
    return cConfig ? cConfig.coordinates : { lat: 31.5204, lng: 74.3587 };
  });
  const [focusZoom, setFocusZoom] = useState(12);
  const [selectedMarketId, setSelectedMarketId] = useState('market-lhr-1');

  // Load markets from API or fallback
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [liveMarkets, liveFarmers, liveProducts] = await Promise.all([
          marketsAPI.getAll(),
          farmersAPI.getAll(),
          productsAPI.getAll()
        ]);
        if (isMounted) {
          if (liveMarkets && liveMarkets.length > 0) {
            const enrichedLive = liveMarkets.map((m) => {
              const matchedCountry = COUNTRIES_CONFIG.find((c) =>
                c.cities.some((city) => city.name.toLowerCase() === (m.city || '').toLowerCase())
              );
              return {
                ...m,
                countryCode: m.countryCode || matchedCountry?.code || 'PK',
                country: m.country || matchedCountry?.name || 'Pakistan'
              };
            });
            // Merge so international markets from marketsData are NEVER replaced
            const merged = [...marketsData];
            enrichedLive.forEach((lm) => {
              const idx = merged.findIndex((m) => String(m.id) === String(lm.id));
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...lm };
              } else {
                merged.push(lm);
              }
            });
            setMarkets(merged);
          }
          if (liveFarmers && liveFarmers.length > 0) setFarmers(liveFarmers);
          if (liveProducts && liveProducts.length > 0) setProducts(liveProducts);
        }
      } catch (err) {
        console.warn('Using local markets data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Sync with globalCountry whenever user changes country in TopBar
  useEffect(() => {
    if (globalCountry && globalCountry !== selectedCountryCode) {
      handleCountryChange(globalCountry);
    }
  }, [globalCountry]);

  // Current active country config
  const currentCountry = useMemo(() => {
    return COUNTRIES_CONFIG.find((c) => c.code === selectedCountryCode) || COUNTRIES_CONFIG[0];
  }, [selectedCountryCode]);

  // UI dictionary for current locale
  const txt = UI_TEXT[currentLocale] || UI_TEXT.en;

  const getCountryName = (code) => {
    return COUNTRY_NAMES_MAP[currentLocale]?.[code] || COUNTRY_NAMES_MAP.en[code] || code;
  };

  const getCityName = (cityRaw) => {
    return CITY_NAMES_MAP[currentLocale]?.[cityRaw] || CITY_NAMES_MAP.en[cityRaw] || cityRaw;
  };

  // Handle Country Change
  const handleCountryChange = (countryCode) => {
    setSelectedCountryCode(countryCode);
    if (changeCountry && countryCode !== globalCountry) {
      changeCountry(countryCode);
    }
    const country = COUNTRIES_CONFIG.find((c) => c.code === countryCode) || COUNTRIES_CONFIG[0];
    const defaultCity = country.defaultCity || country.cities[0]?.name || 'all';
    setSelectedCity(defaultCity);

    const cityConfig = country.cities.find((c) => c.name === defaultCity);
    if (cityConfig) {
      setFocusCenter(cityConfig.coordinates);
      setFocusZoom(cityConfig.zoom || 12);
    }
  };

  // Handle City Change
  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);

    if (cityName === 'all') {
      const firstCity = currentCountry.cities[0];
      if (firstCity) {
        setFocusCenter(firstCity.coordinates);
        setFocusZoom(7);
      }
    } else {
      const cityConfig = currentCountry.cities.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
      if (cityConfig) {
        setFocusCenter(cityConfig.coordinates);
        setFocusZoom(cityConfig.zoom || 12);
      }
    }
  };

  // Filtered markets
  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => {
      // 1. Country match
      const matchesCountry = !selectedCountryCode || selectedCountryCode === 'all' || 
        market.countryCode === selectedCountryCode;

      // 2. City match
      const matchesCity = selectedCity === 'all' || 
        market.city?.toLowerCase() === selectedCity.toLowerCase();

      // 3. Day match
      const days = market.operatingDays || [];
      const matchesDay = dayFilter === 'all' || 
        days.some((d) => d.toLowerCase() === dayFilter.toLowerCase());

      // 4. Search query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        market.name?.toLowerCase().includes(query) ||
        market.location?.toLowerCase().includes(query) ||
        market.city?.toLowerCase().includes(query);

      return matchesCountry && matchesCity && matchesDay && matchesSearch;
    });
  }, [markets, selectedCountryCode, selectedCity, dayFilter, searchQuery]);

  // Sync selectedMarketId if current selection is filtered out
  useEffect(() => {
    if (filteredMarkets.length > 0) {
      const exists = filteredMarkets.some((m) => String(m.id) === String(selectedMarketId));
      if (!exists) {
        setSelectedMarketId(String(filteredMarkets[0].id));
      }
    }
  }, [filteredMarkets, selectedMarketId]);

  const activeMarket = filteredMarkets.find((m) => String(m.id) === String(selectedMarketId)) || filteredMarkets[0] || null;

  const dayOptions = [
    { key: 'all', label: txt.allDays },
    { key: 'Saturday', label: 'Saturday' },
    { key: 'Sunday', label: 'Sunday' },
    { key: 'Wednesday', label: 'Wednesday' },
    { key: 'Friday', label: 'Friday' }
  ];

  return (
    <>
      <MarketsHeroCarousel 
        onExploreClick={() => {
          document.getElementById('bazaar-finder-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <div className="container-xxl py-5" id="bazaar-finder-section">
        <div className="container">
          {/* Header */}
          <div className="section-header text-center mx-auto mb-4" style={{ maxWidth: '750px' }}>
            <span className="badge bg-success text-white rounded-pill px-3 py-1 mb-2 text-uppercase" style={{ fontSize: '0.75rem' }}>
              {txt.geoBadge}
            </span>
            <h1 className="display-5 mb-3">{txt.title}</h1>
            <p className="text-muted">
              {txt.subtitle}
            </p>
          </div>

          {/* Master Country & City Selection Toolbar */}
          <div className="bg-white rounded-3 p-3 p-md-4 mb-4 shadow border">
            <div className="row g-3 align-items-center">
              {/* 1. Country Dropdown */}
              <div className="col-lg-3 col-md-6">
                <label className="form-label small fw-bold text-uppercase text-secondary mb-1">
                  <i className="fa fa-globe text-primary me-1"></i> {txt.country}
                </label>
                <select 
                  className="form-select border-2 fw-semibold"
                  value={selectedCountryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  style={{ borderRadius: '8px' }}
                >
                  {COUNTRIES_CONFIG.map((c) => (
                    <option key={c.code} value={c.code}>
                      {getCountryName(c.code)} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. City Dropdown */}
              <div className="col-lg-3 col-md-6">
                <label className="form-label small fw-bold text-uppercase text-secondary mb-1">
                  <i className="fa fa-city text-primary me-1"></i> {txt.city}
                </label>
                <select 
                  className="form-select border-2 fw-semibold"
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  style={{ borderRadius: '8px' }}
                >
                  <option value="all">{txt.allCitiesIn} {getCountryName(currentCountry.code)}</option>
                  {currentCountry.cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {getCityName(city.name)}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Search Bar */}
              <div className="col-lg-3 col-md-6">
                <label className="form-label small fw-bold text-uppercase text-secondary mb-1">
                  <i className="fa fa-search text-primary me-1"></i> {txt.searchLabel}
                </label>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder={txt.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderRadius: isRTL ? '0 8px 8px 0' : '8px 0 0 8px' }}
                  />
                  {searchQuery && (
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button" 
                      onClick={() => setSearchQuery('')}
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* 4. Operating Day Filter */}
              <div className="col-lg-3 col-md-6">
                <label className="form-label small fw-bold text-uppercase text-secondary mb-1">
                  <i className="fa fa-calendar-alt text-primary me-1"></i> {txt.marketDay}
                </label>
                <select 
                  className="form-select border-2"
                  value={dayFilter}
                  onChange={(e) => setDayFilter(e.target.value)}
                  style={{ borderRadius: '8px' }}
                >
                  {dayOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick City Shortcut Pills for Active Country */}
            <div className="d-flex align-items-center flex-wrap gap-2 mt-3 pt-3 border-top">
              <span className="small text-muted fw-bold text-uppercase me-2">
                <i className="fa fa-map-pin text-danger me-1"></i> {txt.quickCities}
              </span>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${selectedCity === 'all' ? 'btn-primary text-white' : 'btn-light border'}`}
                onClick={() => handleCityChange('all')}
              >
                {txt.allCities}
              </button>
              {currentCountry.cities.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1 ${selectedCity.toLowerCase() === city.name.toLowerCase() ? 'btn-success text-white' : 'btn-light border text-dark'}`}
                  onClick={() => handleCityChange(city.name)}
                >
                  {getCityName(city.name)}
                </button>
              ))}
            </div>
          </div>

          {/* Map and Active Market Overview */}
          <div className="row g-4 mb-5">
            {/* Interactive OpenStreetMap Container */}
            <div className="col-lg-8">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h5 className="fw-bold mb-0 text-dark">
                  <i className="fa fa-map-marked-alt text-success me-2"></i>
                  {txt.mapHeading}
                </h5>
                <span className="badge bg-light text-dark border px-3 py-1">
                  {txt.showingCount} <strong>{filteredMarkets.length}</strong> {txt.bazaarsIn} <strong>{selectedCity === 'all' ? getCountryName(currentCountry.code) : getCityName(selectedCity)}</strong>
                </span>
              </div>

              <MarketsMap 
                markets={filteredMarkets}
                selectedMarketId={selectedMarketId}
                onSelectMarket={(id) => setSelectedMarketId(id)}
                focusCenter={focusCenter}
                focusZoom={focusZoom}
              />
            </div>

            {/* Selected Bazaar Quick Info Card */}
            <div className="col-lg-4">
              <div className="card h-100 shadow border-0 rounded-3 overflow-hidden">
                <div className="position-relative" style={{ height: '180px', overflow: 'hidden' }}>
                  <img 
                    src={activeMarket?.image || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80'} 
                    alt={activeMarket?.name} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-success text-white rounded-pill px-3 py-1 shadow-sm">
                      <i className="fa fa-check-circle me-1"></i> {txt.activeVenue}
                    </span>
                  </div>
                  <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}>
                    <h5 className="text-white mb-0 fw-bold">{activeMarket?.name}</h5>
                    <small className="text-white-50">{getCityName(activeMarket?.city)}, {getCountryName(activeMarket?.countryCode || currentCountry.code)}</small>
                  </div>
                </div>

                <div className="card-body p-3 p-xl-4 d-flex flex-column justify-content-between">
                  <div>
                    <p className="small text-muted mb-3">
                      {activeMarket?.description}
                    </p>

                    <div className="p-3 bg-light rounded-3 mb-3 border">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fa fa-map-marker-alt text-primary me-2 fa-fw"></i>
                        <span className="small text-dark fw-semibold">{activeMarket?.location}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="fa fa-clock text-success me-2 fa-fw"></i>
                        <span className="small text-dark">{activeMarket?.timings}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="fa fa-calendar-alt text-warning me-2 fa-fw"></i>
                        <span className="small text-dark">
                          <strong>{txt.days}</strong> {(activeMarket?.operatingDays || []).join(', ')}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="fa fa-tractor text-info me-2 fa-fw"></i>
                        <span className="small text-dark">
                          <strong>{txt.stalls}</strong> {activeMarket?.activeFarmers || 15} {txt.stallsSuffix}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <a 
                      href={`https://www.google.com/maps?q=${activeMarket?.coordinates?.lat},${activeMarket?.coordinates?.lng}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn btn-outline-success rounded-pill fw-semibold py-2"
                    >
                      <i className="fa fa-directions me-2"></i> {txt.getDirections}
                    </a>
                    <Link 
                      to={`/products?market=${activeMarket?.id}`} 
                      className="btn btn-primary text-white rounded-pill fw-semibold py-2"
                    >
                      <i className="fa fa-carrot me-2"></i> {txt.browseProduce}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* List of Bazaars Grid */}
          <div className="mb-4">
            <h3 className="fw-bold mb-3">
              {txt.exploreHeading} {selectedCity === 'all' ? getCountryName(currentCountry.code) : getCityName(selectedCity)}
            </h3>

            {filteredMarkets.length === 0 ? (
              <div className="text-center py-5 bg-light rounded-3 border">
                <i className="fa fa-store-slash fa-3x text-muted mb-3"></i>
                <h5>{txt.noMarkets}</h5>
                <p className="text-muted small">{txt.noMarketsSub}</p>
                <button 
                  className="btn btn-sm btn-primary rounded-pill px-4 mt-2"
                  onClick={() => { setDayFilter('all'); setSearchQuery(''); setSelectedCity('all'); }}
                >
                  {txt.resetFilters}
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredMarkets.map((market) => {
                  const isCurrent = String(market.id) === String(selectedMarketId);
                  return (
                    <div key={market.id} className="col-lg-4 col-md-6">
                      <div className={`card h-100 shadow-sm rounded-3 border overflow-hidden transition-all ${isCurrent ? 'border-success border-2 shadow' : ''}`}>
                        <div className="position-relative" style={{ height: '160px' }}>
                          <img 
                            src={market.image || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80'} 
                            alt={market.name} 
                            className="w-100 h-100" 
                            style={{ objectFit: 'cover' }}
                          />
                          <div className="position-absolute top-0 start-0 m-2">
                            <span className="badge bg-dark bg-opacity-75 text-white rounded-pill px-3 py-1">
                              {getCityName(market.city)}
                            </span>
                          </div>
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge bg-success text-white rounded-pill px-3 py-1">
                              {market.activeFarmers || 12} {txt.stallsSuffix}
                            </span>
                          </div>
                        </div>

                        <div className="card-body p-3 d-flex flex-column justify-content-between">
                          <div>
                            <h6 className="fw-bold mb-1 text-dark">{market.name}</h6>
                            <p className="small text-muted mb-2">
                              <i className="fa fa-map-marker-alt text-primary me-1"></i> {market.location}
                            </p>
                            <div className="small text-muted mb-3">
                              <div><i className="fa fa-clock text-success me-1"></i> {market.timings}</div>
                              <div><i className="fa fa-calendar-check text-warning me-1"></i> {(market.operatingDays || []).join(', ')}</div>
                            </div>
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className={`btn btn-sm flex-fill rounded-pill ${isCurrent ? 'btn-success text-white' : 'btn-outline-primary'}`}
                              onClick={() => {
                                setSelectedMarketId(String(market.id));
                                setFocusCenter(market.coordinates);
                                setFocusZoom(14);
                                window.scrollTo({ top: 380, behavior: 'smooth' });
                              }}
                            >
                              <i className="fa fa-map-pin me-1"></i> {isCurrent ? txt.selected : txt.viewOnMap}
                            </button>
                            <Link
                              to={`/products?market=${market.id}`}
                              className="btn btn-sm btn-primary text-white rounded-pill px-3"
                              title="Pre-Order Produce from this bazaar"
                            >
                              <i className="fa fa-carrot"></i> {txt.preOrder}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
