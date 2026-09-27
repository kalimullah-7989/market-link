import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, PRESET_USERS } from '../context/AuthContext';

export default function RoleSwitcherModal({ isOpen, onClose }) {
  const { currentUser, role, switchRole, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 1050 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3 shadow-lg p-4"
        style={{ maxWidth: '440px', width: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
          <div className="d-flex align-items-center">
            <span className="badge bg-primary text-white rounded-pill px-3 py-1 me-2 text-uppercase" style={{ fontSize: '0.75rem' }}>
              Account Profile
            </span>
            <h5 className="mb-0 text-dark fw-bold">Current User</h5>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>

        {currentUser ? (
          <div className="d-flex align-items-center p-3 bg-light rounded-3 mb-3 border">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="rounded-circle me-3" 
              style={{ width: '48px', height: '48px', objectFit: 'cover' }}
            />
            <div className="flex-grow-1">
              <h6 className="mb-0 fw-bold">{currentUser.name}</h6>
              <small className="text-muted d-block">{currentUser.email}</small>
              <span className={`badge ${role === 'farmer' ? 'bg-success' : role === 'admin' ? 'bg-danger' : 'bg-primary'} text-white text-uppercase mt-1`} style={{ fontSize: '0.7rem' }}>
                {role} {role === 'farmer' && `(${currentUser.stallName})`}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-light rounded-3 mb-3 text-center text-muted">
            <i className="fa fa-user-circle fa-2x mb-2 text-secondary"></i>
            <p className="mb-0 small">Browsing as Guest</p>
          </div>
        )}

        <label className="form-label text-muted small fw-semibold text-uppercase mb-2">
          Switch Portal Role:
        </label>

        <div className="d-grid gap-2 mb-3">
          <button
            type="button"
            className={`btn text-start p-3 rounded-2 border d-flex align-items-center justify-content-between ${role === 'customer' ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
            onClick={() => {
              switchRole('customer');
              onClose();
            }}
          >
            <div>
              <div className="fw-bold"><i className="fa fa-user me-2"></i>Customer Portal</div>
              <small className={role === 'customer' ? 'text-white-50' : 'text-muted'}>
                Pre-Orders, Cart & Token Tracking
              </small>
            </div>
            {role === 'customer' && <i className="fa fa-check-circle fs-5"></i>}
          </button>

          <button
            type="button"
            className={`btn text-start p-3 rounded-2 border d-flex align-items-center justify-content-between ${role === 'farmer' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
            onClick={() => {
              switchRole('farmer');
              onClose();
            }}
          >
            <div>
              <div className="fw-bold"><i className="fa fa-tractor me-2"></i>Farmer / Stall Owner Portal</div>
              <small className={role === 'farmer' ? 'text-white-50' : 'text-muted'}>
                Produce Inventory & Order Fulfillment
              </small>
            </div>
            {role === 'farmer' && <i className="fa fa-check-circle fs-5"></i>}
          </button>

          <button
            type="button"
            className={`btn text-start p-3 rounded-2 border d-flex align-items-center justify-content-between ${role === 'admin' ? 'btn-danger text-white' : 'btn-outline-secondary'}`}
            onClick={() => {
              switchRole('admin');
              onClose();
            }}
          >
            <div>
              <div className="fw-bold"><i className="fa fa-shield-alt me-2"></i>Platform Admin Portal</div>
              <small className={role === 'admin' ? 'text-white-50' : 'text-muted'}>
                Farmer Approvals & Market Analytics
              </small>
            </div>
            {role === 'admin' && <i className="fa fa-check-circle fs-5"></i>}
          </button>
        </div>

        <div className="d-flex align-items-center justify-content-between pt-3 border-top">
          {currentUser ? (
            <button 
              type="button" 
              className="btn btn-sm btn-link text-danger text-decoration-none px-0"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              <i className="fa fa-sign-out-alt me-1"></i> Sign Out
            </button>
          ) : (
            <span className="small text-muted">Select role above</span>
          )}

          <div className="d-flex gap-2">
            <Link
              to={role === 'farmer' ? '/farmer' : role === 'admin' ? '/admin' : '/customer'}
              className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold"
              onClick={onClose}
            >
              <i className="fa fa-tachometer-alt me-1"></i> Go to Dashboard
            </Link>
            <button 
              type="button" 
              className="btn btn-sm btn-secondary rounded-pill px-3"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
