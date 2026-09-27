import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import ProductSection from '../components/ProductSection';
import FirmVisitBanner from '../components/FirmVisitBanner';
import TestimonialsSection from '../components/TestimonialsSection';
import BlogSection from '../components/BlogSection';

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <AboutSection />
      <FeaturesSection />
      <ProductSection />
      <FirmVisitBanner />
      <TestimonialsSection />
      <BlogSection />
    </>
  );
}
