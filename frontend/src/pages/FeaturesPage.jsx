import React from 'react';
import PageHeader from '../components/PageHeader';
import FeaturesSection from '../components/FeaturesSection';

export default function FeaturesPage() {
  return (
    <>
      <PageHeader title="Features" breadcrumb="Features" />
      <FeaturesSection />
    </>
  );
}
