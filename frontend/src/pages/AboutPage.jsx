import React from 'react';
import PageHeader from '../components/PageHeader';
import AboutSection from '../components/AboutSection';
import FirmVisitBanner from '../components/FirmVisitBanner';
import FeaturesSection from '../components/FeaturesSection';

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About Us" breadcrumb="About Us" />
      <AboutSection />
      <FirmVisitBanner />
      <FeaturesSection />
    </>
  );
}
