import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '', showLabel = false, compact = false }) {
  const { isDark, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`d-inline-flex align-items-center ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={toggleTheme}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle Dark and Light mode"
        style={{
          position: 'relative',
          width: compact ? '48px' : '54px',
          height: compact ? '26px' : '28px',
          borderRadius: '50px',
          border: isDark ? '1.5px solid #475569' : '1.5px solid #94a3b8',
          background: isDark
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
          cursor: 'pointer',
          padding: 0,
          outline: 'none',
          boxShadow: isHovered
            ? (isDark ? '0 0 10px rgba(99, 102, 241, 0.45)' : '0 0 10px rgba(56, 189, 248, 0.45)')
            : 'inset 0 2px 4px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        {/* Background track icons */}
        <span
          style={{
            position: 'absolute',
            left: '6px',
            fontSize: compact ? '9px' : '10px',
            color: 'rgba(255, 255, 255, 0.9)',
            opacity: isDark ? 0 : 1,
            transition: 'opacity 0.25s ease',
            pointerEvents: 'none'
          }}
        >
          <i className="fa fa-sun"></i>
        </span>
        <span
          style={{
            position: 'absolute',
            right: '6px',
            fontSize: compact ? '9px' : '10px',
            color: 'rgba(255, 255, 255, 0.85)',
            opacity: isDark ? 1 : 0,
            transition: 'opacity 0.25s ease',
            pointerEvents: 'none'
          }}
        >
          <i className="fa fa-moon"></i>
        </span>

        {/* Sliding thumb knob */}
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: isDark
              ? (compact ? '24px' : '28px')
              : '2px',
            width: compact ? '20px' : '22px',
            height: compact ? '20px' : '22px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)',
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}
        >
          {isDark ? (
            <i
              className="fa fa-moon"
              style={{
                fontSize: compact ? '9px' : '10px',
                color: '#6366f1',
                transform: 'rotate(-15deg)'
              }}
            ></i>
          ) : (
            <i
              className="fa fa-sun"
              style={{
                fontSize: compact ? '9px' : '10px',
                color: '#f59e0b'
              }}
            ></i>
          )}
        </div>
      </button>

      {showLabel && (
        <span className="small fw-semibold ms-2" style={{ fontSize: '0.8rem' }}>
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </div>
  );
}
