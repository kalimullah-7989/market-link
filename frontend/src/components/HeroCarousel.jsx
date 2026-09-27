import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { t, isRTL } = useLanguage();

  const slides = [
    {
      image: '/img/carousel-1.jpg',
      tagline: t('hero_tagline') || 'Organic Farm Direct Platform',
      badgeBg: '#F65005', // Logo orange (Link)
      titlePrimary: 'Fresh Organic ',
      titleHighlight1: 'Harvest',
      titleColor1: '#3CB815', // Logo green (Market)
      titleSecondary: ' Just A ',
      titleHighlight2: 'Click Away',
      titleColor2: '#F65005', // Logo orange (Link)
      subtitle: t('hero_subtitle') || 'Connecting local farmers with community shoppers for fresh, transparent harvest pre-orders with zero middleman markups.',
      productLink: '/products',
      marketLink: '/markets'
    },
    {
      image: '/img/carousel-2.jpg',
      tagline: t('zero_waste') || 'Zero Harvest Waste Policy',
      badgeBg: '#3CB815', // Logo green (Market)
      titlePrimary: 'Pure In-Stall ',
      titleHighlight1: 'Cash Pickup',
      titleColor1: '#F65005', // Logo orange (Link)
      titleSecondary: ' & ',
      titleHighlight2: 'Zero Waste',
      titleColor2: '#3CB815', // Logo green (Market)
      subtitle: t('hero_subtitle') || 'Strict cutoff times ensure farmers harvest only what is pre-ordered. Inspect fresh produce at the stall and pay pure cash at pickup.',
      productLink: '/products',
      marketLink: '/markets'
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  return (
    <div 
      className="container-fluid p-0 mb-5 position-relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div id="header-carousel" className="carousel slide position-relative">
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
                  maxHeight: '700px',
                  transition: 'opacity 0.6s ease-in-out'
                }}
              >
                {/* Natural, bright farm image without darkening overlay */}
                <img 
                  className="w-100" 
                  src={slide.image} 
                  alt="MarketLink Organic Harvest"
                  style={{ objectFit: 'cover', minHeight: '480px', maxHeight: '700px' }} 
                />

                <div className="carousel-caption d-flex align-items-center justify-content-center" style={{ zIndex: 2 }}>
                  <div className="container">
                    <div className={`row ${isRTL ? 'justify-content-end text-end' : 'justify-content-start text-start'}`}>
                      <div className="col-lg-9 col-xl-8">

                        <h1 
                          className="display-2 mb-4 text-white fw-bold animate__animated animate__slideInDown" 
                          style={{ 
                            textShadow: '0 3px 10px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.95)', 
                            lineHeight: 1.15 
                          }}
                        >
                          {slide.titlePrimary}
                          <span style={{ color: slide.titleColor1 }}>{slide.titleHighlight1}</span>
                          {slide.titleSecondary}
                          <span style={{ color: slide.titleColor2 }}>{slide.titleHighlight2}</span>
                        </h1>

                        <p 
                          className="fs-5 text-white mb-5 d-none d-md-block" 
                          style={{ 
                            maxWidth: '640px', 
                            color: '#FFFFFF', 
                            textShadow: '0 2px 8px rgba(0,0,0,0.95)', 
                            lineHeight: 1.6,
                            fontWeight: 500
                          }}
                        >
                          {slide.subtitle}
                        </p>

                        <div className="d-flex flex-wrap gap-3">
                          <Link 
                            to={slide.productLink} 
                            className="btn btn-primary rounded-pill py-sm-3 px-sm-5 fw-bold shadow"
                            style={{
                              backgroundColor: '#3CB815',
                              borderColor: '#3CB815',
                              transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                          >
                            <i className="fa fa-shopping-basket me-2"></i>{t('btn_browse') || 'Browse Fresh Harvest'}
                          </Link>
                          <Link 
                            to={slide.marketLink} 
                            className="btn btn-secondary rounded-pill py-sm-3 px-sm-5 fw-bold shadow"
                            style={{
                              backgroundColor: '#F65005',
                              borderColor: '#F65005',
                              transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                          >
                            <i className="fa fa-map-marker-alt me-2"></i>{t('btn_find_markets') || 'Find Local Bazaars'}
                          </Link>
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
