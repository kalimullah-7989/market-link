import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: '/img/icon-1.png',
      title: t('feat_proc_title'),
      desc: t('feat_proc_desc')
    },
    {
      icon: '/img/icon-2.png',
      title: t('feat_org_title'),
      desc: t('feat_org_desc')
    },
    {
      icon: '/img/icon-3.png',
      title: t('feat_safe_title'),
      desc: t('feat_safe_desc')
    }
  ];

  return (
    <div className="container-fluid bg-light bg-icon my-5 py-6">
      <div className="container">
        <div className="section-header text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <h1 className="display-5 mb-3">{t('features_heading')}</h1>
          <p className="text-muted">{t('features_desc')}</p>
        </div>
        <div className="row g-4">
          {features.map((feat, index) => (
            <div 
              key={index} 
              className="col-lg-4 col-md-6 wow fadeInUp" 
              data-wow-delay={`${0.1 + index * 0.2}s`}
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5 shadow-sm rounded">
                <img className="img-fluid mb-4" src={feat.icon} alt={feat.title} style={{ height: '70px' }} />
                <h4 className="mb-3">{feat.title}</h4>
                <p className="mb-4 text-muted">{feat.desc}</p>
                <Link className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill" to="/features">
                  {t('btn_read_more')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
