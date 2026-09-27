/**
 * MarketLink - Products Catalog Page
 * Multi-faceted filtering with dynamic produce catalog
 */

import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { useLanguage } from '../context/LanguageContext';
import { productsData } from '../data/products';
import { getLocalizedProducts } from '../data/localizedProductsData';
import { marketsData } from '../data/marketsData';
import { productsAPI, marketsAPI, categoriesAPI } from '../services/api';

export default function ProductsPage() {
  const { t, isRTL, formatPrice, currentCountry, currentLocale } = useLanguage();

  const [products, setProducts] = useState(() => getLocalizedProducts(currentCountry, currentLocale));
  const [markets, setMarkets] = useState(marketsData);
  const [loading, setLoading] = useState(false);

  // Instantly re-localize products on country or language change
  useEffect(() => {
    setProducts(getLocalizedProducts(currentCountry, currentLocale));
  }, [currentCountry, currentLocale]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMarketId, setSelectedMarketId] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('default');

  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch live catalog, markets, and categories on mount
  useEffect(() => {
    let isMounted = true;
    async function loadLiveCatalog() {
      try {
        const [liveProducts, liveMarkets] = await Promise.all([
          productsAPI.getAll(),
          marketsAPI.getAll()
        ]);
        if (isMounted) {
          if (currentCountry === 'PK' && liveProducts && liveProducts.length > 0) {
            setProducts(liveProducts);
          }
          if (liveMarkets && liveMarkets.length > 0) setMarkets(liveMarkets);
        }
      } catch (err) {
        console.warn('API error, relying on pre-seeded catalog:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLiveCatalog();
    return () => { isMounted = false; };
  }, []);

  // Category list with translations
  const categories = [
    { key: 'all', label: t('all_categories') },
    { key: 'vegetables', label: t('vegetables') },
    { key: 'fruits', label: t('fruits') },
    { key: 'dairy', label: t('dairy') },
    { key: 'bakery', label: 'Honey, Grains & Oils' }
  ];

  // Days list with translations
  const days = [
    { key: 'all', label: t('all_days') },
    { key: 'Saturday', label: t('saturday') },
    { key: 'Sunday', label: t('sunday') },
    { key: 'Wednesday', label: t('wednesday') },
    { key: 'Friday', label: t('friday') }
  ];

  // Multi-filtering logic across live products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search filter (name, farmer name, or description)
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q ||
          product.name.toLowerCase().includes(q) ||
          (product.farmerName && product.farmerName.toLowerCase().includes(q)) ||
          (product.description && product.description.toLowerCase().includes(q));

        // Category filter
        const productCat = (product.category || '').toLowerCase();
        const matchesCategory = 
          selectedCategory === 'all' || 
          (selectedCategory === 'vegetables' && (productCat.includes('veg') || productCat.includes('herb') || productCat.includes('green'))) ||
          (selectedCategory === 'fruits' && (productCat.includes('fruit') || productCat.includes('citrus'))) ||
          (selectedCategory === 'dairy' && (productCat.includes('dairy') || productCat.includes('egg') || productCat.includes('milk') || productCat.includes('butter'))) ||
          (selectedCategory === 'bakery' && (productCat.includes('baker') || productCat.includes('honey') || productCat.includes('grain') || productCat.includes('oil'))) ||
          productCat.includes(selectedCategory.toLowerCase());

        // Market filter
        const matchesMarket = 
          selectedMarketId === 'all' || 
          String(product.marketId) === String(selectedMarketId);

        // Price filter
        const matchesPrice = Number(product.price) <= maxPrice;

        // Market Day filter
        let matchesDay = true;
        if (selectedDay !== 'all') {
          const associatedMarket = markets.find((m) => String(m.id) === String(product.marketId));
          matchesDay = Boolean(
            associatedMarket?.operatingDays?.some(
              (d) => d.toLowerCase() === selectedDay.toLowerCase()
            )
          );
        }

        return matchesSearch && matchesCategory && matchesMarket && matchesPrice && matchesDay;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'stock') return b.stockQuantity - a.stockQuantity;
        return a.id - b.id;
      });
  }, [products, markets, searchQuery, selectedCategory, selectedMarketId, selectedDay, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMarketId('all');
    setSelectedDay('all');
    setMaxPrice(3000);
    setSortBy('default');
  };

  const hasActiveFilters = 
    searchQuery || 
    selectedCategory !== 'all' || 
    selectedMarketId !== 'all' || 
    selectedDay !== 'all' || 
    maxPrice < 3000;

  const handleOpenDetail = (product) => {
    setActiveModalProduct(product);
    setIsModalOpen(true);
  };

  return (
    <>
      <PageHeader title={t('products_page_title')} breadcrumb={t('products_breadcrumb')} />

      <div className="container-xxl py-5">
        <div className="container">
          {/* Header Title */}
          <div className="section-header text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
            <h1 className="display-5 mb-3">{t('products_section_title')}</h1>
            <p>{t('products_section_desc')}</p>
          </div>

          {/* Top Filter and Search Bar */}
          <div className="bg-light rounded-3 p-3 p-md-4 mb-4 shadow-sm border">
            <div className="row g-3 align-items-center">
              {/* Search Input */}
              <div className="col-lg-6 col-md-7">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="fa fa-search text-primary"></i>
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-start-0"
                    placeholder={t('search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button" 
                      onClick={() => setSearchQuery('')}
                    >
                      {t('clear_btn')}
                    </button>
                  )}
                </div>
              </div>

              {/* Items Counter */}
              <div className="col-lg-3 col-md-5 text-md-center">
                <span className="badge bg-white text-dark border px-3 py-2 rounded-pill shadow-sm">
                  {t('showing_items')} <strong>{filteredProducts.length}</strong> {t('harvest_items')}
                </span>
              </div>

              {/* Sort By Dropdown */}
              <div className={`col-lg-3 col-md-12 ${isRTL ? 'text-lg-start' : 'text-lg-end'}`}>
                <div className={`d-flex align-items-center ${isRTL ? 'justify-content-lg-start' : 'justify-content-lg-end'} gap-2`}>
                  <small className="text-muted fw-semibold text-nowrap">{t('sort_by_label')}</small>
                  <select 
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ maxWidth: '180px' }}
                  >
                    <option value="default">{t('sort_default')}</option>
                    <option value="price-low">{t('sort_price_low')}</option>
                    <option value="price-high">{t('sort_price_high')}</option>
                    <option value="stock">{t('sort_stock')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout: Filters Sidebar (3 cols) + Products Grid (9 cols) */}
          <div className="row g-4">
            {/* Filter Sidebar */}
            <div className="col-lg-3">
              <div className="bg-white rounded-3 p-4 shadow-sm border sticky-top" style={{ top: '90px' }}>
                <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                  <h6 className="fw-bold text-dark mb-0">
                    <i className="fa fa-filter text-primary me-2"></i>{t('filter_sidebar_title')}
                  </h6>
                  {hasActiveFilters && (
                    <button 
                      type="button" 
                      className="btn btn-sm btn-link text-danger p-0 text-decoration-none small"
                      onClick={handleResetFilters}
                    >
                      <i className="fa fa-redo-alt me-1"></i>{t('reset_filters_btn')}
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted small text-uppercase mb-2">
                    {t('filter_category_label')}
                  </label>
                  <div className="d-flex flex-column gap-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.key}
                        type="button"
                        className={`btn btn-sm text-start py-2 px-3 rounded-2 d-flex justify-content-between align-items-center ${selectedCategory === cat.key ? 'btn-primary text-white fw-bold' : 'btn-light text-dark'}`}
                        onClick={() => setSelectedCategory(cat.key)}
                      >
                        <span>{cat.label}</span>
                        {selectedCategory === cat.key && <i className="fa fa-check small"></i>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Farmers Market Selector */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted small text-uppercase mb-2">
                    <i className="fa fa-map-marker-alt text-primary me-1"></i> {t('filter_market_venue')}
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedMarketId}
                    onChange={(e) => setSelectedMarketId(e.target.value)}
                  >
                    <option value="all">{t('all_markets_option')}</option>
                    {markets.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                {/* Market Day Filter */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted small text-uppercase mb-2">
                    <i className="fa fa-calendar-day text-primary me-1"></i> {t('filter_operating_day')}
                  </label>
                  <div className="d-flex flex-wrap gap-1">
                    {days.map((day) => (
                      <button
                        key={day.key}
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 py-1 ${selectedDay.toLowerCase() === day.key.toLowerCase() ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedDay(day.key)}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold text-muted small text-uppercase mb-0">
                      {t('filter_price_range')}
                    </label>
                    <span className="fw-bold text-primary">{formatPrice(maxPrice)}</span>
                  </div>
                  <input 
                    type="range" 
                    className="form-range" 
                    min="50" 
                    max="5000" 
                    step="50" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                  />
                  <div className="d-flex justify-content-between small text-muted">
                    <span>{formatPrice(50)}</span>
                    <span>{formatPrice(5000)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9">
              {loading ? (
                <div className="text-center py-5 bg-white rounded-3 border">
                  <div className="spinner-border text-primary mb-3" role="status"></div>
                  <div className="text-muted small">Loading live harvest from local farms...</div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="row g-4">
                  {filteredProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      delay={`${0.05 * (index % 6)}s`}
                      colClass="col-xl-4 col-md-6"
                      onOpenDetail={handleOpenDetail}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 bg-white rounded-3 shadow-sm border p-4">
                  <i className="fa fa-search fa-3x text-muted mb-3 opacity-50"></i>
                  <h4 className="fw-bold text-dark">{t('no_products_found')}</h4>
                  <p className="text-muted mb-4">{t('no_products_desc')}</p>
                  <button 
                    type="button" 
                    className="btn btn-primary rounded-pill px-4 text-white"
                    onClick={handleResetFilters}
                  >
                    <i className="fa fa-redo-alt me-2"></i>{t('clear_all_filters_btn')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
