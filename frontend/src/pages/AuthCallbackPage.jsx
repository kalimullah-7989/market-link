import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallbackSession } = useAuth();
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Authenticating with Google...');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      if (errorParam === 'account_suspended') {
        setError('Your account is currently suspended. Please contact support.');
      } else {
        setError('Google authentication was cancelled or failed. Please try again.');
      }
      return;
    }

    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name') || 'Google User';
    const role = searchParams.get('role') || 'customer';
    const avatar = searchParams.get('avatar');
    const id = searchParams.get('id');

    if (token && email) {
      setStatus(`Welcome back, ${name}! Redirecting to your dashboard...`);
      let pendingFarmer = {};
      try {
        const stored = localStorage.getItem('pending_farmer_google_registration');
        if (stored) {
          pendingFarmer = JSON.parse(stored);
          localStorage.removeItem('pending_farmer_google_registration');
        }
      } catch (e) {}

      const userObj = {
        id: id ? parseInt(id, 10) : Date.now(),
        name,
        email,
        role,
        avatar: avatar || (role === 'farmer' ? '/img/testimonial-2.jpg' : '/img/testimonial-1.jpg'),
        phone: pendingFarmer.phone || undefined,
        city: pendingFarmer.city || undefined,
        country: pendingFarmer.country || undefined,
        marketId: pendingFarmer.market_id || undefined,
        market_id: pendingFarmer.market_id || undefined,
        stallName: pendingFarmer.farm_name || (role === 'farmer' ? `${name}'s Organic Farm` : undefined),
        farm_name: pendingFarmer.farm_name || (role === 'farmer' ? `${name}'s Organic Farm` : undefined),
        stallNumber: pendingFarmer.stall_number || undefined,
        stall_number: pendingFarmer.stall_number || undefined,
        approvalStatus: role === 'farmer' ? 'pending' : undefined,
        authProvider: 'google'
      };

      if (handleGoogleCallbackSession) {
        handleGoogleCallbackSession(userObj, token);
      } else {
        localStorage.setItem('marketlink_auth_user', JSON.stringify(userObj));
        localStorage.setItem('marketlink_token', token);
      }

      if (role === 'farmer') {
        try {
          const stored = JSON.parse(localStorage.getItem('marketlink_registered_farmers') || '[]');
          if (!stored.some((f) => f.email === email || String(f.id) === String(userObj.id))) {
            stored.unshift({
              id: userObj.id,
              stallName: userObj.stallName || `${name}'s Organic Farm`,
              stallNumber: userObj.stallNumber || 'Stall #A-05',
              stallCategory: 'Organic Vegetables & Produce',
              stallItems: 'Fresh organic farm produce',
              contactPerson: name,
              email: email,
              phone: userObj.phone || '+92 300 1234567',
              city: userObj.city || 'Lahore',
              country: userObj.country || 'Pakistan',
              marketName: 'Selected Farmers Market',
              operatingDays: ['Saturday', 'Sunday'],
              status: 'Pending Approval'
            });
            localStorage.setItem('marketlink_registered_farmers', JSON.stringify(stored));
          }
        } catch (e) {}
      }

      // If pending farmer data exists, update the backend profile
      if (role === 'farmer' && (pendingFarmer.farm_name || pendingFarmer.market_id)) {
        import('../services/api').then(({ farmerAPI }) => {
          farmerAPI.updateProfile({
            farm_name: pendingFarmer.farm_name,
            stall_number: pendingFarmer.stall_number,
            stall_name: pendingFarmer.farm_name,
            market_id: pendingFarmer.market_id,
            city: pendingFarmer.city,
            country: pendingFarmer.country,
            phone: pendingFarmer.phone
          }).catch(() => {});
        }).catch(() => {});
      }

      setTimeout(() => {
        if (role === 'farmer') {
          navigate('/farmer');
        } else if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/customer');
        }
      }, 700);
    } else {
      setError('Invalid authentication response from Google.');
    }
  }, [searchParams, navigate, handleGoogleCallbackSession]);

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8faf7',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        textAlign: 'center'
      }}>
        {error ? (
          <div>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem',
              fontWeight: 700
            }}>
              !
            </div>
            <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Authentication Notice</h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {error}
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                backgroundColor: '#2b4226',
                color: '#ffffff',
                padding: '10px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <div>
            <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem', marginBottom: '1.25rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Google Authentication</h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
