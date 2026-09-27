import React, { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <a
      href="#!"
      onClick={scrollToTop}
      className="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top shadow"
      style={{
        display: visible ? 'flex' : 'none',
        position: 'fixed',
        right: '30px',
        bottom: '98px',
        zIndex: 99,
        transition: 'opacity 0.4s ease'
      }}
      aria-label="Back to top"
    >
      <i className="bi bi-arrow-up"></i>
    </a>
  );
}
