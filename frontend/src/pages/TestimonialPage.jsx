import React from 'react';
import PageHeader from '../components/PageHeader';
import TestimonialsSection from '../components/TestimonialsSection';
import { useLanguage } from '../context/LanguageContext';

export default function TestimonialPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageHeader title={t('nav_reviews')} breadcrumb={t('nav_reviews')} />
      <TestimonialsSection />
    </>
  );
}

