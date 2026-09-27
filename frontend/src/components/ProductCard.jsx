import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import FreshnessBadge from './FreshnessBadge';

export default function ProductCard({ product, delay = '0.1s', onViewDetail, onOpenDetail, colClass = 'col-lg-4 col-md-6' }) {
  const { addToCart, setIsDrawerOpen } = useCart();
  const { t, formatPrice } = useLanguage();
  const handleDetail = onViewDetail || onOpenDetail;

  if (!product) return null;

  const defaultImg = `/img/product-${((Number(product.id) || 1) % 8) + 1}.jpg`;
  const [imgSrc, setImgSrc] = React.useState(product.image || defaultImg);

  React.useEffect(() => {
    if (product?.image) {
      setImgSrc(product.image);
    }
  }, [product?.image]);

  return (
    <div className={`${colClass} wow fadeInUp`} data-wow-delay={delay}>
      <div className="product-item rounded bg-white overflow-hidden shadow-sm h-100 d-flex flex-column border">
        <div 
          className="position-relative bg-light overflow-hidden" 
          style={{ cursor: handleDetail ? 'pointer' : 'default' }}
          onClick={() => handleDetail && handleDetail(product)}
        >
          <img 
            className="img-fluid w-100" 
            src={imgSrc} 
            alt={product.name || 'Organic Produce'}
            style={{ height: '230px', objectFit: 'cover' }} 
            onError={() => setImgSrc(defaultImg)}
          />
          <div className="position-absolute start-0 top-0 m-3" style={{ zIndex: 3 }}>
            <FreshnessBadge hoursAgo={product.harvestHoursAgo} fallbackBadge={product.badge} />
          </div>
        </div>
        <div className="text-center p-4">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
            {product.farmerName && (
              <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                <i className="fa fa-store text-primary me-1"></i>{product.farmerName}
              </small>
            )}
            {product.harvestTimeLabel && (
              <small className="text-success fw-semibold" style={{ fontSize: '0.72rem' }}>
                • <i className="fa fa-history me-1"></i>{product.harvestTimeLabel}
              </small>
            )}
          </div>
          <Link className="d-block h5 mb-2 text-decoration-none" to="/products">
            {product.name}
          </Link>
          <div className="mb-2">
            <span className="text-primary me-1 fw-bold fs-5">{formatPrice ? formatPrice(product.price) : `Rs. ${product.price}`}</span>
            {product.unit && <small className="text-muted me-2">/ {product.unit}</small>}
            {product.oldPrice && (
              <span className="text-muted text-decoration-line-through small">{formatPrice ? formatPrice(product.oldPrice) : `Rs. ${product.oldPrice}`}</span>
            )}
          </div>
          {product.stockQuantity !== undefined && (
            <small className="badge bg-light text-success border px-2 py-1">
              {t('in_stock_label')} {product.stockQuantity} {product.unit}
            </small>
          )}
        </div>
        <div className="d-flex border-top mt-auto">
          <small className="w-50 text-center border-end py-2">
            <button
              type="button" 
              className="btn btn-link text-body text-decoration-none p-0 w-100"
              onClick={() => handleDetail ? handleDetail(product) : null}
            >
              <i className="fa fa-eye text-primary me-2"></i>{t('view_detail')}
            </button>
          </small>
          <small className="w-50 text-center py-2">
            <button 
              type="button" 
              className="btn btn-link text-body text-decoration-none p-0 w-100" 
              onClick={() => {
                addToCart(product, 1);
                setIsDrawerOpen(true);
              }}
            >
              <i className="fa fa-shopping-bag text-primary me-2"></i>{t('add_to_cart')}
            </button>
          </small>
        </div>
      </div>
    </div>
  );
}
