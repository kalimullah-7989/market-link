import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import FreshnessBadge from './FreshnessBadge';
import { PRODUCT_DETAIL_REVIEWS } from '../data/reviewsData';

export default function ProductDetailModal({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [cartError, setCartError] = useState('');
  const { addToCart, setIsDrawerOpen } = useCart();
  const { t, formatPrice, currentLocale } = useLanguage();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    setCartError('');
    const res = addToCart(product, quantity);
    if (res.success) {
      onClose();
      setIsDrawerOpen(true);
    } else {
      setCartError(res.message || 'Cannot add requested quantity to basket.');
    }
  };

  const sampleReviews = PRODUCT_DETAIL_REVIEWS[currentLocale] || PRODUCT_DETAIL_REVIEWS.en;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 1070 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3 shadow-lg overflow-hidden position-relative"
        style={{ maxWidth: '820px', width: '100%', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-light">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary text-white text-uppercase rounded-pill px-3 py-1">
              {product.category}
            </span>
            <FreshnessBadge hoursAgo={product.harvestHoursAgo} fallbackBadge={product.badge} />
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>

        {/* Body (scrollable) */}
        <div className="overflow-auto p-4 flex-grow-1">
          <div className="row g-4">
            {/* Image */}
            <div className="col-md-5">
              <div className="rounded-3 overflow-hidden bg-light shadow-sm position-relative">
                <img 
                  src={product.image || '/img/product-1.jpg'} 
                  alt={product.name}
                  className="w-100"
                  style={{ height: '240px', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/img/product-1.jpg'; }}
                />
              </div>

              {/* Farm Stall Card */}
              <div className="p-3 bg-light rounded-3 mt-3 border">
                <small className="text-muted fw-semibold text-uppercase d-block mb-1">
                  <i className="fa fa-tractor text-primary me-1"></i> Harvest Origin
                </small>
                <h6 className="fw-bold mb-1 text-dark">{product.farmerName}</h6>
                <small className="text-secondary d-block mb-1">
                  <i className="fa fa-map-marker-alt text-primary me-1"></i> {product.marketName}
                </small>
                <small className="text-muted d-block">
                  <i className="fa fa-hand-holding-usd text-success me-1"></i> {t('cash_pickup_rule')}
                </small>
              </div>

              {/* Farm-to-Stall Freshness Verification Timeline */}
              <div className="p-3 bg-white rounded-3 mt-3 border shadow-sm">
                <small className="text-dark fw-bold text-uppercase d-block mb-2" style={{ fontSize: '0.72rem' }}>
                  <i className="fa fa-shield-alt text-success me-1"></i> {t('freshness_timeline_title')}
                </small>
                <div className="d-flex flex-column gap-2" style={{ fontSize: '0.74rem' }}>
                  <div className="d-flex align-items-start gap-2">
                    <span className="badge rounded-circle bg-success text-white p-1 mt-1" style={{ width: '16px', height: '16px', display: 'grid', placeItems: 'center' }}>
                      <i className="fa fa-check" style={{ fontSize: '8px' }}></i>
                    </span>
                    <div>
                      <strong className="d-block text-dark">{t('timeline_step_1')}</strong>
                      <span className="text-muted">{product.harvestTimeLabel || 'Dawn Harvest'} ({product.harvestHoursAgo || 4}h from field)</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <span className="badge rounded-circle bg-success text-white p-1 mt-1" style={{ width: '16px', height: '16px', display: 'grid', placeItems: 'center' }}>
                      <i className="fa fa-check" style={{ fontSize: '8px' }}></i>
                    </span>
                    <div>
                      <strong className="d-block text-dark">{t('timeline_step_2')}</strong>
                      <span className="text-muted">Eco crate, weight & quality checked</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <span className="badge rounded-circle bg-primary text-white p-1 mt-1" style={{ width: '16px', height: '16px', display: 'grid', placeItems: 'center' }}>
                      <i className="fa fa-store" style={{ fontSize: '8px' }}></i>
                    </span>
                    <div>
                      <strong className="d-block text-dark">{t('timeline_step_3')}</strong>
                      <span className="text-muted">{product.marketName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="col-md-7">
              <h3 className="fw-bold mb-2 text-dark">{product.name}</h3>

              <div className="d-flex align-items-baseline gap-2 mb-3">
                <span className="display-6 fw-bold text-primary">{formatPrice(product.price)}</span>
                <span className="text-muted fs-6">/ {product.unit}</span>
                {product.oldPrice && (
                  <span className="text-muted text-decoration-line-through ms-2">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>

              {/* Stock Status Badge */}
              <div className="mb-3">
                <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill">
                  <i className="fa fa-boxes me-1"></i> {t('in_stock_label')} <strong>{product.stockQuantity} {product.unit}</strong>
                </span>
              </div>

              <p className="text-muted mb-4">{product.description}</p>

              {/* Quantity Selector & Action */}
              <div className="d-flex align-items-center gap-3 mb-4 pt-3 border-top">
                <div className="d-flex align-items-center border rounded-pill px-2 py-1 bg-light">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-link text-dark text-decoration-none px-2 fw-bold"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-3 fw-bold">{quantity}</span>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-link text-dark text-decoration-none px-2 fw-bold"
                    onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                  >
                    +
                  </button>
                </div>

                {cartError && (
                  <div className="w-100 alert alert-danger py-1 px-3 small mb-2 rounded-3">
                    <i className="fa fa-exclamation-circle me-1"></i> {cartError}
                  </div>
                )}

                <button 
                  type="button" 
                  className="btn btn-primary rounded-pill px-4 py-2 flex-grow-1 fw-semibold"
                  onClick={handleAddToCart}
                >
                  <i className="fa fa-shopping-basket me-2"></i>
                  {t('add_to_cart')} ({formatPrice(product.price * quantity)})
                </button>
              </div>

              {/* Reviews Section */}
              <div className="pt-3 border-top">
                <h6 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
                  <span>
                    <i className="fa fa-star text-warning me-1"></i> 
                    {currentLocale === 'ur' ? 'خریداروں کے حقیقی جائزے (5.0)' : currentLocale === 'ar' ? 'تقييمات المتسوقين الحقيقية (5.0)' : 'Verified Customer Ratings (5.0)'}
                  </span>
                  <span className="badge bg-success bg-opacity-10 text-success rounded-pill fw-normal" style={{ fontSize: '0.72rem' }}>
                    <i className="fa fa-check-circle me-1"></i> {currentLocale === 'ur' ? 'تصدیق شدہ خریدار' : currentLocale === 'ar' ? 'متسوق موثق' : 'Verified'}
                  </span>
                </h6>
                <div className="d-flex flex-column gap-2">
                  {sampleReviews.map((rev, i) => (
                    <div key={i} className="p-2 rounded bg-light border small">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong>{rev.author}</strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{rev.date}</span>
                      </div>
                      <p className="mb-0 text-secondary">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
