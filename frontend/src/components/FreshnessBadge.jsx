import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function FreshnessBadge({ hoursAgo, fallbackBadge = 'Fresh', compact = false }) {
  const { t, isRTL } = useLanguage();

  if (hoursAgo === undefined || hoursAgo === null) {
    return (
      <span className="badge bg-secondary text-white rounded-pill px-2 py-1 shadow-sm">
        {fallbackBadge}
      </span>
    );
  }

  // Tier 1: Morning Pluck / Harvested Today (<= 6 hours)
  if (hoursAgo <= 6) {
    return (
      <span 
        className="badge bg-success text-white rounded-pill px-2 py-1 d-inline-flex align-items-center gap-1 shadow-sm"
        style={{ fontSize: compact ? '0.68rem' : '0.75rem', fontWeight: 600, letterSpacing: '0.2px' }}
        title={`${hoursAgo} ${t('fresh_hours_ago')}`}
      >
        <span 
          className="d-inline-block rounded-circle bg-white"
          style={{ width: '6px', height: '6px', animation: 'pulseDot 1.5s infinite ease-in-out' }}
        ></span>
        <i className="fa fa-leaf" style={{ fontSize: '9px' }}></i>
        <span>{t('fresh_harvested_today')}</span>
        <span className="opacity-75" style={{ fontSize: '0.65rem' }}>({hoursAgo}h)</span>
      </span>
    );
  }

  // Tier 2: Field Fresh (Yesterday / <= 24 hours)
  if (hoursAgo <= 24) {
    return (
      <span 
        className="badge bg-primary text-white rounded-pill px-2 py-1 d-inline-flex align-items-center gap-1 shadow-sm"
        style={{ fontSize: compact ? '0.68rem' : '0.75rem', fontWeight: 600 }}
        title={`${hoursAgo} ${t('fresh_hours_ago')}`}
      >
        <i className="fa fa-seedling" style={{ fontSize: '9px' }}></i>
        <span>{t('fresh_field_fresh')}</span>
        <span className="opacity-75" style={{ fontSize: '0.65rem' }}>({hoursAgo}h)</span>
      </span>
    );
  }

  // Tier 3: Batch Fresh (> 24 hours)
  return (
    <span 
      className="badge bg-light text-dark border rounded-pill px-2 py-1 d-inline-flex align-items-center gap-1 shadow-sm"
      style={{ fontSize: compact ? '0.68rem' : '0.75rem', fontWeight: 600 }}
      title={`${hoursAgo} ${t('fresh_hours_ago')}`}
    >
      <i className="fa fa-shopping-basket text-muted" style={{ fontSize: '9px' }}></i>
      <span>{t('fresh_batch_fresh')}</span>
    </span>
  );
}
