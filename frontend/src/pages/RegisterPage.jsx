import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#1b3d16',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            padding: '8px 18px',
            borderRadius: '20px',
            background: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            border: '1px solid #dce8db',
          }}
        >
          ← Return to Market
        </Link>
      </div>

      <AuthModal isOpen={true} onClose={() => navigate('/')} defaultMode="register" />
    </div>
  );
}
