import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, SUPPORTED_COUNTRIES } from '../context/LanguageContext';

export default function LanguageSelector({ compact = false }) {
  const { currentLocale, currentCountry, changeLanguage, changeCountry, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languageOptions = [
    { code: 'en', name: 'English', dir: 'LTR' },
    { code: 'ur', name: 'اردو', dir: 'RTL' },
    { code: 'ar', name: 'العربية', dir: 'RTL' }
  ];

  const activeCountry = SUPPORTED_COUNTRIES.find((c) => c.code === currentCountry) || SUPPORTED_COUNTRIES[0];
  const activeLang = languageOptions.find((l) => l.code === currentLocale) || languageOptions[0];

  return (
    <div className="position-relative d-inline-block" ref={dropdownRef}>
      <button
        type="button"
        id="country-language-switcher-btn"
        className={`btn btn-sm ${compact ? 'btn-light border' : 'btn-outline-secondary'} rounded-pill px-2 py-1 d-flex align-items-center gap-1 shadow-sm`}
        style={{ fontSize: '0.78rem' }}
        onClick={() => setIsOpen(!isOpen)}
        title="Regional Settings & Language"
        aria-expanded={isOpen}
      >
        <i className="fa fa-globe text-primary" style={{ fontSize: '11px' }}></i>
        <span className="fw-bold text-dark">{activeCountry.code}</span>
        <span className="text-muted d-none d-sm-inline">•</span>
        <span className="fw-semibold text-primary d-none d-sm-inline">{activeLang.name}</span>
        <span className="badge bg-secondary text-white ms-1 px-1" style={{ fontSize: '0.62rem' }}>
          {activeCountry.currency}
        </span>
        <i className="fa fa-angle-down ms-1" style={{ fontSize: '9px' }}></i>
      </button>

      {isOpen && (
        <div
          className={`position-absolute bg-white shadow-lg rounded-3 border p-2 ${isRTL ? 'start-0' : 'end-0'} mt-1`}
          style={{ width: '260px', zIndex: 1090, top: '100%' }}
        >
          {/* Priority: Country Switcher (Auto Language + Currency) */}
          <div className="px-2 py-1 border-bottom mb-1 bg-light rounded-2">
            <div className="d-flex align-items-center justify-content-between">
              <small className="text-dark fw-bold text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                <i className="fa fa-map-marker-alt text-primary me-1"></i> Regional Market Hub
              </small>
              <span className="badge bg-secondary text-white" style={{ fontSize: '0.55rem' }}>Region</span>
            </div>
            <small className="text-muted d-block" style={{ fontSize: '0.65rem' }}>
              Select your region & currency
            </small>
          </div>

          <div className="d-flex flex-column gap-1 mb-2">
            {SUPPORTED_COUNTRIES.map((c) => {
              const isSelected = currentCountry === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  id={`country-opt-${c.code}`}
                  className={`btn btn-sm text-start py-1 px-2 rounded-2 d-flex align-items-center justify-content-between ${
                    isSelected ? 'btn-primary text-white shadow-sm' : 'btn-light text-dark'
                  }`}
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => {
                    changeCountry(c.code);
                    setIsOpen(false);
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge ${isSelected ? 'bg-white text-primary' : 'bg-white text-dark border'} font-monospace px-1`} style={{ fontSize: '0.68rem' }}>
                      {c.code}
                    </span>
                    <span className="fw-semibold">{c.name}</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span className={`badge ${isSelected ? 'bg-white text-primary' : 'bg-light text-muted border'}`} style={{ fontSize: '0.65rem' }}>
                      {c.currency}
                    </span>
                    {isSelected && <i className="fa fa-check ms-1" style={{ fontSize: '11px' }}></i>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Secondary: Language Manual Override */}
          <div className="px-2 py-1 border-top border-bottom my-1 bg-light rounded-2">
            <small className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: '0.65rem' }}>
              <i className="fa fa-language text-secondary me-1"></i> Language Preference
            </small>
          </div>

          <div className="d-flex flex-column gap-1">
            {languageOptions.map((opt) => {
              const isSelected = currentLocale === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  id={`lang-opt-${opt.code}`}
                  className={`btn btn-sm text-start py-1 px-2 rounded d-flex align-items-center justify-content-between ${
                    isSelected ? 'bg-primary-subtle text-primary fw-bold' : 'text-muted'
                  }`}
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => {
                    changeLanguage(opt.code);
                    setIsOpen(false);
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-secondary border font-monospace px-1" style={{ fontSize: '0.62rem' }}>
                      {opt.code.toUpperCase()}
                    </span>
                    <span>{opt.name}</span>
                  </div>
                  <span className="badge bg-light text-dark border" style={{ fontSize: '0.6rem' }}>
                    {opt.dir}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
