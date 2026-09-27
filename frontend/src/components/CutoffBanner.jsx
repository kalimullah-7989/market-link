import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCutoffTimer } from '../hooks/useCutoffTimer';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function CutoffBanner() {
  const { hours, minutes, seconds, isUrgent, isCritical, isExpired } = useCutoffTimer();
  const { t, isRTL } = useLanguage();
  const { setIsDrawerOpen } = useCart();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const pad = (n) => String(n).padStart(2, '0');

  // Urgency status badge styling
  let statusBadgeClass = 'bg-success text-white';
  let statusText = t('cutoff_status_open');

  if (isExpired) {
    statusBadgeClass = 'bg-secondary text-white';
    statusText = t('cutoff_status_closed');
  } else if (isCritical) {
    statusBadgeClass = 'bg-danger text-white animate__animated animate__pulse animate__infinite';
    statusText = t('cutoff_status_closing_soon');
  } else if (isUrgent) {
    statusBadgeClass = 'bg-warning text-dark';
    statusText = t('cutoff_status_closing_soon');
  }

  return (
    <aside 
      className="cutoff-countdown-bar py-1 px-3 border-bottom shadow-sm position-relative text-white"
      style={{
        background: isCritical 
          ? 'linear-gradient(90deg, #3d1414 0%, #1f0b0b 100%)' 
          : 'linear-gradient(90deg, #13381e 0%, #0d2815 100%)',
        fontSize: '0.78rem',
        zIndex: 1040,
        transition: 'all 0.3s ease'
      }}
      aria-label="Pre-Order Cutoff Announcement"
    >
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-2 py-1">
        {/* Left / Info */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className={`badge rounded-pill px-2 py-1 fw-bold ${statusBadgeClass}`} style={{ fontSize: '0.68rem' }}>
            <i className={`fa ${isExpired ? 'fa-lock' : 'fa-clock'} me-1`}></i>
            {statusText}
          </span>
          <span className="fw-semibold text-white">
            {t('cutoff_banner_title')}
          </span>
          <span className="text-white-50 d-none d-md-inline">•</span>
          <span className="text-light d-none d-md-inline opacity-90">
            {t('cutoff_urgent_alert')}
          </span>
        </div>

        {/* Center / Timer Countdown Digits */}
        <div className="d-flex align-items-center gap-1 mx-auto mx-lg-0">
          <span className="text-white-50 me-1 d-none d-sm-inline">{t('cutoff_closing_in')}:</span>
          
          <div className="d-inline-flex align-items-center gap-1">
            <span className="px-2 py-1 rounded bg-black bg-opacity-50 text-warning font-monospace fw-bold" style={{ fontSize: '0.85rem' }}>
              {pad(hours)}
            </span>
            <small className="text-white-50 me-1">{t('cutoff_hours')}</small>

            <span className="px-2 py-1 rounded bg-black bg-opacity-50 text-warning font-monospace fw-bold" style={{ fontSize: '0.85rem' }}>
              {pad(minutes)}
            </span>
            <small className="text-white-50 me-1">{t('cutoff_mins')}</small>

            <span className="px-2 py-1 rounded bg-black bg-opacity-50 text-warning font-monospace fw-bold" style={{ fontSize: '0.85rem' }}>
              {pad(seconds)}
            </span>
            <small className="text-white-50">{t('cutoff_secs')}</small>
          </div>
        </div>

        {/* Right / CTA & Dismiss */}
        <div className="d-flex align-items-center gap-2 ms-auto ms-lg-0">
          <button
            type="button"
            className="btn btn-sm btn-outline-warning rounded-pill px-3 py-0 fw-semibold d-flex align-items-center gap-1 text-decoration-none shadow-sm"
            style={{ fontSize: '0.72rem', height: '26px' }}
            onClick={() => setIsDrawerOpen(true)}
            title="Open Pre-Order Basket"
          >
            <i className="fa fa-shopping-basket"></i>
            <span>{t('cutoff_preorder_btn')}</span>
          </button>

          <button
            type="button"
            className="btn btn-sm btn-link text-white-50 p-0 text-decoration-none"
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss cutoff banner"
            title="Dismiss"
            style={{ fontSize: '14px', lineHeight: 1 }}
          >
            &times;
          </button>
        </div>
      </div>
    </aside>
  );
}
