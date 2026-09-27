import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { COMMUNITY_TESTIMONIALS } from '../data/reviewsData';

export default function TestimonialsSection() {
  const { t, currentLocale, isRTL } = useLanguage();
  const [startIndex, setStartIndex] = useState(0);

  const testimonials = COMMUNITY_TESTIMONIALS[currentLocale] || COMMUNITY_TESTIMONIALS.en;

  // Reset index when locale changes
  useEffect(() => {
    setStartIndex(0);
  }, [currentLocale]);

  const prev = () => {
    setStartIndex((prevIdx) => (prevIdx === 0 ? testimonials.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setStartIndex((prevIdx) => (prevIdx + 1) % testimonials.length);
  };

  const displayed = [
    testimonials[startIndex % testimonials.length],
    testimonials[(startIndex + 1) % testimonials.length],
    testimonials[(startIndex + 2) % testimonials.length]
  ];

  const verifiedLabel = currentLocale === 'ur' 
    ? 'تصدیق شدہ خریدار' 
    : currentLocale === 'ar' 
    ? 'متسوق موثق' 
    : 'Verified Shopper';

  return (
    <div className="container-fluid bg-light bg-icon py-6 mb-5">
      <div className="container">
        <div className="section-header text-center mx-auto mb-5" style={{ maxWidth: '640px' }}>
          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 text-uppercase fw-semibold mb-2" style={{ fontSize: '0.8rem' }}>
            <i className="fa fa-shield-alt me-1"></i> {verifiedLabel}
          </span>
          <h1 className="display-5 mb-3 fw-bold">{t('nav_reviews')}</h1>
          <p className="text-muted fs-6">{t('reviews_subtitle')}</p>
        </div>

        <div className="row g-4">
          {displayed.map((item, idx) => {
            if (!item) return null;
            const isCenterCard = idx === 1;

            return (
              <div key={idx} className="col-lg-4 col-md-6">
                <div 
                  className={`testimonial-item position-relative p-4 p-md-5 rounded-4 shadow-sm h-100 border ${
                    isCenterCard ? 'bg-primary text-white border-primary' : 'bg-white border-light'
                  }`}
                  style={{ transition: 'all 0.35s ease' }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="text-warning">
                      {[...Array(item.rating || 5)].map((_, starI) => (
                        <i key={starI} className="fa fa-star me-1" style={{ fontSize: '0.85rem' }}></i>
                      ))}
                    </div>
                    <span 
                      className={`badge rounded-pill px-2 py-1 ${
                        isCenterCard ? 'bg-white text-primary' : 'bg-light text-success border'
                      }`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      <i className="fa fa-check-circle me-1"></i> {verifiedLabel}
                    </span>
                  </div>

                  <p className={`mb-4 lh-base ${isCenterCard ? 'text-white' : 'text-dark'}`} style={{ fontSize: '0.96rem' }}>
                    "{item.text}"
                  </p>

                  <div className="d-flex align-items-center mt-auto pt-2 border-top border-opacity-10">
                    <img 
                      className="flex-shrink-0 rounded-circle shadow-sm" 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '52px', height: '52px', objectFit: 'cover' }} 
                    />
                    <div className={isRTL ? 'me-3' : 'ms-3'}>
                      <h6 className={`mb-0 fw-bold ${isCenterCard ? 'text-white' : 'text-dark'}`}>{item.name}</h6>
                      <small className={isCenterCard ? 'text-white-50' : 'text-muted'}>{item.profession}</small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
          <button 
            type="button" 
            className="btn btn-outline-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
            style={{ width: '44px', height: '44px' }}
            onClick={isRTL ? next : prev}
            aria-label="Previous testimonial"
          >
            <i className={`fa fa-arrow-${isRTL ? 'right' : 'left'}`}></i>
          </button>
          <button 
            type="button" 
            className="btn btn-outline-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
            style={{ width: '44px', height: '44px' }}
            onClick={isRTL ? prev : next}
            aria-label="Next testimonial"
          >
            <i className={`fa fa-arrow-${isRTL ? 'left' : 'right'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}
