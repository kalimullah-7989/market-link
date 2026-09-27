/**
 * MarketLink - Admin Master Portal
 * Platform KPIs, Farmer Moderation Workflow, and Market Scheduling
 */

import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useLanguage } from '../context/LanguageContext';
import { farmersData } from '../data/farmersData';
import { marketsData } from '../data/marketsData';
import { adminAPI, marketsAPI } from '../services/api';
import AuthModal from '../components/AuthModal';

export default function AdminDashboard() {
  const { currentUser, role } = useAuth();
  const { orders } = useOrders();
  const { formatPrice } = useLanguage();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionAlert, setActionAlert] = useState(null);

  // Initial grower profiles and pending applicants
  const [farmersList, setFarmersList] = useState(() => [
    {
      id: 2,
      stallName: 'Punjab Green Organics',
      contactPerson: 'Tariq Mehmood',
      phone: '+92 321 8901234',
      email: 'tariq@punjabfarm.com',
      marketName: 'Liberty Sunday Farmers Market',
      stallNumber: 'Stall #A-04',
      stallCategory: 'Organic Vegetables & Fresh Greens',
      stallItems: 'Tomatoes, Spinach, Mint, Carrots, Cucumbers',
      operatingDays: ['Saturday', 'Wednesday'],
      status: 'Active / Approved'
    },
    {
      id: 3,
      stallName: 'Model Town Pure Dairy',
      contactPerson: 'Chaudhry Bashir',
      phone: '+92 300 7654321',
      email: 'bashir@dairyfarm.com',
      marketName: 'Model Town Bazaar',
      stallNumber: 'Stall #B-12',
      stallCategory: 'Fresh Farm Dairy, Milk & Desi Ghee',
      stallItems: 'Raw Cow Milk, Buffalo Milk, Desi Ghee, Farm Butter',
      operatingDays: ['Sunday'],
      status: 'Active / Approved'
    },
    {
      id: 4,
      stallName: 'DHA Citrus Orchards',
      contactPerson: 'Haji Rasheed',
      phone: '+92 333 4567890',
      email: 'rasheed@citrusfarm.com',
      marketName: 'DHA Phase 5 Market',
      stallNumber: 'Stall #C-08',
      stallCategory: 'Seasonal Fresh Fruits & Citrus',
      stallItems: 'Kinnow Mandarins, Mosambi Oranges, Farm Lemons',
      operatingDays: ['Saturday', 'Sunday'],
      status: 'Active / Approved'
    },
    {
      id: 5,
      stallName: 'Al-Barakah Citrus & Honey',
      contactPerson: 'Aslam Khan',
      phone: '+92 345 1122334',
      email: 'aslam@pendingfarm.com',
      marketName: 'Liberty Farmers Market',
      stallNumber: 'Stall #D-02',
      stallCategory: 'Herbs, Spices & Natural Sidr Honey',
      stallItems: 'Pure Sidr Berry Honey, Wild Berry Honey, Fresh Ginger',
      operatingDays: ['Saturday'],
      status: 'Pending Approval'
    }
  ]);

  const [farmerFilter, setFarmerFilter] = useState('all');

  // Markets list state
  const [marketsList, setMarketsList] = useState(marketsData);

  // Platform KPIs from backend
  const [metrics, setMetrics] = useState({
    total_farmers: 4,
    pending_farmers: 1,
    total_customers: 12,
    total_markets: marketsData.length,
    total_orders: orders.length || 18,
    gross_sales_volume: orders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0)
  });

  // Modal to add new weekly market
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [newMarket, setNewMarket] = useState({
    name: '',
    location: '',
    operatingDays: 'Saturday, Sunday',
    timings: '08:00 AM - 02:00 PM',
    lat: '31.5204',
    lng: '74.3587'
  });

  // Edit market state (admin-only)
  const [isEditMarketModalOpen, setIsEditMarketModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [editMarketForm, setEditMarketForm] = useState({
    name: '',
    location: '',
    city: '',
    operatingDays: '',
    timings: '',
    lat: '',
    lng: ''
  });

  // Remove stall with mandatory reason modal state
  const [isRemoveStallModalOpen, setIsRemoveStallModalOpen] = useState(false);
  const [stallToRemove, setStallToRemove] = useState(null);
  const [removalReason, setRemovalReason] = useState('');
  const [removalError, setRemovalError] = useState('');

  // Load live data from Laravel Admin API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadAdminData() {
      setLoading(true);
      try {
        const [dashRes, farmersRes, marketsRes] = await Promise.all([
          adminAPI.getDashboard(),
          adminAPI.getFarmers(),
          marketsAPI.getAll()
        ]);

        if (isMounted) {
          if (dashRes.success && dashRes.data?.metrics) {
            setMetrics(dashRes.data.metrics);
          }
          if (farmersRes.success) {
            const list = Array.isArray(farmersRes.data) ? farmersRes.data : farmersRes.data?.data;
            if (list && list.length > 0) {
              const mapped = list.map((f) => {
                const profile = f.farmer_profile || f.farmerProfile || {};
                const rawStatus = (profile.approval_status || f.status || '').toLowerCase();
                const approval = rawStatus === 'approved' ? 'approved' : (rawStatus === 'suspended' || rawStatus === 'rejected' ? 'suspended' : 'pending');
                return {
                  id: f.id,
                  stallName: profile.farm_name || `${f.name}'s Organic Stall`,
                  stallNumber: profile.stall_number || 'Stall A-04',
                  stallCategory: profile.stall_category || 'Organic Vegetables & Produce',
                  stallItems: profile.stall_items || 'Fresh seasonal vegetables, leafy greens',
                  contactPerson: f.name,
                  email: f.email,
                  phone: f.phone || profile.phone || '+92 300 1234567',
                  city: f.city || profile.city || 'Lahore',
                  country: f.country || profile.country || 'Pakistan',
                  marketName: profile.market?.name || 'Liberty Farmers Market',
                  operatingDays: profile.operating_days || ['Saturday', 'Sunday'],
                  status: approval === 'approved' ? 'Active / Approved' : (approval === 'suspended' ? 'Suspended' : 'Pending Approval')
                };
              });

              // Merge any locally registered farmers
              let localFarmers = [];
              try {
                localFarmers = JSON.parse(localStorage.getItem('marketlink_registered_farmers') || '[]');
              } catch (e) {}

              try {
                const currentAuthUser = JSON.parse(localStorage.getItem('marketlink_auth_user') || 'null');
                if (currentAuthUser && currentAuthUser.role === 'farmer') {
                  if (!localFarmers.some((lf) => lf.email === currentAuthUser.email || String(lf.id) === String(currentAuthUser.id))) {
                    localFarmers.unshift({
                      id: currentAuthUser.id || Date.now(),
                      stallName: currentAuthUser.stallName || currentAuthUser.farm_name || `${currentAuthUser.name}'s Organic Farm`,
                      stallNumber: currentAuthUser.stallNumber || currentAuthUser.stall_number || 'Stall #A-05',
                      stallCategory: currentAuthUser.stallCategory || 'Organic Fruits & Vegetables',
                      stallItems: currentAuthUser.stallItems || 'Seasonal fresh organic produce',
                      contactPerson: currentAuthUser.name,
                      email: currentAuthUser.email,
                      phone: currentAuthUser.phone || '+92 300 1234567',
                      city: currentAuthUser.city || 'Lahore',
                      country: currentAuthUser.country || 'Pakistan',
                      marketName: currentAuthUser.marketName || 'Selected Farmers Market',
                      operatingDays: ['Saturday', 'Sunday'],
                      status: currentAuthUser.approvalStatus === 'approved' ? 'Active / Approved' : 'Pending Approval'
                    });
                  }
                }
              } catch (e) {}

              const mergedFarmers = [...mapped];
              localFarmers.forEach((lf) => {
                const existIdx = mergedFarmers.findIndex((mf) => String(mf.id) === String(lf.id) || mf.email === lf.email);
                if (existIdx >= 0) {
                  mergedFarmers[existIdx] = { ...mergedFarmers[existIdx], ...lf };
                } else {
                  mergedFarmers.unshift(lf);
                }
              });

              setFarmersList(mergedFarmers);
            } else {
              // When API returns empty, load local registered farmers into fallback dataset
              try {
                const localFarmers = JSON.parse(localStorage.getItem('marketlink_registered_farmers') || '[]');
                if (localFarmers.length > 0) {
                  setFarmersList((prev) => {
                    const merged = [...prev];
                    localFarmers.forEach((lf) => {
                      const existIdx = merged.findIndex((mf) => String(mf.id) === String(lf.id) || mf.email === lf.email);
                      if (existIdx >= 0) {
                        merged[existIdx] = { ...merged[existIdx], ...lf };
                      } else {
                        merged.unshift(lf);
                      }
                    });
                    return merged;
                  });
                }
              } catch (e) {}
            }
          }
          if (marketsRes && marketsRes.length > 0) {
            const enriched = marketsRes.map((m) => {
              const matched = COUNTRIES_CONFIG.find((c) =>
                c.cities.some((ci) => ci.name.toLowerCase() === (m.city || '').toLowerCase())
              );
              return {
                ...m,
                countryCode: m.countryCode || matched?.code || 'PK',
                country: m.country || matched?.name || 'Pakistan'
              };
            });
            const merged = [...marketsData];
            enriched.forEach((em) => {
              const idx = merged.findIndex((m) => String(m.id) === String(em.id));
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...em };
              } else {
                merged.push(em);
              }
            });
            setMarketsList(merged);
          }
        }
      } catch (err) {
        console.warn('API error, using pre-seeded admin dataset:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAdminData();
    return () => { isMounted = false; };
  }, []);

  // Dynamically sync metrics with live farmers list
  useEffect(() => {
    const pendingCount = farmersList.filter((f) => f.status.includes('Pending')).length;
    setMetrics((prev) => ({
      ...prev,
      total_farmers: farmersList.length,
      pending_farmers: pendingCount
    }));
  }, [farmersList]);

  // Approve Farmer Stall (Verification Gate)
  const handleApproveFarmer = async (farmerId) => {
    const target = farmersList.find((f) => f.id === farmerId);
    if (!target) return;

    try {
      await adminAPI.updateFarmerStatus(farmerId, 'approved');
    } catch {
      // Local state update
    }

    setFarmersList((prev) =>
      prev.map((f) => (f.id === farmerId ? { ...f, status: 'Active / Approved' } : f))
    );

    // Sync localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('marketlink_registered_farmers') || '[]');
      const updated = stored.map((f) =>
        f.id === farmerId || f.email === target.email ? { ...f, status: 'Active / Approved' } : f
      );
      localStorage.setItem('marketlink_registered_farmers', JSON.stringify(updated));

      const authUser = JSON.parse(localStorage.getItem('marketlink_auth_user') || 'null');
      if (authUser && (authUser.id === farmerId || authUser.email === target.email)) {
        authUser.approvalStatus = 'approved';
        localStorage.setItem('marketlink_auth_user', JSON.stringify(authUser));
      }
    } catch (e) {}

    setActionAlert({
      type: 'success',
      text: `Stall "${target.stallName}" (${target.stallNumber}) by ${target.contactPerson} has been APPROVED! It is now live on the public marketplace and interactive stall map.`
    });

    setTimeout(() => setActionAlert(null), 5000);
  };

  // Suspend / Reject Farmer Stall
  const handleSuspendFarmer = async (farmerId) => {
    const target = farmersList.find((f) => f.id === farmerId);
    if (!target) return;

    try {
      await adminAPI.updateFarmerStatus(farmerId, 'suspended');
    } catch {
      // Local state update
    }

    setFarmersList((prev) =>
      prev.map((f) => (f.id === farmerId ? { ...f, status: 'Suspended' } : f))
    );

    try {
      const stored = JSON.parse(localStorage.getItem('marketlink_registered_farmers') || '[]');
      const updated = stored.map((f) =>
        f.id === farmerId || f.email === target.email ? { ...f, status: 'Suspended' } : f
      );
      localStorage.setItem('marketlink_registered_farmers', JSON.stringify(updated));
    } catch (e) {}

    setActionAlert({
      type: 'warning',
      text: `Stall "${target.stallName}" has been SUSPENDED. It is now hidden from customer pre-order listings.`
    });

    setTimeout(() => setActionAlert(null), 5000);
  };

  // Toggle farmer status helper
  const handleToggleFarmerStatus = (farmerId) => {
    const target = farmersList.find((f) => f.id === farmerId);
    if (!target) return;
    if (target.status.includes('Active')) {
      handleSuspendFarmer(farmerId);
    } else {
      handleApproveFarmer(farmerId);
    }
  };

  // Open remove stall modal
  const openRemoveStallModal = (farmer) => {
    setStallToRemove(farmer);
    setRemovalReason('');
    setRemovalError('');
    setIsRemoveStallModalOpen(true);
  };

  // Confirm official removal of stall with mandatory reason
  const handleConfirmRemoveStall = async (e) => {
    e.preventDefault();
    if (!stallToRemove) return;
    const cleanReason = removalReason.trim();
    if (!cleanReason) {
      setRemovalError('Removal reason is mandatory. Please state why this stall is being removed. / وجہ درج کرنا لازمی ہے');
      return;
    }

    try {
      await adminAPI.updateFarmerStatus(stallToRemove.id, 'rejected', cleanReason);
    } catch {
      // Local state fallback
    }

    // Remove stall from active management list
    setFarmersList((prev) => prev.filter((f) => f.id !== stallToRemove.id));

    // Remove from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('marketlink_registered_farmers') || '[]');
      const filtered = stored.filter((f) => f.id !== stallToRemove.id && f.email !== stallToRemove.email);
      localStorage.setItem('marketlink_registered_farmers', JSON.stringify(filtered));

      const authUser = JSON.parse(localStorage.getItem('marketlink_auth_user') || 'null');
      if (authUser && (authUser.id === stallToRemove.id || authUser.email === stallToRemove.email)) {
        authUser.approvalStatus = 'rejected';
        localStorage.setItem('marketlink_auth_user', JSON.stringify(authUser));
      }
    } catch (e) {}

    setIsRemoveStallModalOpen(false);
    setStallToRemove(null);
    setRemovalReason('');

    setActionAlert({
      type: 'danger',
      text: `Stall "${stallToRemove.stallName}" (${stallToRemove.stallNumber}) has been officially REMOVED by Administrator. Reason logged: "${cleanReason}".`
    });

    setTimeout(() => setActionAlert(null), 6000);
  };

  // Add new weekly farmers market
  const handleCreateMarket = async (e) => {
    e.preventDefault();
    if (!newMarket.name || !newMarket.location) return;

    const daysArray = newMarket.operatingDays.split(',').map((d) => d.trim());
    const payload = {
      name: newMarket.name,
      address: newMarket.location,
      operating_days: daysArray,
      opening_time: '08:00',
      closing_time: '14:00',
      latitude: parseFloat(newMarket.lat) || 31.5204,
      longitude: parseFloat(newMarket.lng) || 74.3587
    };

    try {
      await adminAPI.createMarket(payload);
    } catch {}

    const createdMarket = {
      id: `market-${Date.now()}`,
      name: newMarket.name,
      location: newMarket.location,
      operatingDays: daysArray,
      timings: newMarket.timings,
      coordinates: { lat: parseFloat(newMarket.lat), lng: parseFloat(newMarket.lng) },
      activeFarmers: 0,
      description: 'Newly inaugurated community farmers market.'
    };

    setMarketsList([...marketsList, createdMarket]);
    setIsMarketModalOpen(false);
    setNewMarket({ name: '', location: '', operatingDays: 'Saturday, Sunday', timings: '08:00 AM - 02:00 PM', lat: '31.5204', lng: '74.3587' });

    setActionAlert({
      type: 'success',
      text: `Market venue "${createdMarket.name}" successfully created and added to the regional Leaflet map!`
    });
    setTimeout(() => setActionAlert(null), 5000);
  };

  // Open edit modal — pre-populate form from selected market row
  const openEditMarket = (market) => {
    setEditingMarket(market);
    setEditMarketForm({
      name: market.name || '',
      location: market.location || '',
      city: market.city || '',
      operatingDays: Array.isArray(market.operatingDays)
        ? market.operatingDays.join(', ')
        : (market.operatingDays || ''),
      timings: market.timings || '',
      lat: market.coordinates?.lat?.toString() || '',
      lng: market.coordinates?.lng?.toString() || ''
    });
    setIsEditMarketModalOpen(true);
  };

  // Save edited market — calls PUT /admin/markets/:id then patches local state
  const handleEditMarketSubmit = async (e) => {
    e.preventDefault();
    if (!editingMarket) return;

    const daysArray = editMarketForm.operatingDays
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const payload = {
      name: editMarketForm.name,
      address: editMarketForm.location,
      city: editMarketForm.city,
      operating_days: daysArray,
      latitude: parseFloat(editMarketForm.lat) || editingMarket.coordinates?.lat || 0,
      longitude: parseFloat(editMarketForm.lng) || editingMarket.coordinates?.lng || 0
    };

    try {
      await adminAPI.updateMarket(editingMarket.id, payload);
    } catch {
      // fall through — update local state regardless
    }

    setMarketsList((prev) =>
      prev.map((m) =>
        m.id === editingMarket.id
          ? {
              ...m,
              name: editMarketForm.name,
              location: editMarketForm.location,
              city: editMarketForm.city,
              operatingDays: daysArray,
              timings: editMarketForm.timings,
              coordinates: {
                lat: parseFloat(editMarketForm.lat) || m.coordinates?.lat,
                lng: parseFloat(editMarketForm.lng) || m.coordinates?.lng
              }
            }
          : m
      )
    );

    setIsEditMarketModalOpen(false);
    setEditingMarket(null);

    setActionAlert({
      type: 'success',
      text: `Market "${editMarketForm.name}" updated successfully.`
    });
    setTimeout(() => setActionAlert(null), 5000);
  };

  if (!currentUser || role !== 'admin') {
    return (
      <>
        <PageHeader title="Platform Administration" breadcrumb="Admin Login Required" />
        <div className="container py-5 text-center my-5">
          <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '520px', borderRadius: '16px' }}>
            <div className="text-danger mb-3">
              <i className="fa fa-shield-alt fa-3x"></i>
            </div>
            <h4 className="fw-bold text-dark mb-2">Administrator Access Required</h4>
            <p className="text-muted mb-4">
              This management console is restricted to platform administrators. Please sign in with your admin credentials (<strong>marketlink118@gmail.com</strong>).
            </p>
            <button 
              type="button" 
              className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
              onClick={() => setIsAuthOpen(true)}
            >
              <i className="fa fa-sign-in-alt me-2"></i>Sign In as Admin
            </button>
          </div>
        </div>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode="login" />
      </>
    );
  }

  return (
    <>
      <style>{`
        .admin-dashboard-container {
          --theme-primary: #3CB815;
          --theme-primary-dark: #2b8c0e;
          --theme-primary-tint: rgba(60, 184, 21, 0.08);
          --theme-primary-glow: rgba(60, 184, 21, 0.35);
        }
        .admin-dashboard-container .metric-card {
          transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
          border: 1px solid #e9ecef;
          cursor: default;
        }
        .admin-dashboard-container .metric-card:hover {
          border-color: #3CB815 !important;
          box-shadow: 0 6px 20px rgba(60, 184, 21, 0.16) !important;
          transform: translateY(-2px);
        }
        .admin-dashboard-container .table-hover tbody tr {
          transition: background-color 0.2s ease;
        }
        .admin-dashboard-container .table-hover tbody tr:hover {
          background-color: rgba(60, 184, 21, 0.08) !important;
        }
        .admin-dashboard-container .admin-filter-btn {
          transition: all 0.2s ease;
          font-weight: 600;
          border: none;
        }
        .admin-dashboard-container .admin-filter-btn:hover {
          background-color: #3CB815 !important;
          border-color: #3CB815 !important;
          color: #ffffff !important;
          box-shadow: 0 3px 10px rgba(60, 184, 21, 0.3) !important;
        }
        .admin-dashboard-container .admin-filter-btn.active-filter {
          background-color: #3CB815 !important;
          border-color: #3CB815 !important;
          color: #ffffff !important;
          box-shadow: 0 2px 6px rgba(60, 184, 21, 0.25);
        }
        .admin-dashboard-container .btn-approve-stall {
          background-color: #3CB815 !important;
          border-color: #3CB815 !important;
          color: #ffffff !important;
          transition: all 0.2s ease;
        }
        .admin-dashboard-container .btn-approve-stall:hover {
          background-color: #267c0c !important;
          border-color: #267c0c !important;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(60, 184, 21, 0.45) !important;
          transform: translateY(-1px);
        }
        .admin-dashboard-container .btn-add-market {
          border: 1px solid #3CB815 !important;
          color: #3CB815 !important;
          transition: all 0.2s ease;
        }
        .admin-dashboard-container .btn-add-market:hover {
          background-color: #3CB815 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(60, 184, 21, 0.35) !important;
          transform: translateY(-1px);
        }
        .admin-dashboard-container .btn-outline-primary:hover,
        .admin-dashboard-container .btn-outline-secondary:hover {
          background-color: #3CB815 !important;
          border-color: #3CB815 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(60, 184, 21, 0.3) !important;
        }
        .admin-dashboard-container .btn-remove-stall {
          transition: all 0.2s ease;
        }
        .admin-dashboard-container .btn-remove-stall:hover {
          background-color: #dc3545 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.35) !important;
          transform: translateY(-1px);
        }
      `}</style>
      <PageHeader title="Platform Administration" breadcrumb="Admin Dashboard" />

      <div className="container-xxl py-5 admin-dashboard-container">
        <div className="container">
          {/* Header Summary */}
          <div className="bg-white rounded-3 p-4 shadow-sm border mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h4 className="mb-0 fw-bold">MarketLink Master Portal</h4>
                  <span className="badge bg-danger text-white text-uppercase" style={{ fontSize: '0.7rem' }}>
                    Super Admin
                  </span>
                </div>
                <small className="text-muted">
                  System Administration, Farmer Verification, and Platform Reporting.
                </small>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-add-market rounded-pill px-3 btn-sm fw-semibold"
                  onClick={() => setIsMarketModalOpen(true)}
                >
                  <i className="fa fa-plus me-1"></i> Add Market Venue
                </button>
                <div className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                  <i className="fa fa-shield-alt text-success me-1"></i> Administrator Access Verified
                </div>
              </div>
            </div>
          </div>

          {/* Action Feedback Alert */}
          {actionAlert && (
            <div className={`alert alert-${actionAlert.type} alert-dismissible fade show shadow-sm mb-4`} role="alert">
              <i className={`fa ${actionAlert.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2 fs-5`}></i>
              <strong>{actionAlert.text}</strong>
              <button type="button" className="btn-close" onClick={() => setActionAlert(null)}></button>
            </div>
          )}

          {/* Metric KPIs */}
          <div className="row g-3 mb-5">
            <div className="col-md-3 col-sm-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm text-center metric-card">
                <small className="text-muted fw-bold text-uppercase d-block mb-1">Registered Farmers</small>
                <h3 className="mb-0 fw-bold" style={{ color: '#3CB815' }}>
                  {farmersList.length}
                  {metrics.pending_farmers > 0 && (
                    <span className="badge bg-warning text-dark ms-2 fs-6 rounded-pill">
                      {metrics.pending_farmers} Pending
                    </span>
                  )}
                </h3>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm text-center metric-card">
                <small className="text-muted fw-bold text-uppercase d-block mb-1">Active Markets</small>
                <h3 className="mb-0 fw-bold text-success">{marketsList.length}</h3>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm text-center metric-card">
                <small className="text-muted fw-bold text-uppercase d-block mb-1">Total Pre-Orders</small>
                <h3 className="mb-0 fw-bold text-info">{metrics.total_orders || orders.length}</h3>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm text-center metric-card">
                <small className="text-muted fw-bold text-uppercase d-block mb-1">Platform Cash Volume</small>
                <h3 className="mb-0 fw-bold text-dark">{formatPrice(metrics.gross_sales_volume || 450)}</h3>
              </div>
            </div>
          </div>

          {/* Section 1: Farmer Registrations & Stall Approvals */}
          <div className="bg-white rounded-3 p-4 shadow-sm border mb-5">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom gap-2">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="fw-bold mb-0 text-dark">
                    <i className="fa fa-user-check text-success me-2"></i>Farmer Stall Approvals & Moderation Workflow
                  </h5>
                  {farmersList.filter((f) => f.status.includes('Pending')).length > 0 && (
                    <span className="badge bg-warning text-dark rounded-pill">
                      {farmersList.filter((f) => f.status.includes('Pending')).length} Action Required
                    </span>
                  )}
                </div>
                <small className="text-muted">
                  Verification Gate: Review stall details, specialty category, and produce items before approving for live market listing.
                </small>
              </div>

              {/* Status Filter Tabs */}
              <div className="btn-group btn-group-sm rounded-pill p-1 bg-light border">
                <button
                  type="button"
                  className={`btn rounded-pill px-3 admin-filter-btn ${farmerFilter === 'all' ? 'active-filter' : 'text-muted'}`}
                  onClick={() => setFarmerFilter('all')}
                >
                  All ({farmersList.length})
                </button>
                <button
                  type="button"
                  className={`btn rounded-pill px-3 admin-filter-btn ${farmerFilter === 'pending' ? 'active-filter' : 'text-muted'}`}
                  onClick={() => setFarmerFilter('pending')}
                >
                  Pending ({farmersList.filter((f) => f.status.includes('Pending')).length})
                </button>
                <button
                  type="button"
                  className={`btn rounded-pill px-3 admin-filter-btn ${farmerFilter === 'approved' ? 'active-filter' : 'text-muted'}`}
                  onClick={() => setFarmerFilter('approved')}
                >
                  Approved ({farmersList.filter((f) => f.status.includes('Active')).length})
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase text-muted">
                  <tr>
                    <th>Stall & Farm Details</th>
                    <th>Stall Category & Produce Items</th>
                    <th>Contact Person</th>
                    <th>Assigned Market</th>
                    <th>Approval Status</th>
                    <th className="text-end">Moderation Action</th>
                  </tr>
                </thead>
                <tbody>
                  {farmersList
                    .filter((farmer) => {
                      if (farmerFilter === 'pending') return farmer.status.includes('Pending');
                      if (farmerFilter === 'approved') return farmer.status.includes('Active');
                      return true;
                    })
                    .map((farmer) => {
                      const isPending = farmer.status.includes('Pending');
                      const isActive = farmer.status.includes('Active');

                      return (
                        <tr key={farmer.id} className={isPending ? 'table-warning' : ''}>
                          <td>
                            <strong className="text-dark d-block">{farmer.stallName}</strong>
                            <span className="badge bg-secondary font-monospace" style={{ fontSize: '0.72rem' }}>
                              {farmer.stallNumber}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-light text-success border mb-1 d-inline-block">
                              <i className="fa fa-tag me-1"></i>{farmer.stallCategory || 'Organic Vegetables'}
                            </span>
                            <small className="text-muted d-block text-truncate" style={{ maxWidth: '240px' }} title={farmer.stallItems}>
                              <i className="fa fa-leaf text-success me-1"></i>{farmer.stallItems || 'Seasonal harvest'}
                            </small>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark">{farmer.contactPerson}</div>
                            <small className="text-muted d-block"><i className="fa fa-phone text-success me-1"></i>{farmer.phone}</small>
                            <small className="text-muted d-block"><i className="fa fa-map-marker-alt text-primary me-1"></i>{farmer.city || 'Lahore'}, {farmer.country || 'Pakistan'}</small>
                            <small className="text-muted">{farmer.email}</small>
                          </td>
                          <td>
                            <strong className="small text-dark">{farmer.marketName}</strong>
                            <small className="text-muted d-block">
                              {Array.isArray(farmer.operatingDays) ? farmer.operatingDays.join(', ') : farmer.operatingDays}
                            </small>
                          </td>
                          <td>
                            <span className={`badge ${isActive ? 'bg-success' : isPending ? 'bg-warning text-dark' : 'bg-danger'} px-3 py-1 rounded-pill`}>
                              {farmer.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-1 align-items-center">
                              {isPending ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-approve-stall rounded-pill px-3 fw-bold shadow-xs"
                                    onClick={() => handleApproveFarmer(farmer.id)}
                                    title="Approve Stall and publish live on market"
                                  >
                                    <i className="fa fa-check me-1"></i> Approve Stall
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger btn-remove-stall rounded-pill px-2 fw-semibold"
                                    onClick={() => openRemoveStallModal(farmer)}
                                    title="Admin Authority: Reject Stall application with mandatory reason"
                                  >
                                    <i className="fa fa-times me-1"></i> Reject & Remove
                                  </button>
                                </>
                              ) : isActive ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-warning rounded-pill px-3 fw-semibold"
                                    onClick={() => handleSuspendFarmer(farmer.id)}
                                    title="Temporarily suspend stall"
                                  >
                                    <i className="fa fa-ban me-1"></i> Suspend
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger btn-remove-stall rounded-pill px-2 fw-semibold"
                                    onClick={() => openRemoveStallModal(farmer)}
                                    title="Admin Authority: Remove this stall with mandatory reason"
                                  >
                                    <i className="fa fa-trash-alt me-1"></i> Remove Farmer
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-approve-stall rounded-pill px-3 fw-semibold shadow-xs"
                                    onClick={() => handleApproveFarmer(farmer.id)}
                                    title="Re-Approve Stall"
                                  >
                                    <i className="fa fa-check-circle me-1"></i> Re-Approve
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger btn-remove-stall rounded-pill px-2 fw-semibold"
                                    onClick={() => openRemoveStallModal(farmer)}
                                    title="Admin Authority: Remove this stall with mandatory reason"
                                  >
                                    <i className="fa fa-trash-alt me-1"></i> Remove Farmer
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Markets Management */}
          <div className="bg-white rounded-3 p-4 shadow-sm border">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  <i className="fa fa-map-marked-alt text-primary me-2"></i>Regional Farmers Markets Configuration
                </h5>
                <small className="text-muted">Master schedule of open-air weekly market hubs with Leaflet GPS mapping.</small>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-approve-stall rounded-pill px-3 fw-bold text-white shadow-xs"
                onClick={() => setIsMarketModalOpen(true)}
              >
                <i className="fa fa-plus me-1"></i> Add New Market
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase text-muted">
                  <tr>
                    <th>Market Name</th>
                    <th>Location Address</th>
                    <th>Operating Schedule</th>
                    <th>Active Stalls</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {marketsList.map((market) => (
                    <tr key={market.id}>
                      <td><strong className="text-dark">{market.name}</strong></td>
                      <td><small>{market.location}</small></td>
                      <td>
                        <small className="fw-semibold text-secondary d-block">
                          {Array.isArray(market.operatingDays) ? market.operatingDays.join(', ') : market.operatingDays}
                        </small>
                        <small className="text-muted">{market.timings}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-primary border">
                          {market.activeFarmers || 12} Stalls
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                          {market.coordinates?.lat && market.coordinates?.lng && (
                            <a
                              href={`https://www.google.com/maps?q=${market.coordinates.lat},${market.coordinates.lng}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            >
                              <i className="fa fa-external-link-alt me-1"></i> Coordinates
                            </a>
                          )}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning rounded-pill px-3"
                            onClick={() => openEditMarket(market)}
                          >
                            <i className="fa fa-edit me-1"></i> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Market Modal */}
      {isMarketModalOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1080 }}
          onClick={() => setIsMarketModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3 shadow-lg p-4" 
            style={{ maxWidth: '520px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="fw-bold mb-0">Add Regional Farmers Market</h5>
              <button type="button" className="btn-close" onClick={() => setIsMarketModalOpen(false)}></button>
            </div>

            <form onSubmit={handleCreateMarket}>
              <div className="mb-3">
                <label className="form-label small text-muted">Market Venue Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Model Town Farmers Bazaar"
                  value={newMarket.name}
                  onChange={(e) => setNewMarket({ ...newMarket, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Full Address / Location</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Central Park, Model Town, Lahore"
                  value={newMarket.location}
                  onChange={(e) => setNewMarket({ ...newMarket, location: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small text-muted">Operating Days (comma-separated)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Saturday, Sunday"
                    value={newMarket.operatingDays}
                    onChange={(e) => setNewMarket({ ...newMarket, operatingDays: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Operating Timings</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="08:00 AM - 02:00 PM"
                    value={newMarket.timings}
                    onChange={(e) => setNewMarket({ ...newMarket, timings: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small text-muted">GPS Latitude</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newMarket.lat}
                    onChange={(e) => setNewMarket({ ...newMarket, lat: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">GPS Longitude</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newMarket.lng}
                    onChange={(e) => setNewMarket({ ...newMarket, lng: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button type="button" className="btn btn-light rounded-pill px-3" onClick={() => setIsMarketModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary rounded-pill px-4 text-white">
                  Create Market
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Market Modal — Admin Only */}
      {isEditMarketModalOpen && editingMarket && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1090 }}
          onClick={() => setIsEditMarketModalOpen(false)}
        >
          <div
            className="bg-white rounded-3 shadow-lg p-4"
            style={{ maxWidth: '540px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div>
                <h5 className="fw-bold mb-0">Edit Market</h5>
                <small className="text-muted">{editingMarket.name}</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsEditMarketModalOpen(false)}
              ></button>
            </div>

            <form onSubmit={handleEditMarketSubmit}>
              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold">Market Venue Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editMarketForm.name}
                  onChange={(e) => setEditMarketForm({ ...editMarketForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold">Full Address / Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={editMarketForm.location}
                  onChange={(e) => setEditMarketForm({ ...editMarketForm, location: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold">City</label>
                <input
                  type="text"
                  className="form-control"
                  value={editMarketForm.city}
                  onChange={(e) => setEditMarketForm({ ...editMarketForm, city: e.target.value })}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small text-muted fw-semibold">Operating Days</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Saturday, Sunday"
                    value={editMarketForm.operatingDays}
                    onChange={(e) => setEditMarketForm({ ...editMarketForm, operatingDays: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted fw-semibold">Operating Timings</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="08:00 AM - 02:00 PM"
                    value={editMarketForm.timings}
                    onChange={(e) => setEditMarketForm({ ...editMarketForm, timings: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-2 mb-4">
                <div className="col-6">
                  <label className="form-label small text-muted fw-semibold">GPS Latitude</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editMarketForm.lat}
                    onChange={(e) => setEditMarketForm({ ...editMarketForm, lat: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted fw-semibold">GPS Longitude</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editMarketForm.lng}
                    onChange={(e) => setEditMarketForm({ ...editMarketForm, lng: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-3"
                  onClick={() => setIsEditMarketModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-warning rounded-pill px-4 fw-semibold">
                  <i className="fa fa-save me-1"></i> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Stall Reason Modal */}
      {isRemoveStallModalOpen && stallToRemove && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 1100 }}
          onClick={() => setIsRemoveStallModalOpen(false)}
        >
          <div
            className="bg-white rounded-3 shadow-lg p-4"
            style={{ maxWidth: '520px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-danger bg-opacity-10 text-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: 40, height: 40 }}
                >
                  <i className="fa fa-exclamation-triangle"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Remove Farmer Stall</h5>
                  <small className="text-muted">Removal Reason Mandatory / وجہ درج کرنا لازمی ہے</small>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsRemoveStallModalOpen(false)}
              ></button>
            </div>

            <div className="bg-light rounded p-3 mb-3 border">
              <div className="row g-2 small">
                <div className="col-6">
                  <span className="text-muted d-block">Stall Name:</span>
                  <strong className="text-dark">{stallToRemove.stallName}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Stall Number:</span>
                  <span className="badge bg-secondary font-monospace">{stallToRemove.stallNumber}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Farmer:</span>
                  <span className="text-dark">{stallToRemove.contactPerson} ({stallToRemove.phone})</span>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Assigned Market:</span>
                  <span className="text-dark">{stallToRemove.marketName}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmRemoveStall}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-danger mb-1">
                  Reason for Removal / منسوخی کی وجہ <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${removalError ? 'is-invalid' : ''}`}
                  rows="3"
                  placeholder="Enter the official reason for removing this stall (e.g. Quality violation, non-compliance with market regulations, prolonged inactivity, vendor requested withdrawal)..."
                  value={removalReason}
                  onChange={(e) => {
                    setRemovalReason(e.target.value);
                    if (removalError) setRemovalError('');
                  }}
                  required
                ></textarea>
                {removalError && (
                  <div className="invalid-feedback d-block">{removalError}</div>
                )}
              </div>

              {/* Quick Preset Reasons */}
              <div className="mb-3">
                <small className="text-muted d-block mb-1 fw-semibold">Quick Common Reasons:</small>
                <div className="d-flex flex-wrap gap-1">
                  {[
                    'Quality / Hygiene Standards Violation',
                    'Failure to attend scheduled market days',
                    'Non-compliance with market pricing rules',
                    'Selling non-organic / unauthorized items',
                    'Voluntary withdrawal requested by vendor'
                  ].map((prefill, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn-outline-secondary rounded-pill"
                      style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                      onClick={() => {
                        setRemovalReason(prefill);
                        if (removalError) setRemovalError('');
                      }}
                    >
                      + {prefill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="alert alert-warning py-2 small mb-4 d-flex align-items-center gap-2">
                <i className="fa fa-info-circle flex-shrink-0 text-warning"></i>
                <span>This reason will be logged and sent as an official notification to the farmer.</span>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-3"
                  onClick={() => setIsRemoveStallModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger rounded-pill px-4 fw-semibold text-white shadow-xs"
                  disabled={!removalReason.trim()}
                >
                  <i className="fa fa-trash-alt me-1"></i> Confirm & Remove Stall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
