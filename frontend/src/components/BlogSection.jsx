import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function BlogSection() {
  const { t } = useLanguage();

  const blogs = [
    {
      id: 1,
      image: '/img/blog-1.jpg',
      title: t('blog_title_1'),
      author: 'Admin',
      date: '14 Sep, 2026'
    },
    {
      id: 2,
      image: '/img/blog-2.jpg',
      title: t('blog_title_2'),
      author: 'Admin',
      date: '20 Sep, 2026'
    },
    {
      id: 3,
      image: '/img/blog-3.jpg',
      title: t('blog_title_3'),
      author: 'Admin',
      date: '24 Sep, 2026'
    }
  ];

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="section-header text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <h1 className="display-5 mb-3">{t('blog_heading')}</h1>
          <p className="text-muted">{t('blog_desc')}</p>
        </div>
        <div className="row g-4">
          {blogs.map((blog, idx) => (
            <div 
              key={blog.id} 
              className="col-lg-4 col-md-6 wow fadeInUp" 
              data-wow-delay={`${0.1 + idx * 0.2}s`}
            >
              <div className="shadow-sm rounded overflow-hidden h-100 bg-white d-flex flex-column">
                <img className="img-fluid w-100" src={blog.image} alt={blog.title} style={{ height: '230px', objectFit: 'cover' }} />
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <Link className="d-block h5 lh-base mb-4 text-decoration-none text-dark flex-grow-1" to="/blog">
                    {blog.title}
                  </Link>
                  <div className="text-muted border-top pt-3 d-flex align-items-center gap-3">
                    <small><i className="fa fa-user text-primary me-2"></i>{blog.author}</small>
                    <small><i className="fa fa-calendar text-primary me-2"></i>{blog.date}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
