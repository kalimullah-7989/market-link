/**
 * MarketLink - Cart Drawer Component
 * Multi-stall grouping and cash checkout workflow
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useLanguage } from '../context/LanguageContext';
import { useCutoffTimer } from '../hooks/useCutoffTimer';
import PickupPassModal from './PickupPassModal';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { t, formatPrice, isRTL } = useLanguage();
  const { formattedString, isCritical } = useCutoffTimer();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkoutCart,
    totalItems,
    subtotal,
    isDrawerOpen,
    setIsDrawerOpen,
    pickupDate,
    setPickupDate,
    pickupTimeSlot,
    setPickupTimeSlot,
    orderNotes,
    setOrderNotes
  } = useCart();

  const { currentUser } = useAuth();
  const { addCreatedOrders } = useOrders();

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Group items by farmer stall
  const itemsByFarmer = useMemo(() => {
    const groups = {};
    cartItems.forEach((item) => {
      const fName = item.product.farmerName || 'Oak Ridge Organics';
      if (!groups[fName]) groups[fName] = [];
      groups[fName].push(item);
    });
    return groups;
  }, [cartItems]);

  if (!isDrawerOpen) return null;

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setCheckoutError('');

    try {
      const result = await checkoutCart({
        pickupDate,
        pickupTimeSlot,
        orderNotes
      });

      if (result.success && result.orders?.length > 0) {
        const primary = result.primaryOrder || result.orders[0];
        addCreatedOrders(result.orders);
        setOrderId(primary.id || primary.order_number || `ORD-${primary.id}`);
        setConfirmedOrder(primary);
        setOrderConfirmed(true);
      } else {
        setCheckoutError(result.message || 'Unable to complete checkout. Please review items.');
      }
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div 
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 1060 }}
        onClick={() => {
          setIsDrawerOpen(false);
          setOrderConfirmed(false);
        }}
      >
        <div 
          className={`position-fixed top-0 ${isRTL ? 'start-0' : 'end-0'} h-100 bg-white shadow-lg d-flex flex-column`}
          style={{
            width: '440px',
            maxWidth: '92vw',
            zIndex: 1061,
            animation: isRTL ? 'slideInLeft 0.3s ease-out' : 'slideInRight 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light">
            <div className="d-flex align-items-center">
              <i className="fa fa-shopping-basket text-primary fs-5 me-2"></i>
              <h5 className="mb-0 fw-bold">{t('basket_title')}</h5>
              <span className="badge bg-primary text-white rounded-pill ms-2">
                {totalItems}
              </span>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => {
                setIsDrawerOpen(false);
                setOrderConfirmed(false);
              }}
              aria-label="Close"
            ></button>
          </div>

          {/* Content */}
          <div className="flex-grow-1 overflow-auto p-3">
            {orderConfirmed ? (
              <div className="text-center py-5">
                <div className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                  <i className="fa fa-check fs-2"></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">{t('order_confirmed_title')}</h4>
                <p className="text-muted small mb-3">
                  {t('order_ref_label')} <strong className="text-primary">{orderId}</strong>
                </p>
                <div className="alert alert-success text-start small mb-4">
                  <i className="fa fa-info-circle me-1"></i>
                  <strong>Scheduled:</strong> {pickupDate} ({pickupTimeSlot})<br />
                  <strong>Payment:</strong> Strictly Cash on Stall Pickup (No Online Payment Required)
                </div>
                <div className="d-flex flex-column gap-2">
                  <button 
                    type="button"
                    className="btn btn-warning text-dark rounded-pill py-2 px-4 fw-bold shadow-sm"
                    onClick={() => setShowPassModal(true)}
                  >
                    <i className="fa fa-qrcode me-2"></i>{t('pass_view_button')}
                  </button>
                  <button 
                    type="button"
                    className="btn btn-primary rounded-pill py-2 px-4 fw-semibold text-white"
                    onClick={() => {
                      setOrderConfirmed(false);
                      setIsDrawerOpen(false);
                      navigate('/customer');
                    }}
                  >
                    <i className="fa fa-list-alt me-2"></i>{t('view_orders_btn')}
                  </button>
                  <button 
                    type="button"
                    className="btn btn-outline-secondary rounded-pill py-2 px-4"
                    onClick={() => {
                      setOrderConfirmed(false);
                      setIsDrawerOpen(false);
                    }}
                  >
                    {t('clear_btn')}
                  </button>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fa fa-shopping-bag fa-3x mb-3 text-secondary opacity-50"></i>
                <h6 className="fw-bold">{t('empty_basket')}</h6>
                <p className="small">{t('empty_basket_desc')}</p>
              </div>
            ) : (
              <>
                {/* Checkout Error Alert */}
                {checkoutError && (
                  <div className="alert alert-danger py-2 px-3 small mb-3 d-flex align-items-center">
                    <i className="fa fa-exclamation-triangle text-danger fs-5 me-2 flex-shrink-0"></i>
                    <div>{checkoutError}</div>
                  </div>
                )}

                {/* Cash on Pickup Notice */}
                <div className="alert alert-warning py-2 px-3 small mb-3 d-flex align-items-center">
                  <i className="fa fa-hand-holding-usd text-warning fs-5 me-2 flex-shrink-0"></i>
                  <div>
                    <strong>{t('cash_pickup_rule')}:</strong> {t('cash_note')}
                  </div>
                </div>

                {/* Items Grouped By Farmer Stall */}
                <div className="mb-3">
                  {Object.entries(itemsByFarmer).map(([farmerName, items]) => (
                    <div key={farmerName} className="mb-3 bg-light p-2 rounded-3 border">
                      <div className="d-flex align-items-center justify-content-between pb-1 mb-2 border-bottom">
                        <small className="fw-bold text-success text-uppercase" style={{ fontSize: '0.75rem' }}>
                          <i className="fa fa-store me-1"></i> {farmerName}
                        </small>
                        <span className="badge bg-white text-dark border" style={{ fontSize: '0.65rem' }}>
                          {items.length} {items.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>

                      <div className="list-group list-group-flush bg-transparent">
                        {items.map((item) => (
                          <div key={item.product.id} className="list-group-item bg-transparent px-1 py-2 d-flex align-items-center border-0">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="rounded me-2" 
                              style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="mb-0 fw-semibold" style={{ fontSize: '0.9rem' }}>{item.product.name}</h6>
                              <small className="text-muted d-block" style={{ fontSize: '0.8rem' }}>
                                {formatPrice(item.product.price)} / {item.product.unit}
                              </small>
                            </div>

                            {/* Stepper */}
                            <div className="d-flex align-items-center bg-white border rounded me-2">
                              <button 
                                type="button" 
                                className="btn btn-sm btn-light px-2 py-0"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="px-2 small fw-bold">{item.quantity}</span>
                              <button 
                                type="button" 
                                className="btn btn-sm btn-light px-2 py-0"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>

                            <button 
                              type="button" 
                              className="btn btn-sm text-danger px-1"
                              onClick={() => removeFromCart(item.product.id)}
                              title={t('remove_item_btn')}
                            >
                              <i className="fa fa-trash-alt small"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pickup Slot & Date Picker */}
                <div className="p-3 bg-light rounded-2 border mb-3">
                  <h6 className="fw-bold mb-2 small text-uppercase text-dark">
                    <i className="fa fa-calendar-alt text-primary me-1"></i> {t('pickup_schedule_title')}
                  </h6>
                  <div className="mb-2">
                    <label className="form-label small text-muted mb-1">{t('pickup_date_label')}</label>
                    <input 
                      type="date" 
                      className="form-control form-control-sm"
                      value={pickupDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small text-muted mb-1">{t('pickup_slot_label')}</label>
                    <select 
                      className="form-select form-select-sm"
                      value={pickupTimeSlot}
                      onChange={(e) => setPickupTimeSlot(e.target.value)}
                    >
                      <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM (Early Harvest)</option>
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Midday Pickup)</option>
                      <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM (Afternoon Pickup)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label small text-muted mb-1">{t('order_notes_label')}</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm"
                      placeholder={t('order_notes_placeholder')}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Subtotal */}
                <div className="border-top pt-3 mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">{t('basket_subtotal')}:</span>
                    <span className="fw-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 small text-muted">
                    <span>{t('settlement_method')}:</span>
                    <span className="text-success fw-semibold">Cash On Pickup</span>
                  </div>
                  <div className="d-flex justify-content-between fs-5 fw-bold border-top pt-2">
                    <span>{t('total_amount')}:</span>
                    <span className="text-primary">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button 
                  type="button" 
                  className="btn btn-primary w-100 rounded-pill py-2 fw-bold text-white shadow-sm mb-2"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span><i className="fa fa-spinner fa-spin me-2"></i>Processing Pre-Order...</span>
                  ) : (
                    <span><i className="fa fa-hand-holding-usd me-2"></i>Place Pre-Order (Cash on Pickup)</span>
                  )}
                </button>

                <button 
                  type="button" 
                  className="btn btn-outline-danger w-100 rounded-pill py-1 small"
                  onClick={clearCart}
                  disabled={submitting}
                >
                  {t('clear_btn')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pickup Pass Modal */}
      <PickupPassModal
        order={confirmedOrder}
        isOpen={showPassModal}
        onClose={() => setShowPassModal(false)}
      />
    </>
  );
}
