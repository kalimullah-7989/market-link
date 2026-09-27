import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { productsData } from '../data/products';
import { farmersData } from '../data/farmersData';
import { useLanguage } from '../context/LanguageContext';
import PickupPassModal from '../components/PickupPassModal';
import AuthModal from '../components/AuthModal';

export default function CustomerDashboard() {
  const { currentUser } = useAuth();
  const { orders, cancelOrder, addReview } = useOrders();
  const { addToCart, setIsDrawerOpen } = useCart();
  const { t, formatPrice } = useLanguage();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active-orders');
  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null);
  const [selectedPassOrder, setSelectedPassOrder] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Filter orders for active customer
  const customerOrders = orders.filter(
    (ord) =>
      !currentUser ||
      currentUser.role === 'customer' ||
      String(ord.customerId) === String(currentUser?.id) ||
      (ord.customerName && currentUser?.name && ord.customerName.toLowerCase().includes(currentUser.name.toLowerCase()))
  );

  const activeOrders = customerOrders.filter(
    (ord) => ord.status !== 'completed' && ord.status !== 'cancelled'
  );

  const pastOrders = customerOrders.filter(
    (ord) => ord.status === 'completed' || ord.status === 'cancelled'
  );

  const handleQuickReorder = (order) => {
    order.items.forEach((item) => {
      const originalProduct = productsData.find((p) => p.id === item.id) || {
        id: item.id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        stockQuantity: 50,
        farmerName: order.farmerName,
        marketName: order.marketName,
        image: '/img/product-1.jpg'
      };
      addToCart(originalProduct, item.quantity);
    });
    setIsDrawerOpen(true);
  };

  const handleOpenReview = (order) => {
    setSelectedReviewOrder(order);
    setReviewRating(5);
    setReviewComment('');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (selectedReviewOrder && reviewComment.trim()) {
      addReview(selectedReviewOrder.id, reviewRating, reviewComment);
      setSelectedReviewOrder(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill"><i className="fa fa-clock me-1"></i> Placed (Awaiting Acceptance)</span>;
      case 'accepted':
        return <span className="badge bg-info text-white px-3 py-2 rounded-pill"><i className="fa fa-check me-1"></i> Accepted (Harvest In Prep)</span>;
      case 'ready_for_pickup':
        return <span className="badge bg-success text-white px-3 py-2 rounded-pill"><i className="fa fa-shopping-bag me-1"></i> Ready for Pickup</span>;
      case 'completed':
        return <span className="badge bg-secondary text-white px-3 py-2 rounded-pill"><i className="fa fa-check-double me-1"></i> Completed & Paid</span>;
      case 'cancelled':
        return <span className="badge bg-danger text-white px-3 py-2 rounded-pill"><i className="fa fa-times me-1"></i> Cancelled</span>;
      default:
        return <span className="badge bg-light text-dark px-3 py-2 rounded-pill">{status}</span>;
    }
  };

  const getTimelineStep = (status) => {
    switch (status) {
      case 'placed': return 1;
      case 'accepted': return 2;
      case 'ready_for_pickup': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  if (!currentUser) {
    return (
      <>
        <PageHeader title="Customer Portal" breadcrumb="Sign In Required" />
        <div className="container py-5 text-center my-5">
          <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '500px', borderRadius: '16px' }}>
            <div className="text-primary mb-3">
              <i className="fa fa-user-circle fa-3x"></i>
            </div>
            <h4 className="fw-bold text-dark mb-2">Sign In Required</h4>
            <p className="text-muted mb-4">
              Please sign in to access your pre-orders, pickup tokens, and order history.
            </p>
            <button 
              type="button" 
              className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
              onClick={() => setIsAuthOpen(true)}
            >
              <i className="fa fa-sign-in-alt me-2"></i>Sign In / Register
            </button>
          </div>
        </div>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode="login" />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Customer Portal" breadcrumb="My Dashboard" />

      <div className="container-xxl py-5">
        <div className="container">
          {/* User Profile Header Card */}
          <div className="bg-white rounded-3 p-4 shadow-sm border mb-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <img 
                  src={currentUser?.avatar || '/img/testimonial-1.jpg'} 
                  alt={currentUser?.name || 'Customer'}
                  className="rounded-circle border border-primary border-2"
                  style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                />
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <h4 className="mb-0 fw-bold">{currentUser?.name || 'Hamza Ali'}</h4>
                    <span className="badge bg-primary text-white rounded-pill text-uppercase" style={{ fontSize: '0.7rem' }}>
                      Customer
                    </span>
                  </div>
                  <small className="text-muted d-block">
                    <i className="fa fa-envelope text-primary me-1"></i> {currentUser?.email || 'hamza@customer.com'} &bull; <i className="fa fa-phone text-primary me-1 ms-2"></i> {currentUser?.phone || '+92 300 1234567'}
                  </small>
                  <small className="text-muted">
                    <i className="fa fa-map-marker-alt text-primary me-1"></i> {currentUser?.address || 'Gulberg III, Lahore'}
                  </small>
                </div>
              </div>

              <div className="d-flex gap-2">
                <Link to="/products" className="btn btn-outline-primary rounded-pill px-3">
                  <i className="fa fa-shopping-basket me-1"></i> Browse Harvest
                </Link>
                <Link to="/markets" className="btn btn-primary rounded-pill px-3">
                  <i className="fa fa-map-marked-alt me-1"></i> Find Markets
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <ul className="nav nav-pills mb-4 gap-2 border-bottom pb-3">
            <li className="nav-item">
              <button
                type="button"
                className={`btn rounded-pill px-4 ${activeTab === 'active-orders' ? 'btn-primary text-white' : 'btn-light text-dark'}`}
                onClick={() => setActiveTab('active-orders')}
              >
                <i className="fa fa-box-open me-2"></i>
                Active Pre-Orders ({activeOrders.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`btn rounded-pill px-4 ${activeTab === 'past-orders' ? 'btn-primary text-white' : 'btn-light text-dark'}`}
                onClick={() => setActiveTab('past-orders')}
              >
                <i className="fa fa-history me-2"></i>
                Order History ({pastOrders.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`btn rounded-pill px-4 ${activeTab === 'favorites' ? 'btn-primary text-white' : 'btn-light text-dark'}`}
                onClick={() => setActiveTab('favorites')}
              >
                <i className="fa fa-heart me-2"></i>
                Favorite Stalls (3)
              </button>
            </li>
          </ul>

          {/* Tab 1: Active Pre-Orders */}
          {activeTab === 'active-orders' && (
            <div>
              {activeOrders.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-3 border">
                  <i className="fa fa-shopping-basket fa-3x text-secondary opacity-50 mb-3"></i>
                  <h5 className="fw-bold text-dark">No Active Pre-Orders</h5>
                  <p className="text-muted small">You currently have no pre-orders in progress.</p>
                  <Link to="/products" className="btn btn-primary rounded-pill px-4 mt-2">
                    Browse Produce to Pre-Order
                  </Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {activeOrders.map((order) => {
                    const step = getTimelineStep(order.status);
                    return (
                      <div key={order.id} className="bg-white rounded-3 p-4 shadow-sm border">
                        {/* Order Header */}
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-3 border-bottom">
                          <div>
                            <span className="fw-bold text-primary fs-5 me-2">{order.id}</span>
                            <span className="text-muted small">
                              Placed on: {new Date(order.placedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>

                        {/* Progress Timeline */}
                        <div className="py-4 my-2 px-2">
                          <div className="row text-center position-relative">
                            <div className="col-3">
                              <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-1 text-white ${step >= 1 ? 'bg-primary' : 'bg-light text-muted border'}`} style={{ width: '38px', height: '38px' }}>
                                <i className="fa fa-file-invoice"></i>
                              </div>
                              <div className={`small fw-semibold ${step >= 1 ? 'text-primary' : 'text-muted'}`}>1. Placed</div>
                            </div>
                            <div className="col-3">
                              <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-1 text-white ${step >= 2 ? 'bg-info' : 'bg-light text-muted border'}`} style={{ width: '38px', height: '38px' }}>
                                <i className="fa fa-handshake"></i>
                              </div>
                              <div className={`small fw-semibold ${step >= 2 ? 'text-info' : 'text-muted'}`}>2. Accepted</div>
                            </div>
                            <div className="col-3">
                              <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-1 text-white ${step >= 3 ? 'bg-success' : 'bg-light text-muted border'}`} style={{ width: '38px', height: '38px' }}>
                                <i className="fa fa-store"></i>
                              </div>
                              <div className={`small fw-semibold ${step >= 3 ? 'text-success' : 'text-muted'}`}>3. Ready for Pickup</div>
                            </div>
                            <div className="col-3">
                              <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-1 text-white ${step >= 4 ? 'bg-secondary' : 'bg-light text-muted border'}`} style={{ width: '38px', height: '38px' }}>
                                <i className="fa fa-check"></i>
                              </div>
                              <div className={`small fw-semibold ${step >= 4 ? 'text-secondary' : 'text-muted'}`}>4. Collected</div>
                            </div>
                          </div>
                        </div>

                        {/* Pickup Point & Items Details */}
                        <div className="row g-3 pt-3 border-top bg-light p-3 rounded-2">
                          <div className="col-md-6">
                            <small className="text-muted fw-bold text-uppercase d-block mb-1">
                              <i className="fa fa-map-pin text-primary me-1"></i> Pickup Location & Window
                            </small>
                            <h6 className="fw-bold mb-1">{order.farmerName} ({order.stallNumber})</h6>
                            <p className="text-muted small mb-1">{order.marketName}</p>
                            <span className="badge bg-white text-dark border px-3 py-1">
                              <i className="fa fa-calendar-alt text-primary me-1"></i> Date: {order.pickupDate} ({order.timeSlot})
                            </span>
                            <div className="mt-2 text-success small">
                              <i className="fa fa-hand-holding-usd me-1"></i> Payment: Settle <strong>{formatPrice(order.totalAmount)}</strong> cash at stall pickup
                            </div>
                            {order.pickupToken && (
                              <div className="mt-2">
                                <span className="badge bg-dark text-warning border px-3 py-2 font-monospace" style={{ fontSize: '0.8rem' }}>
                                  <i className="fa fa-qrcode me-1"></i> Stall Pass Token: <strong>{order.pickupToken}</strong>
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <small className="text-muted fw-bold text-uppercase d-block mb-1">
                              <i className="fa fa-shopping-basket text-primary me-1"></i> Reserved Items
                            </small>
                            <ul className="list-unstyled mb-2">
                              {order.items.map((it, idx) => (
                                <li key={idx} className="small d-flex justify-content-between py-1 border-bottom">
                                  <span>{it.name} &times; {it.quantity} {it.unit}</span>
                                  <span className="fw-semibold">{formatPrice(it.price * it.quantity)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="d-flex justify-content-between fw-bold">
                              <span>Total:</span>
                              <span className="text-primary fs-6">{formatPrice(order.totalAmount)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="d-flex flex-wrap justify-content-end gap-2 pt-3">
                          <button
                            type="button"
                            className="btn btn-sm btn-success rounded-pill px-3 fw-semibold shadow-sm"
                            onClick={() => setSelectedPassOrder(order)}
                          >
                            <i className="fa fa-ticket-alt me-1"></i> {t('pass_view_button')}
                          </button>
                          {order.status === 'placed' && (
                            cancellingOrderId === order.id ? (
                              <div className="d-inline-flex align-items-center gap-1">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger rounded-pill px-3"
                                  onClick={() => {
                                    cancelOrder(order.id);
                                    setCancellingOrderId(null);
                                  }}
                                >
                                  Confirm Cancel
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-light rounded-pill px-2"
                                  onClick={() => setCancellingOrderId(null)}
                                >
                                  Keep
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                onClick={() => setCancellingOrderId(order.id)}
                              >
                                <i className="fa fa-times me-1"></i> Cancel Pre-Order
                              </button>
                            )
                          )}
                          <Link 
                            to="/markets"
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          >
                            <i className="fa fa-directions me-1"></i> View Stall on Map
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Order History */}
          {activeTab === 'past-orders' && (
            <div className="d-flex flex-column gap-3">
              {pastOrders.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-3 border">
                  <p className="text-muted">No past order history found.</p>
                </div>
              ) : (
                pastOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3 p-4 shadow-sm border">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-2 border-bottom">
                      <div>
                        <span className="fw-bold text-dark fs-6 me-2">{order.id}</span>
                        <small className="text-muted">{order.farmerName} &bull; {order.pickupDate}</small>
                      </div>
                      <div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    <div className="py-2">
                      <small className="text-muted">Items: {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}</small>
                    </div>

                    {order.ratingGiven && (
                      <div className="alert alert-light border small py-2 mb-2">
                        <i className="fa fa-star text-warning me-1"></i>
                        <strong>Your Review ({order.ratingGiven}/5):</strong> "{order.reviewGiven}"
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <span className="fw-bold text-primary">{formatPrice(order.totalAmount)}</span>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success rounded-pill px-3"
                          onClick={() => setSelectedPassOrder(order)}
                        >
                          <i className="fa fa-receipt me-1"></i> Receipt / Pass
                        </button>
                        {order.status === 'completed' && !order.ratingGiven && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning text-dark rounded-pill px-3"
                            onClick={() => handleOpenReview(order)}
                          >
                            <i className="fa fa-star text-warning me-1"></i> Rate & Review
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          onClick={() => handleQuickReorder(order)}
                        >
                          <i className="fa fa-redo me-1"></i> Quick Reorder
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Favorites */}
          {activeTab === 'favorites' && (
            <div className="row g-4">
              {farmersData.slice(0, 3).map((farmer) => (
                <div key={farmer.id} className="col-lg-4 col-md-6">
                  <div className="bg-white p-4 rounded-3 border shadow-sm h-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-light text-primary border">{farmer.stallNumber}</span>
                      <i className="fa fa-heart text-danger fs-5"></i>
                    </div>
                    <h5 className="fw-bold mb-1">{farmer.stallName}</h5>
                    <p className="small text-muted mb-2">{farmer.marketName}</p>
                    <p className="small text-secondary mb-3">{farmer.bio}</p>
                    <Link to="/products" className="btn btn-sm btn-primary rounded-pill w-100">
                      View Stall Harvest
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review & Rating Modal */}
      {selectedReviewOrder && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1080 }}
          onClick={() => setSelectedReviewOrder(null)}
        >
          <div 
            className="bg-white rounded-3 shadow-lg p-4" 
            style={{ maxWidth: '460px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="fw-bold mb-0">Review {selectedReviewOrder.farmerName}</h5>
              <button type="button" className="btn-close" onClick={() => setSelectedReviewOrder(null)}></button>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div className="mb-3 text-center">
                <label className="form-label text-muted small d-block">Tap stars to rate:</label>
                <div className="fs-3 text-warning cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i 
                      key={star}
                      className={`fa fa-star mx-1 ${star <= reviewRating ? 'text-warning' : 'text-black-50'}`}
                      onClick={() => setReviewRating(star)}
                      style={{ cursor: 'pointer' }}
                    ></i>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Feedback Comment</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  placeholder="How was the freshness and pickup experience at the stall?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light rounded-pill px-3" onClick={() => setSelectedReviewOrder(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary rounded-pill px-4">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPassOrder && (
        <PickupPassModal
          order={selectedPassOrder}
          isOpen={!!selectedPassOrder}
          onClose={() => setSelectedPassOrder(null)}
        />
      )}
    </>
  );
}
