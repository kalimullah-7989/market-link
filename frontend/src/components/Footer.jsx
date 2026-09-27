import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t, isRTL } = useLanguage();

  return (
    <>
      <div className="container-fluid bg-dark footer mt-5 pt-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <h1 className="fw-bold text-primary mb-4">
                Market<span className="text-secondary">Link</span>
              </h1>
              <p className="text-white-50">{t('footer_tagline')}</p>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">{t('footer_address_title')}</h4>
              <p className="text-white-50"><i className="fa fa-envelope me-3 text-primary"></i>marketlink118@gmail.com</p>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">{t('footer_links_title')}</h4>
              <Link className="btn btn-link text-decoration-none" to="/about">{t('nav_about')}</Link>
              <Link className="btn btn-link text-decoration-none" to="/markets">{t('nav_markets')}</Link>
              <Link className="btn btn-link text-decoration-none" to="/products">{t('nav_products')}</Link>
              <Link className="btn btn-link text-decoration-none" to="/features">{t('nav_features')}</Link>
              <Link className="btn btn-link text-decoration-none" to="/contact">{t('nav_contact')}</Link>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-light mb-4">{t('footer_newsletter_title')}</h4>
              <p className="text-white-50">{t('footer_newsletter_desc')}</p>
              <div className="position-relative mx-auto" style={{ maxWidth: '400px' }}>
                <input 
                  className="form-control bg-transparent w-100 py-3 ps-4 pe-5 text-white border-secondary" 
                  type="email" 
                  placeholder="your.email@example.com" 
                />
                <button 
                  type="button" 
                  className={`btn btn-primary py-2 position-absolute top-0 ${isRTL ? 'start-0' : 'end-0'} mt-2 ${isRTL ? 'ms-2' : 'me-2'}`}
                >
                  {t('footer_signup_btn')}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid copyright">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0 text-white-50">
                &copy; <span className="text-white">{t('footer_copyright')}</span>
              </div>
              <div className="col-md-6 text-center text-md-end text-muted">
                All Rights Reserved. | Farm Fresh Harvest Pre-Orders
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
