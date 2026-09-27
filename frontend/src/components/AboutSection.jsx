import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
            <div className="about-img position-relative overflow-hidden p-5 pe-0">
              <img className="img-fluid w-100" src="/img/about.jpg" alt="About Organic Food" />
            </div>
          </div>
          <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
            <h1 className="display-5 mb-4">{t('about_heading')}</h1>
            <p className="mb-4 text-muted">
              {t('about_desc')}
            </p>
            <p><i className="fa fa-check text-primary me-3"></i>{t('about_point1')}</p>
            <p><i className="fa fa-check text-primary me-3"></i>{t('about_point2')}</p>
            <p><i className="fa fa-check text-primary me-3"></i>{t('about_point3')}</p>
            <Link className="btn btn-primary rounded-pill py-3 px-5 mt-3" to="/about">
              {t('btn_read_more')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
