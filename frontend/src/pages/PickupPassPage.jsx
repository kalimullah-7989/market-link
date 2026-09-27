import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { useOrders } from '../context/OrderContext';
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/PageHeader';

export default function PickupPassPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { t, formatPrice } = useLanguage();

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);
  const [sunshineMode, setSunshineMode] = useState(false);

  // Find order by ID, order number, or raw integer ID
  const order = orders.find((o) => o.id === orderId || String(o.rawId) === String(orderId) || o.pickupToken === orderId) || orders[0];

  useEffect(() => {
    if (!order) return;

    const qrPayload = JSON.stringify({
      portal: 'MarketLink',
      orderId: order.id,
      token: order.pickupToken || order.id,
      customer: order.customerName,
      stall: order.stallNumber || 'Stall A-12',
      farmer: order.farmerName,
      pickupDate: order.pickupDate,
      timeSlot: order.timeSlot,
      cashDue: order.totalAmount,
      rule: 'Cash on Stall Pickup Only'
    });

    QRCode.toDataURL(qrPayload, {
      width: 260,
      margin: 1,
      color: {
        dark: '#0d381e',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [order]);

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fw-bold text-danger">Pickup Pass Not Found</h4>
        <p className="text-muted">No pre-order matching the specified reference could be located.</p>
        <Link to="/customer" className="btn btn-primary rounded-pill px-4">
          Return to Customer Dashboard
        </Link>
      </div>
    );
  }

  const handleCopyToken = () => {
    const token = order.pickupToken || order.id;
    navigator.clipboard.writeText(token).then(() => {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const isCompleted = order.status === 'completed';

  return (
    <>
      <div className="no-print">
        <PageHeader title={t('pass_modal_title')} breadcrumb="In-Stall Pickup Pass" />
      </div>

      <div className="container-xxl py-4">
        <div className="container" style={{ maxWidth: '780px' }}>
          {/* Top Control Bar (Hidden in Print) */}
          <div className="no-print d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4 bg-white p-3 rounded-3 shadow-sm border">
            <Link to="/customer" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
              <i className="fa fa-arrow-left me-1"></i> Back to Dashboard
            </Link>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className={`btn btn-sm ${sunshineMode ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'} rounded-pill px-3`}
                onClick={() => setSunshineMode(!sunshineMode)}
              >
                <i className="fa fa-sun me-1"></i> {t('pass_high_contrast')}
              </button>

              <button
                type="button"
                className="btn btn-sm btn-primary rounded-pill px-4 fw-semibold"
                onClick={handlePrint}
              >
                <i className="fa fa-print me-1"></i> {t('pass_print_btn')}
              </button>
            </div>
          </div>

          {/* Printable Pickup Pass Card */}
          <div className="pickup-pass-voucher printable-pickup-pass border">
            {/* Voucher Header */}
            <div className="pickup-pass-header d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="fa fa-leaf fs-3 text-warning"></i>
                  <h3 className="mb-0 fw-bold text-white tracking-wide">MarketLink</h3>
                  <span className="badge bg-white text-success fw-bold rounded-pill text-uppercase px-2 py-0" style={{ fontSize: '0.7rem' }}>
                    Stall Pass
                  </span>
                </div>
                <p className="mb-0 text-white-50 small" style={{ fontSize: '0.82rem' }}>
                  {t('pass_modal_subtitle')}
                </p>
              </div>

              <div className="text-end">
                <span className={`badge px-3 py-1 rounded-pill ${isCompleted ? 'bg-secondary text-white' : 'bg-warning text-dark fw-bold'}`}>
                  {isCompleted ? t('pass_status_verified') : (order.status?.replace('_', ' ').toUpperCase() || 'CONFIRMED')}
                </span>
                <div className="text-white font-monospace small mt-1 opacity-75">
                  #{order.id}
                </div>
              </div>
            </div>

            <div className="p-4">
              {/* QR and Token Row */}
              <div className="row g-4 align-items-center mb-3">
                <div className="col-sm-5 text-center">
                  <div className={`qr-scanner-card ${sunshineMode ? 'sunshine-mode' : ''}`}>
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt={`QR Pass for ${order.id}`}
                        style={{ width: '180px', height: '180px' }}
                      />
                    ) : (
                      <div style={{ width: '180px', height: '180px' }} className="d-flex align-items-center justify-content-center bg-light">
                        <i className="fa fa-spinner fa-spin text-muted fs-3"></i>
                      </div>
                    )}
                    <small className="text-muted mt-2 fw-semibold d-block" style={{ fontSize: '0.7rem' }}>
                      <i className="fa fa-qrcode me-1 text-primary"></i>
                      {t('pass_scan_notice')}
                    </small>
                  </div>
                </div>

                <div className="col-sm-7">
                  <div className="bg-light p-3 rounded-3 border">
                    <small className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.72rem' }}>
                      {t('pass_token_label')}
                    </small>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-dark text-warning font-monospace fw-bold fs-4 rounded-2 tracking-wider">
                        {order.pickupToken || order.id}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary rounded-circle"
                        style={{ width: '32px', height: '32px', padding: 0 }}
                        onClick={handleCopyToken}
                        title="Copy Token"
                      >
                        <i className={`fa ${copiedToken ? 'fa-check text-success' : 'fa-copy'}`}></i>
                      </button>
                    </div>

                    <div className="small text-muted mb-1">
                      <i className="fa fa-user me-1 text-primary"></i> <strong>{order.customerName}</strong>
                      {order.customerPhone && <span className="ms-2">({order.customerPhone})</span>}
                    </div>

                    <div className="small text-muted">
                      <i className="fa fa-calendar-alt me-1 text-primary"></i> Order Placed: {new Date(order.placedAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Highlights box: Stall & Window */}
                  <div className="mt-3 p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-success fw-bold d-block" style={{ fontSize: '0.7rem' }}>
                        {t('pass_stall_number')}
                      </small>
                      <strong className="text-dark fs-5">{order.stallNumber || 'Stall A-12'}</strong>
                    </div>
                    <div className="text-end">
                      <small className="text-success fw-bold d-block" style={{ fontSize: '0.7rem' }}>
                        {t('pass_pickup_window')}
                      </small>
                      <strong className="text-dark">{order.pickupDate} ({order.timeSlot})</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perforation Separator */}
              <div className="pickup-pass-perforation"></div>

              {/* Logistics & Location Details */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <span className="text-muted d-block small">{t('pass_market_location')}:</span>
                  <strong className="text-dark">{order.marketName || 'Green Valley Farmers Market'}</strong>
                </div>
                <div className="col-6 text-end">
                  <span className="text-muted d-block small">Producer / Farm:</span>
                  <strong className="text-primary">{order.farmerName || 'Oak Ridge Organics'}</strong>
                </div>
              </div>

              {/* Reserved Produce Manifest Table */}
              <div className="mb-4">
                <small className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>
                  <i className="fa fa-shopping-basket text-primary me-1"></i> {t('pass_reserved_items')}
                </small>
                <div className="table-responsive">
                  <table className="table table-bordered mb-0 align-middle">
                    <thead className="table-light text-muted">
                      <tr>
                        <th>Item</th>
                        <th className="text-center" style={{ width: '90px' }}>Qty</th>
                        <th className="text-end" style={{ width: '110px' }}>Rate</th>
                        <th className="text-end" style={{ width: '120px' }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="fw-semibold text-dark">{item.name}</td>
                          <td className="text-center">{item.quantity} {item.unit}</td>
                          <td className="text-end">{formatPrice(item.price)}</td>
                          <td className="text-end fw-bold">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Settlement & Cash Guarantee */}
              <div className="bg-light p-3 rounded-3 border mb-3">
                <div className="d-flex justify-content-between mb-1 small text-muted">
                  <span>{t('pass_subtotal')}:</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>{t('pass_stall_fee')}:</span>
                  <span className="text-success fw-bold">{t('pass_free_waived')}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <div>
                    <span className="fw-bold text-dark fs-5 d-block">{t('pass_total_cash')}</span>
                    <small className="text-danger fw-semibold">
                      <i className="fa fa-money-bill-wave me-1"></i> {t('cash_pickup_rule')}
                    </small>
                  </div>
                  <span className="fw-bolder text-primary fs-3">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Official Farmer Stamp & Verification Box */}
              <div className="pass-stamp-box">
                <div className="row g-2 align-items-center">
                  <div className="col-sm-7">
                    <small className="text-muted fw-bold d-block mb-1" style={{ fontSize: '0.72rem' }}>
                      {t('pass_farmer_signature')}
                    </small>
                    <div className="border-bottom border-secondary border-opacity-50 pt-3 mb-1" style={{ maxWidth: '240px' }}></div>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                      Stall Attendant Signature &amp; Cash Verification
                    </small>
                  </div>
                  <div className="col-sm-5 text-sm-end">
                    <span className="badge bg-light text-secondary border px-3 py-2 font-monospace" style={{ fontSize: '0.72rem' }}>
                      VERIFIED AT STALL: [ &nbsp; ] YES
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
