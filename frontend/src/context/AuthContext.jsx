/**
 * MarketLink - Authentication & Session Context
 * User authentication and session management provider
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'marketlink_auth_user';
const TOKEN_KEY = 'marketlink_token';

function formatAuthUser(user, defaultRole = 'customer') {
  if (!user) return null;
  const role = user.role || defaultRole;
  const isFarmer = role === 'farmer';
  const profile = user.farmer_profile || user.farmerProfile || user.farmer || {};

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role,
    stallName: profile.farm_name || user.stallName || user.farm_name || user.stall_name || (isFarmer ? `${user.name}'s Farm Stall` : undefined),
    stallNumber: profile.stall_number || user.stallNumber || user.stall_number || (isFarmer ? 'Stall #A-04' : undefined),
    stallCategory: profile.stall_category || user.stallCategory || user.stall_category || '',
    stallItems: profile.stall_items || user.stallItems || user.stall_items || '',
    operatingDays: profile.operating_days || user.operatingDays || ['Saturday', 'Sunday'],
    marketId: profile.market_id || user.marketId || 1,
    marketName: profile.market?.name || user.marketName || 'Liberty Farmers Market',
    city: user.city || profile.city || '',
    country: user.country || profile.country || 'Pakistan',
    bio: profile.bio || user.bio || '',
    approvalStatus: profile.approval_status || user.approvalStatus || (isFarmer ? 'pending' : 'approved'),
    farmerProfile: profile,
    avatar: user.avatar || (isFarmer ? '/img/testimonial-2.jpg' : role === 'admin' ? '/img/testimonial-3.jpg' : '/img/testimonial-1.jpg')
  };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync user object to local cache
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage unavailable
    }
  }, [currentUser]);

  // Restore authenticated session from backend on page load
  useEffect(() => {
    let isMounted = true;
    async function restoreSession() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken && !savedToken.startsWith('offline_')) {
        try {
          const res = await authAPI.getMe();
          if (isMounted && res.success && res.user) {
            const formatted = formatAuthUser(res.user);
            setCurrentUser(formatted);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formatted));
          } else if (isMounted && res.status === 401) {
            // Only clear session if token is explicitly rejected as unauthorized (401)
            setCurrentUser(null);
            setToken(null);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch {
          // Keep current stored user session during temporary network hiccups
        }
      }
    }
    restoreSession();
    return () => { isMounted = false; };
  }, []);

  const switchRole = () => {};

  const updateCurrentUser = (partial) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Authenticate with Laravel Sanctum (POST /api/login)
  const loginWithCredentials = async (email, password, captcha_answer, captcha_key) => {
    setLoading(true);
    try {
      const res = await authAPI.login({
        email,
        password,
        captcha_key,
        captcha_answer
      });

      if (res.success && res.user) {
        const formattedUser = formatAuthUser(res.user);
        setCurrentUser(formattedUser);
        setToken(res.token);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formattedUser));
        localStorage.setItem(TOKEN_KEY, res.token);
        return { success: true, user: formattedUser };
      }

      const errorMessage = res.message || (res.errors ? Object.values(res.errors).flat().join(', ') : 'Invalid credentials or security code.');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register User via Laravel Sanctum (POST /api/register)
  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(userData);
      if (res.success && res.user) {
        const formattedUser = formatAuthUser(res.user, userData.role);
        setCurrentUser(formattedUser);
        setToken(res.token);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formattedUser));
        localStorage.setItem(TOKEN_KEY, res.token);
        return { success: true, user: formattedUser };
      }

      const errorMessage = res.message || (res.errors ? Object.values(res.errors).flat().join(', ') : 'Registration failed. Please check inputs.');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign in or Register via Google OAuth
  const loginWithGoogle = async (googleProfile = {}, preferredRole = 'customer') => {
    setLoading(true);
    try {
      const role = googleProfile.role || preferredRole || 'customer';
      const isFarmer = role === 'farmer';

      const payload = {
        name: googleProfile.name || (isFarmer ? 'Tariq Mehmood' : 'Hamza Ali'),
        email: googleProfile.email || (isFarmer ? 'tariq.google@punjabfarm.com' : 'hamza.google@gmail.com'),
        role,
        farm_name: googleProfile.farm_name || (isFarmer ? 'Punjab Green Organics' : undefined),
        stall_number: googleProfile.stall_number || (isFarmer ? 'Stall #A-04' : undefined),
        phone: googleProfile.phone || '+92 300 1234567',
        avatar: googleProfile.avatar || (isFarmer ? '/img/testimonial-2.jpg' : '/img/testimonial-1.jpg')
      };

      const res = await authAPI.googleAuth(payload);

      if (res.success && res.user) {
        const formattedUser = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone || payload.phone,
          role: res.user.role || role,
          stallName: res.user.stallName || res.user.stall_name || payload.farm_name || (isFarmer ? 'Punjab Green Organics' : undefined),
          stallNumber: res.user.stallNumber || res.user.stall_number || payload.stall_number || (isFarmer ? 'Stall #A-04' : undefined),
          avatar: res.user.avatar || payload.avatar,
          authProvider: 'google'
        };

        setCurrentUser(formattedUser);
        setToken(res.token);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formattedUser));
        localStorage.setItem(TOKEN_KEY, res.token);
        return { success: true, user: formattedUser };
      }

      return { success: false, error: res.message || 'Google authentication failed.' };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to authenticate with Google.' };
    } finally {
      setLoading(false);
    }
  };

  // Logout and revoke Sanctum token
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Offline fallback
    }
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Handle session persistence from Google OAuth callback
  const handleGoogleCallbackSession = (userObj, authToken) => {
    setCurrentUser(userObj);
    setToken(authToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
    localStorage.setItem(TOKEN_KEY, authToken);
  };

  const value = {
    currentUser,
    token,
    loading,
    role: currentUser?.role || 'guest',
    isAuthenticated: Boolean(currentUser),
    isCustomer: currentUser?.role === 'customer',
    isFarmer: currentUser?.role === 'farmer',
    isAdmin: currentUser?.role === 'admin',
    switchRole,
    loginWithCredentials,
    registerUser,
    loginWithGoogle,
    handleGoogleCallbackSession,
    updateCurrentUser,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
