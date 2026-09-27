import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function FirmVisitBanner() {
  const { t } = useLanguage();

  return (
    <div className="container-fluid bg-primary bg-icon mt-5 py-6">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-md-7 wow fadeIn" data-wow-delay="0.1s">
            <h1 className="display-5 text-white mb-3">{t('visit_heading')}</h1>
            <p className="text-white mb-0 opacity-90">
              {t('visit_desc')}
            </p>
          </div>
          <div className="col-md-5 text-md-end wow fadeIn" data-wow-delay="0.5s">
            <Link className="btn btn-lg btn-secondary rounded-pill py-3 px-5 shadow-sm" to="/markets">
              {t('btn_visit_now')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
