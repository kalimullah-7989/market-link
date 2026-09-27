import React from 'react';
import PageHeader from '../components/PageHeader';
import BlogSection from '../components/BlogSection';

export default function BlogPage() {
  return (
    <>
      <PageHeader title="Blog Grid" breadcrumb="Blog Grid" />
      <BlogSection />
    </>
  );
}
