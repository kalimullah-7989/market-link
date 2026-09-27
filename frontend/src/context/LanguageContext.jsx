import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SUPPORTED_COUNTRIES, TRANSLATIONS } from './translations';

export { SUPPORTED_COUNTRIES, TRANSLATIONS };

const LanguageContext = createContext(null);

const STORAGE_LOCALE_KEY = 'marketlink_locale';
const STORAGE_COUNTRY_KEY = 'marketlink_country';

export function LanguageProvider({ children }) {
  const [currentCountry, setCurrentCountry] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_COUNTRY_KEY) || 'PK';
    } catch {
      return 'PK';
    }
  });

  const [currentLocale, setCurrentLocale] = useState(() => {
    try {
      const savedLocale = localStorage.getItem(STORAGE_LOCALE_KEY);
      if (savedLocale) return savedLocale;
      const initialCountry = localStorage.getItem(STORAGE_COUNTRY_KEY) || 'PK';
      const c = SUPPORTED_COUNTRIES.find(item => item.code === initialCountry);
      return c?.defaultLocale || 'ur';
    } catch {
      return 'ur';
    }
  });

  const direction = TRANSLATIONS[currentLocale]?.direction || 'ltr';

  // Apply HTML direction and lang attribute dynamically
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = currentLocale;
    try {
      localStorage.setItem(STORAGE_LOCALE_KEY, currentLocale);
      localStorage.setItem(STORAGE_COUNTRY_KEY, currentCountry);
    } catch {
      // storage unavailable
    }
  }, [currentLocale, currentCountry, direction]);

  const changeLanguage = useCallback((locale) => {
    if (TRANSLATIONS[locale]) {
      setCurrentLocale(locale);
    }
  }, []);

  // When country switches, update country AND language immediately
  const changeCountry = useCallback((countryCode) => {
    const matched = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode);
    if (matched) {
      setCurrentCountry(matched.code);
      if (matched.defaultLocale && TRANSLATIONS[matched.defaultLocale]) {
        setCurrentLocale(matched.defaultLocale);
      }
    }
  }, []);

  // Translation lookup helper
  const t = useCallback((key) => {
    const dict = TRANSLATIONS[currentLocale] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }, [currentLocale]);

  // Dynamic currency price formatter
  const formatPrice = useCallback((amount) => {
    const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    const country = SUPPORTED_COUNTRIES.find((c) => c.code === currentCountry) || SUPPORTED_COUNTRIES[0];
    const isAr = currentLocale === 'ar';
    const isUr = currentLocale === 'ur';

    switch (country.code) {
      case 'PK': {
        const val = num < 15 ? Math.round(num * 76) : Math.round(num);
        return isUr ? `${val.toLocaleString()} روپے` : `Rs ${val.toLocaleString()}`;
      }
      case 'SA': {
        const val = num > 100 ? (num / 74).toFixed(2) : num.toFixed(2);
        return isAr ? `${val} ر.س` : `${val} SAR`;
      }
      case 'AE': {
        const val = num > 100 ? (num / 76).toFixed(2) : num.toFixed(2);
        return isAr ? `${val} د.إ` : `${val} AED`;
      }
      case 'GB': {
        const val = num > 50 ? (num / 360).toFixed(2) : num.toFixed(2);
        return `£${val}`;
      }
      case 'US':
      default: {
        const val = num > 50 ? (num / 280).toFixed(2) : num.toFixed(2);
        return `$${val}`;
      }
    }
  }, [currentCountry, currentLocale]);

  const value = {
    currentLocale,
    currentCountry,
    direction,
    isRTL: direction === 'rtl',
    supportedCountries: SUPPORTED_COUNTRIES,
    changeLanguage,
    changeCountry,
    formatPrice,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
