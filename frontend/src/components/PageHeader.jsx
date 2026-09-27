import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function formatTitleWithLogoColors(title) {
  if (!title) return '';
  if (typeof title !== 'string') return title;

  const words = title.trim().split(/\s+/);
  if (words.length <= 1) {
    return <span style={{ color: '#3CB815' }}>{words[0]}</span>;
  }
  if (words.length === 2) {
    return (
      <>
        <span style={{ color: '#3CB815' }}>{words[0]} </span>
        <span style={{ color: '#F65005' }}>{words[1]}</span>
      </>
    );
  }
  // 3 or more words (e.g. "Fresh Produce Catalog")
  const prefix = words.slice(0, -2).join(' ');
  const greenWord = words[words.length - 2];
  const orangeWord = words[words.length - 1];

  return (
    <>
      {prefix && <span>{prefix} </span>}
      <span style={{ color: '#3CB815' }}>{greenWord} </span>
      <span style={{ color: '#F65005' }}>{orangeWord}</span>
    </>
  );
}

export default function PageHeader({ title, breadcrumb = title, badge = 'Verified Organic Platform' }) {
  const { t, isRTL } = useLanguage();

  return (
    <div className="container-fluid page-header mb-5 position-relative overflow-hidden">
      {/* Container - natural bright image background without darkening overlay */}
      <div className="container position-relative" style={{ zIndex: 2 }}>

        {/* Title with Logo Color highlights */}
        <h1 
          className="display-3 mb-3 text-white animate__animated animate__slideInDown fw-bold"
          style={{ 
            textShadow: '0 3px 10px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.95)',
            letterSpacing: '-0.5px',
            lineHeight: 1.15
          }}
        >
          {formatTitleWithLogoColors(title)}
        </h1>

        {/* Clean Glassmorphic Breadcrumbs */}
        <div 
          className="d-inline-flex align-items-center px-3 py-1 rounded-pill"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.55)', 
            backdropFilter: 'blur(4px)', 
            border: '1px solid rgba(255,255,255,0.2)' 
          }}
        >
          <Link className="text-white text-decoration-none small fw-semibold" to="/">
            {t('breadcrumb_home') || 'Home'}
          </Link>
          <span className="text-white-50 mx-2 small">/</span>
          <span className="text-white-50 small">{t('breadcrumb_pages') || 'Pages'}</span>
          <span className="text-white-50 mx-2 small">/</span>
          <span className="small fw-bold" style={{ color: '#3CB815' }}>
            {breadcrumb}
          </span>
        </div>
      </div>
    </div>
  );
}
