/**
 * MarketLink - Featured Products Section
 * Dynamic harvest showcase component
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import { productsData } from '../data/products';
import { getLocalizedProducts } from '../data/localizedProductsData';
import { productsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function ProductSection() {
  const { t, currentCountry, currentLocale } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState(() => getLocalizedProducts(currentCountry, currentLocale));
  const [loading, setLoading] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Instantly re-localize products when country or language switches
  useEffect(() => {
    setProducts(getLocalizedProducts(currentCountry, currentLocale));
  }, [currentCountry, currentLocale]);

  // Optionally supplement from Laravel backend if online and matches country
  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      try {
        const liveItems = await productsAPI.getAll();
        if (isMounted && liveItems && liveItems.length > 0) {
          // If country is PK, live items match; otherwise retain localized country catalog
          if (currentCountry === 'PK') {
            setProducts(liveItems);
          }
        }
      } catch (err) {
        // use localized products
      }
    }
    fetchProducts();
    return () => { isMounted = false; };
  }, [currentCountry]);

  // Sync WOW animations when categories switch or products load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.WOW) {
      const timer = setTimeout(() => {
        new window.WOW({
          boxClass: 'wow',
          animateClass: 'animated',
          offset: 0,
          mobile: true,
          live: true
        }).init();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab, products]);

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => {
        const cat = (p.category || '').toLowerCase();
        if (activeTab === 'vegetables') {
          return cat.includes('veg') || cat.includes('herb') || cat.includes('green');
        }
        if (activeTab === 'fruits') {
          return cat.includes('fruit') || cat.includes('citrus');
        }
        if (activeTab === 'dairy') {
          return cat.includes('dairy') || cat.includes('egg') || cat.includes('milk') || cat.includes('butter');
        }
        if (activeTab === 'bakery') {
          return cat.includes('baker') || cat.includes('honey') || cat.includes('grain');
        }
        return true;
      });

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-0 gx-5 align-items-end">
          <div className="col-lg-5">
            <div className="section-header text-start mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '500px' }}>
              <h1 className="display-5 mb-3">{t('harvest_heading')}</h1>
              <p className="text-muted">{t('harvest_desc')}</p>
            </div>
          </div>
          <div className="col-lg-7 text-start text-lg-end wow slideInRight" data-wow-delay="0.1s">
            <ul className="nav nav-pills d-inline-flex justify-content-end mb-5 flex-wrap gap-2">
              <li className="nav-item">
                <button 
                  className={`btn btn-outline-primary border-2 ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  {t('all_categories')}
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`btn btn-outline-primary border-2 ${activeTab === 'vegetables' ? 'active' : ''}`}
                  onClick={() => setActiveTab('vegetables')}
                >
                  {t('vegetables')}
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`btn btn-outline-primary border-2 ${activeTab === 'fruits' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fruits')}
                >
                  {t('fruits')}
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`btn btn-outline-primary border-2 ${activeTab === 'dairy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dairy')}
                >
                  {t('dairy')}
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`btn btn-outline-primary border-2 ${activeTab === 'bakery' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bakery')}
                >
                  Honey & Essentials
                </button>
              </li>
            </ul>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading fresh harvest...</span>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No products available in this category.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.slice(0, 6).map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                colClass="col-lg-4 col-md-6"
                delay={`${0.1 + (index % 3) * 0.15}s`} 
                onOpenDetail={(prod) => {
                  setActiveModalProduct(prod);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        <div className="col-12 text-center mt-5">
          <Link className="btn btn-primary rounded-pill py-3 px-5 text-white" to="/products">
            {t('browse_more_btn')} <i className="fa fa-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>

      <ProductDetailModal
        product={activeModalProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
