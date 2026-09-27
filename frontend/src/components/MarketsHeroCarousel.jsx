import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function MarketsHeroCarousel({ onExploreClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { t, isRTL } = useLanguage();

  const slides = [
    {
      image: '/img/carousel-1.jpg',
      badge: 'OpenStreetMap Geolocation & Stalls',
      badgeBg: '#F65005', // Logo orange (Link)
      titlePart1: 'Find Local ',
      titleHighlight1: 'Bazaars',
      titleHighlightColor1: '#3CB815', // Logo green (Market)
      titlePart2: ' & ',
      titleHighlight2: 'Farmers Stalls',
      titleHighlightColor2: '#F65005', // Logo orange (Link)
      subtitle: 'Discover verified open-air weekend farmers markets across Pakistan, UAE, Saudi Arabia, UK & USA. Real-time GPS locations, active stall counts, and zero middleman markups.',
      primaryBtn: {
        text: 'Find Bazaars on Map',
        icon: 'fa-map-marked-alt',
        action: 'scroll',
        color: '#3CB815'
      },
      secondaryBtn: {
        text: 'Pre-Order Fresh Harvest',
        icon: 'fa-shopping-basket',
        to: '/products',
        color: '#F65005'
      }
    },
    {
      image: '/img/carousel-2.jpg',
      badge: 'Stall Pickup & Zero Waste',
      badgeBg: '#3CB815', // Logo green (Market)
      titlePart1: 'Weekend Harvest ',
      titleHighlight1: 'Pre-Orders',
      titleHighlightColor1: '#F65005', // Logo orange (Link)
      titlePart2: ' & ',
      titleHighlight2: 'Direct Pickup',
      titleHighlightColor2: '#3CB815', // Logo green (Market)
      subtitle: 'Farmers pack exact crates before dawn to prevent agricultural waste. Inspect freshly harvested produce directly at the stall and pay pure cash upon pickup.',
      primaryBtn: {
        text: 'Select Country & City',
        icon: 'fa-store',
        action: 'scroll',
        color: '#F65005'
      },
      secondaryBtn: {
        text: 'Pickup Pass & QR',
        icon: 'fa-qrcode',
        to: '/pickup-pass',
        color: '#3CB815'
      }
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const handleScrollClick = (e) => {
    if (e) e.preventDefault();
    if (onExploreClick) {
      onExploreClick();
    } else {
      const target = document.getElementById('bazaar-finder-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div 
      className="container-fluid p-0 mb-5 position-relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div id="markets-header-carousel" className="carousel slide position-relative">
        <div className="carousel-inner">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={index}
                className={`carousel-item ${isActive ? 'active' : ''}`}
                style={{
                  display: isActive ? 'block' : 'none',
                  position: 'relative',
                  minHeight: '480px',
                  maxHeight: '680px',
                  transition: 'opacity 0.7s ease-in-out'
                }}
              >
                {/* Natural, bright farm image without darkening overlay */}
                <img
                  className="w-100"
                  src={slide.image}
                  alt="Farmers Markets Directory"
                  style={{
                    objectFit: 'cover',
                    minHeight: '480px',
                    maxHeight: '680px'
                  }}
                />

                {/* Caption / Content */}
                <div 
                  className="carousel-caption d-flex align-items-center justify-content-center"
                  style={{ zIndex: 2 }}
                >
                  <div className="container">
                    <div className={`row ${isRTL ? 'justify-content-end text-end' : 'justify-content-start text-start'}`}>
                      <div className="col-lg-9 col-xl-8">
                        {/* Breadcrumbs inside slider with high contrast */}
                        <div className="mb-3 d-inline-flex align-items-center px-3 py-1 rounded-pill" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                          <Link to="/" className="text-white text-decoration-none small fw-semibold">
                            {t('breadcrumb_home') || 'Home'}
                          </Link>
                          <span className="text-white-50 mx-2 small">/</span>
                          <span className="text-white-50 small">{t('breadcrumb_pages') || 'Pages'}</span>
                          <span className="text-white-50 mx-2 small">/</span>
                          <span className="small fw-bold" style={{ color: '#3CB815' }}>Markets </span>
                          <span className="small fw-bold" style={{ color: '#F65005' }}>Directory</span>
                        </div>


                        {/* Title with Logo Color highlights */}
                        <h1 
                          className="display-3 mb-3 text-white fw-bold animate__animated animate__slideInDown"
                          style={{
                            textShadow: '0 3px 10px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.95)',
                            lineHeight: 1.15
                          }}
                        >
                          {slide.titlePart1}
                          <span style={{ color: slide.titleHighlightColor1 }}>{slide.titleHighlight1}</span>
                          {slide.titlePart2}
                          <span style={{ color: slide.titleHighlightColor2 }}>{slide.titleHighlight2}</span>
                        </h1>

                        {/* Subtitle */}
                        <p 
                          className="fs-5 text-white mb-4 d-none d-md-block"
                          style={{
                            maxWidth: '650px',
                            color: '#FFFFFF',
                            textShadow: '0 2px 8px rgba(0,0,0,0.95)',
                            lineHeight: 1.6,
                            fontWeight: 500
                          }}
                        >
                          {slide.subtitle}
                        </p>

                        {/* Action Buttons styled with Logo Colors */}
                        <div className="d-flex flex-wrap gap-3 align-items-center">
                          {slide.primaryBtn.action === 'scroll' ? (
                            <button
                              type="button"
                              onClick={handleScrollClick}
                              className="btn rounded-pill py-sm-3 px-sm-5 fw-bold text-white shadow"
                              style={{
                                backgroundColor: slide.primaryBtn.color,
                                borderColor: slide.primaryBtn.color,
                                transition: 'transform 0.2s, box-shadow 0.2s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                              <i className={`fa ${slide.primaryBtn.icon} me-2`}></i>
                              {slide.primaryBtn.text}
                            </button>
                          ) : (
                            <Link
                              to={slide.primaryBtn.to}
                              className="btn rounded-pill py-sm-3 px-sm-5 fw-bold text-white shadow"
                              style={{
                                backgroundColor: slide.primaryBtn.color,
                                borderColor: slide.primaryBtn.color
                              }}
                            >
                              <i className={`fa ${slide.primaryBtn.icon} me-2`}></i>
                              {slide.primaryBtn.text}
                            </Link>
                          )}

                          {slide.secondaryBtn.to ? (
                            <Link
                              to={slide.secondaryBtn.to}
                              className="btn rounded-pill py-sm-3 px-sm-5 fw-bold text-white shadow"
                              style={{
                                backgroundColor: slide.secondaryBtn.color,
                                borderColor: slide.secondaryBtn.color,
                                transition: 'transform 0.2s, box-shadow 0.2s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                              <i className={`fa ${slide.secondaryBtn.icon} me-2`}></i>
                              {slide.secondaryBtn.text}
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={handleScrollClick}
                              className="btn rounded-pill py-sm-3 px-sm-5 fw-bold text-white shadow"
                              style={{
                                backgroundColor: slide.secondaryBtn.color,
                                borderColor: slide.secondaryBtn.color
                              }}
                            >
                              <i className={`fa ${slide.secondaryBtn.icon} me-2`}></i>
                              {slide.secondaryBtn.text}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Indicators */}
        <div 
          className="carousel-indicators mb-3"
          style={{ zIndex: 3 }}
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={idx === currentSlide ? 'active' : ''}
              style={{
                width: idx === currentSlide ? '32px' : '12px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: idx === 0 ? '#3CB815' : '#F65005',
                border: 'none',
                margin: '0 4px',
                opacity: idx === currentSlide ? 1 : 0.5,
                transition: 'all 0.3s ease'
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
