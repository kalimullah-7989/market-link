/**
 * MarketLink - Farmer / Vendor Stall Dashboard
 * Inventory management and in-stall verification terminal
 */

import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useLanguage } from '../context/LanguageContext';
import { productsData } from '../data/products';
import { marketsData, COUNTRIES_CONFIG } from '../data/marketsData';
import { farmerAPI, marketsAPI } from '../services/api';
import PickupPassModal from '../components/PickupPassModal';
import AuthModal from '../components/AuthModal';

const PK_MAJOR_CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];

export default function FarmerDashboard() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { orders: contextOrders, updateOrderStatus: updateContextOrderStatus } = useOrders();
  const { formatPrice, currentCountry: globalCountry, currentLocale } = useLanguage();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedPassOrder, setSelectedPassOrder] = useState(null);
  const [editingProduceId, setEditingProduceId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Live farmer profile & approval state
  const [farmerProfile, setFarmerProfile] = useState(() => currentUser?.farmerProfile || null);
  const [marketsList, setMarketsList] = useState(marketsData);
  const [isStallModalOpen, setIsStallModalOpen] = useState(false);
  const [stallSubmitLoading, setStallSubmitLoading] = useState(false);
  const [stallAlert, setStallAlert] = useState(null);

  // Active stall form
  const [stallForm, setStallForm] = useState(() => {
    const initCountry = COUNTRIES_CONFIG.find(c => c.code === (globalCountry || 'PK')) || COUNTRIES_CONFIG[0];
    const userCountry = currentUser?.country || currentUser?.farmerProfile?.country || initCountry.name;
    const userCountryConfig = COUNTRIES_CONFIG.find(c => c.name.toLowerCase() === userCountry.toLowerCase() || c.code.toLowerCase() === userCountry.toLowerCase()) || initCountry;
    const userCity = currentUser?.city || currentUser?.farmerProfile?.city || userCountryConfig.defaultCity || userCountryConfig.cities[0]?.name;
    return {
      farm_name: currentUser?.stallName || currentUser?.farm_name || '',
      stall_number: currentUser?.stallNumber || '',
      stall_category: currentUser?.stallCategory || 'Organic Vegetables & Fresh Greens',
      stall_items: currentUser?.stallItems || '',
      market_id: currentUser?.marketId || '',
      city: userCity,
      country: userCountry,
      bio: currentUser?.bio || '',
      cutoff_hours: currentUser?.farmerProfile?.cutoff_hours || 4,
      operating_days: currentUser?.operatingDays || ['Saturday', 'Sunday']
    };
  });

  // Derive current country config from COUNTRIES_CONFIG
  const currentCountryConfig = COUNTRIES_CONFIG.find(
    (c) =>
      c.name.toLowerCase() === (stallForm.country || '').toLowerCase().trim() ||
      c.code.toLowerCase() === (stallForm.country || '').toLowerCase().trim()
  ) || COUNTRIES_CONFIG[0];

  const currentCountryCities = currentCountryConfig.cities || [];

  // Handle country selection and switch default city & bazars
  const handleCountrySelect = (newCountryName) => {
    const config = COUNTRIES_CONFIG.find(
      (c) =>
        c.name.toLowerCase() === (newCountryName || '').toLowerCase().trim() ||
        c.code.toLowerCase() === (newCountryName || '').toLowerCase().trim()
    ) || COUNTRIES_CONFIG[0];

    const defaultCity = config.defaultCity || config.cities[0]?.name || 'Karachi';
    const cityClean = defaultCity.toLowerCase().trim();
    const countryCodeClean = config.code.toLowerCase();
    const countryNameClean = config.name.toLowerCase();

    const matched = marketsList.filter((m) => {
      const mCountry = (m.country || '').toLowerCase().trim();
      const mCountryCode = (m.countryCode || '').toLowerCase().trim();
      const matchesCountry =
        mCountry === countryNameClean ||
        mCountryCode === countryCodeClean ||
        mCountry.includes(countryNameClean) ||
        countryNameClean.includes(mCountry);
      const matchesCity =
        (m.city || '').toLowerCase().trim() === cityClean ||
        (m.location || '').toLowerCase().includes(cityClean);
      return matchesCountry && matchesCity;
    });

    setStallForm((prev) => ({
      ...prev,
      country: config.name,
      city: defaultCity,
      market_id: matched.length > 0 ? String(matched[0].id) : ''
    }));
  };

  // Handle city selection and automatically match all local bazars in that city & country
  const handleCitySelect = (newCity) => {
    const clean = (newCity || '').toLowerCase().trim();
    const countryCodeClean = currentCountryConfig.code.toLowerCase();
    const countryNameClean = currentCountryConfig.name.toLowerCase();

    const matched = marketsList.filter((m) => {
      const mCountry = (m.country || '').toLowerCase().trim();
      const mCountryCode = (m.countryCode || '').toLowerCase().trim();
      const matchesCountry =
        !countryNameClean ||
        mCountry === countryNameClean ||
        mCountryCode === countryCodeClean ||
        mCountry.includes(countryNameClean);
      const matchesCity =
        (m.city || '').toLowerCase().trim() === clean ||
        (m.location || '').toLowerCase().includes(clean);
      return matchesCountry && matchesCity;
    });

    setStallForm((prev) => ({
      ...prev,
      city: newCity,
      market_id: matched.length > 0 ? String(matched[0].id) : ''
    }));
  };

  const currentCityClean = (stallForm.city || '').toLowerCase().trim();
  const currentCountryClean = (stallForm.country || '').toLowerCase().trim();
  const currentCountryCode = currentCountryConfig.code.toLowerCase();

  const availableCityMarkets = marketsList.filter((m) => {
    const mCountry = (m.country || '').toLowerCase().trim();
    const mCountryCode = (m.countryCode || '').toLowerCase().trim();
    const matchesCountry =
      !currentCountryClean ||
      mCountry === currentCountryClean ||
      mCountryCode === currentCountryCode ||
      mCountry.includes(currentCountryClean);
    const matchesCity =
      (m.city || '').toLowerCase().trim() === currentCityClean ||
      (m.location || '').toLowerCase().includes(currentCityClean);
    return matchesCountry && matchesCity;
  });

  const approvalStatus = farmerProfile?.approval_status || currentUser?.approvalStatus || 'pending';
  const isApproved = approvalStatus === 'approved';
  const isPending = approvalStatus === 'pending';
  const isSuspended = approvalStatus === 'suspended' || approvalStatus === 'rejected';

  // Active farmer profile display
  const farmerName = farmerProfile?.farm_name || currentUser?.stallName || 'Punjab Green Organics';
  const farmerId = currentUser?.id || 2;
  const stallNumber = farmerProfile?.stall_number || currentUser?.stallNumber || 'Stall #A-04';
  const stallCategory = farmerProfile?.stall_category || currentUser?.stallCategory || 'Organic Vegetables & Fresh Greens';
  const stallItems = farmerProfile?.stall_items || currentUser?.stallItems || 'Seasonal Vegetables, Fresh Greens';
  const marketName = farmerProfile?.market?.name || currentUser?.marketName || 'Liberty Farmers Market';
  const farmerCity = farmerProfile?.city || currentUser?.city || '';
  const farmerCountry = farmerProfile?.country || currentUser?.country || 'Pakistan';
  const farmerPhone = currentUser?.phone || farmerProfile?.user?.phone || '';

  // In-Stall Verification State
  const [verifyTokenInput, setVerifyTokenInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);

  // Farmer's inventory state
  const [inventory, setInventory] = useState(() =>
    productsData.filter((p) => 
      String(p.farmerId) === String(farmerId) || 
      p.farmerName === farmerName ||
      p.farmerName.includes('Punjab Green') ||
      p.farmerName.includes('Oak Ridge')
    )
  );

  // Live stall orders
  const [stallOrders, setStallOrders] = useState(() =>
    contextOrders.filter((o) => 
      String(o.farmerId) === String(farmerId) || 
      o.farmerName === farmerName ||
      o.farmerName?.includes('Punjab Green') ||
      o.farmerName?.includes('Oak Ridge')
    )
  );

  // Modal to add new produce
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduce, setNewProduce] = useState({
    name: '',
    category: 'vegetables',
    price: '',
    unit: 'kg',
    stockQuantity: ''
  });

  // Weekly Statement / Hisab Modal state
  const [isWeeklyReportOpen, setIsWeeklyReportOpen] = useState(false);

  // Edit Payment Modal state
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [orderToEditPayment, setOrderToEditPayment] = useState(null);
  const [editPaymentAmount, setEditPaymentAmount] = useState('');
  const [editPaymentStatus, setEditPaymentStatus] = useState('completed');
  const [editPaymentNote, setEditPaymentNote] = useState('');

  // Load live inventory, orders, markets, and stall profile from Laravel API
  useEffect(() => {
    let isMounted = true;
    async function fetchFarmerData() {
      setLoading(true);
      try {
        const [liveProds, liveOrders, liveProfile, liveMarkets] = await Promise.all([
          farmerAPI.getProducts().catch(() => null),
          farmerAPI.getOrders().catch(() => null),
          farmerAPI.getProfile().catch(() => null),
          marketsAPI.getAll().catch(() => [])
        ]);

        if (isMounted) {
          if (liveProds && liveProds.length > 0) setInventory(liveProds);
          if (liveOrders && liveOrders.length > 0) setStallOrders(liveOrders);

          if (liveProfile && liveProfile.success && liveProfile.data) {
            const p = liveProfile.data.farmer_profile || liveProfile.data.farmerProfile || liveProfile.data;
            setFarmerProfile(p);
            const fCity = p.city || liveProfile.data.city || currentUser?.city || 'Karachi';
            setStallForm({
              farm_name: p.farm_name || '',
              stall_number: p.stall_number || '',
              stall_category: p.stall_category || 'Organic Vegetables & Fresh Greens',
              stall_items: p.stall_items || '',
              market_id: p.market_id || (fCity.toLowerCase() === 'karachi' ? 4 : 1),
              city: fCity,
              country: p.country || liveProfile.data.country || currentUser?.country || 'Pakistan',
              bio: p.bio || '',
              cutoff_hours: p.cutoff_hours || 4,
              operating_days: p.operating_days || ['Saturday', 'Sunday']
            });

            if (updateCurrentUser) {
              updateCurrentUser({
                approvalStatus: p.approval_status,
                stallName: p.farm_name,
                stallNumber: p.stall_number,
                stallCategory: p.stall_category,
                stallItems: p.stall_items,
                marketName: p.market?.name,
                marketId: p.market_id,
                city: p.city || liveProfile.data.city || currentUser?.city,
                country: p.country || liveProfile.data.country || currentUser?.country,
                bio: p.bio,
                farmerProfile: p
              });
            }
          }

          if (liveMarkets && liveMarkets.length > 0) {
            const enrichedLive = liveMarkets.map((m) => {
              const matchedCountry = COUNTRIES_CONFIG.find((c) =>
                c.cities.some((city) => city.name.toLowerCase() === (m.city || '').toLowerCase())
              );
              return {
                ...m,
                countryCode: m.countryCode || matchedCountry?.code || 'PK',
                country: m.country || matchedCountry?.name || 'Pakistan'
              };
            });
            const merged = [...marketsData];
            enrichedLive.forEach((lm) => {
              const idx = merged.findIndex((m) => String(m.id) === String(lm.id));
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...lm };
              } else {
                merged.push(lm);
              }
            });
            setMarketsList(merged);
          }
        }
      } catch (err) {
        console.warn('API fallback engaged for farmer portal:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchFarmerData();
    return () => { isMounted = false; };
  }, [farmerId]);

  // Submit / Update stall application for Admin approval
  const handleSubmitStall = async (e) => {
    e.preventDefault();
    if (!stallForm.farm_name.trim() || !stallForm.stall_number.trim() || !stallForm.stall_items.trim() || !stallForm.city?.trim() || !stallForm.country?.trim()) {
      setStallAlert({
        type: 'danger',
        message: 'Please fill in all mandatory stall fields: Farm/Stall Name, Stall Number, Items to Sell, City, and Country.'
      });
      return;
    }

    setStallSubmitLoading(true);
    setStallAlert(null);

    try {
      const payload = {
        farm_name: stallForm.farm_name.trim(),
        stall_number: stallForm.stall_number.trim(),
        stall_category: stallForm.stall_category,
        stall_items: stallForm.stall_items.trim(),
        market_id: parseInt(stallForm.market_id, 10) || 1,
        city: stallForm.city.trim(),
        country: stallForm.country.trim(),
        bio: stallForm.bio.trim(),
        cutoff_hours: parseInt(stallForm.cutoff_hours, 10) || 4,
        operating_days: stallForm.operating_days
      };

      const res = await farmerAPI.submitStallApplication(payload);

      if (res.success) {
        const updated = res.data;
        setFarmerProfile(updated);

        if (updateCurrentUser) {
          updateCurrentUser({
            approvalStatus: 'pending',
            stallName: updated.farm_name,
            stallNumber: updated.stall_number,
            stallCategory: updated.stall_category,
            stallItems: updated.stall_items,
            marketName: updated.market?.name,
            marketId: updated.market_id,
            city: updated.city || stallForm.city,
            country: updated.country || stallForm.country,
            bio: updated.bio,
            farmerProfile: updated
          });
        }

        setIsStallModalOpen(false);
        setStallAlert({
          type: 'success',
          message: 'Stall application submitted successfully! It has been sent directly to the Administrator for approval. Your stall will be live once approved.'
        });
      } else {
        setStallAlert({
          type: 'danger',
          message: res.message || 'Failed to submit stall. Please verify your inputs.'
        });
      }
    } catch (err) {
      setStallAlert({
        type: 'danger',
        message: err.message || 'Error connecting to server. Please try again.'
      });
    } finally {
      setStallSubmitLoading(false);
    }
  };

  // Sync with context orders if updated externally
  useEffect(() => {
    if (contextOrders?.length > 0) {
      setStallOrders((prev) => {
        const filtered = contextOrders.filter(
          (o) => String(o.farmerId) === String(farmerId) || o.farmerName === farmerName
        );
        return filtered.length > 0 ? filtered : prev;
      });
    }
  }, [contextOrders, farmerId, farmerName]);

  const pendingOrders = stallOrders.filter((o) => o.status === 'placed');
  const acceptedOrders = stallOrders.filter((o) => o.status === 'accepted');
  const readyOrders = stallOrders.filter((o) => o.status === 'ready_for_pickup');
  const completedOrders = stallOrders.filter((o) => o.status === 'completed');

  const totalRevenue = completedOrders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0);

  // Advance order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await farmerAPI.updateOrderStatus(orderId, newStatus);
    } catch {
      // Local state update
    }

    setStallOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    updateContextOrderStatus(orderId, newStatus);
  };

  // Open Edit Payment Modal
  const openEditPaymentModal = (order) => {
    if (!order) return;
    setOrderToEditPayment(order);
    setEditPaymentAmount(String(order.totalAmount || 0));
    setEditPaymentStatus(order.status || 'completed');
    setEditPaymentNote(order.paymentNote || '');
    setIsEditPaymentModalOpen(true);
  };

  // Save Corrected Payment
  const handleSavePaymentEdit = (e) => {
    e.preventDefault();
    if (!orderToEditPayment) return;

    const parsedAmount = parseFloat(editPaymentAmount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    setStallOrders((prev) =>
      prev.map((o) =>
        o.id === orderToEditPayment.id
          ? {
              ...o,
              totalAmount: parsedAmount,
              status: editPaymentStatus,
              paymentNote: editPaymentNote.trim()
            }
          : o
      )
    );

    try {
      const stored = JSON.parse(localStorage.getItem('marketlink_orders') || '[]');
      const updated = stored.map((o) =>
        o.id === orderToEditPayment.id
          ? {
              ...o,
              totalAmount: parsedAmount,
              status: editPaymentStatus,
              paymentNote: editPaymentNote.trim()
            }
          : o
      );
      localStorage.setItem('marketlink_orders', JSON.stringify(updated));
    } catch {}

    setStallAlert({
      type: 'success',
      message: `Payment for Order #${orderToEditPayment.id} updated to ${formatPrice(parsedAmount)} (${editPaymentStatus === 'completed' ? 'Completed & Paid' : editPaymentStatus}). Cash revenue recalculated.`
    });

    setIsEditPaymentModalOpen(false);
    setOrderToEditPayment(null);
  };

  // Export Weekly Statement to Excel CSV
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Items & Quantities', 'Pickup Date', 'Time Slot', 'Amount', 'Payment Status', 'Payment Note'];
    const rows = stallOrders.map((o) => [
      `"${o.id}"`,
      `"${o.customerName || 'Customer'}"`,
      `"${o.customerPhone || ''}"`,
      `"${(o.items || []).map((i) => `${i.name} (${i.quantity} ${i.unit})`).join('; ')}"`,
      `"${o.pickupDate || ''}"`,
      `"${o.timeSlot || ''}"`,
      `"${o.totalAmount || 0}"`,
      `"${o.status === 'completed' ? 'Completed & Paid' : o.status}"`,
      `"${o.paymentNote || 'Standard cash'}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [
        `"MarketLink Weekly Stall Statement - ${farmerName} (${stallNumber})"`,
        `"Market Hub: ${marketName} | Date: ${new Date().toLocaleDateString()}"`,
        `"Total Settled Revenue: ${formatPrice(totalRevenue)}"`,
        '',
        headers.join(','),
        ...rows.map((r) => r.join(','))
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `MarketLink_Weekly_Hisab_${stallNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Statement Handler
  const handlePrintStatement = () => {
    window.print();
  };

  // In-Stall QR & Token Verification
  const handleVerifyOrder = async (e) => {
    e.preventDefault();
    if (!verifyTokenInput.trim()) return;

    setVerificationLoading(true);
    setVerificationResult(null);

    const tokenClean = verifyTokenInput.trim().toUpperCase();

    try {
      const res = await farmerAPI.verifyOrder(tokenClean);

      if (res.success) {
        const matchedOrder = stallOrders.find(
          (o) => (o.pickupToken && o.pickupToken.toUpperCase() === tokenClean) || o.id === tokenClean
        );

        if (matchedOrder) {
          handleUpdateStatus(matchedOrder.id, 'completed');
        }

        setVerificationResult({
          success: true,
          message: `Order verified successfully! Collect ${formatPrice(res.data?.total_amount || matchedOrder?.totalAmount || 25)} cash.`,
          details: res.data || matchedOrder
        });
        setVerifyTokenInput('');
      } else {
        // Fallback matching
        const localMatch = 
          stallOrders.find((o) => (o.pickupToken && o.pickupToken.toUpperCase() === tokenClean) || o.id === tokenClean) ||
          contextOrders.find((o) => (o.pickupToken && o.pickupToken.toUpperCase() === tokenClean) || o.id === tokenClean);

        if (localMatch) {
          handleUpdateStatus(localMatch.id, 'completed');
          setVerificationResult({
            success: true,
            message: `Order verified! Collect ${formatPrice(localMatch.totalAmount)} cash from ${localMatch.customerName}.`,
            details: localMatch
          });
          setVerifyTokenInput('');
        } else {
          setVerificationResult({
            success: false,
            message: res.message || 'No active order matching this token found for your stall.'
          });
        }
      }
    } catch (err) {
      setVerificationResult({
        success: false,
        message: err.message || 'Verification failed. Please check token.'
      });
    } finally {
      setVerificationLoading(false);
    }
  };

  // Toggle Sold Out status
  const handleToggleStatus = async (productId) => {
    try {
      await farmerAPI.toggleProductStatus(productId);
    } catch {
      // local toggle
    }

    setInventory((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              stockQuantity: item.stockQuantity > 0 ? 0 : 25,
              badge: item.stockQuantity > 0 ? 'Sold Out' : 'Fresh'
            }
          : item
      )
    );
  };

  // Adjust stock quantity
  const handleAdjustStock = (productId, delta) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, stockQuantity: Math.max(0, item.stockQuantity + delta) }
          : item
      )
    );
  };

  // Add or update produce handler
  const handleAddProduce = async (e) => {
    e.preventDefault();
    if (newProduce.name && newProduce.price && newProduce.stockQuantity) {
      if (editingProduceId) {
        try {
          await farmerAPI.updateProduct(editingProduceId, {
            name: newProduce.name,
            category_id: 1,
            unit: newProduce.unit,
            price: parseFloat(newProduce.price),
            stock_quantity: parseInt(newProduce.stockQuantity, 10)
          });
        } catch {}

        setInventory((prev) =>
          prev.map((item) =>
            item.id === editingProduceId
              ? {
                  ...item,
                  name: newProduce.name,
                  category: newProduce.category,
                  price: parseFloat(newProduce.price),
                  unit: newProduce.unit,
                  stockQuantity: parseInt(newProduce.stockQuantity, 10)
                }
              : item
          )
        );
      } else {
        const payload = {
          category_id: newProduce.category === 'vegetables' ? 1 : newProduce.category === 'fruits' ? 2 : 3,
          name: newProduce.name,
          unit: newProduce.unit,
          price: parseFloat(newProduce.price),
          stock_quantity: parseInt(newProduce.stockQuantity, 10),
          description: `Freshly harvested ${newProduce.name}.`
        };

        try {
          await farmerAPI.createProduct(payload);
        } catch {}

        const createdItem = {
          id: Date.now(),
          name: newProduce.name,
          category: newProduce.category,
          price: parseFloat(newProduce.price),
          unit: newProduce.unit,
          stockQuantity: parseInt(newProduce.stockQuantity, 10),
          farmerId: farmerId,
          farmerName: farmerName,
          marketId: '1',
          marketName: 'Liberty Farmers Market',
          image: '/img/product-1.jpg',
          badge: 'Fresh',
          description: payload.description
        };
        setInventory([createdItem, ...inventory]);
      }
      setIsAddModalOpen(false);
      setEditingProduceId(null);
      setNewProduce({ name: '', category: 'vegetables', price: '', unit: 'kg', stockQuantity: '' });
    }
  };

  if (!currentUser || (currentUser.role !== 'farmer' && currentUser.role !== 'admin')) {
    return (
      <>
        <PageHeader title="Farmer / Vendor Portal" breadcrumb="Farmer Sign In Required" />
        <div className="container py-5 text-center my-5">
          <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '500px', borderRadius: '16px' }}>
            <div className="text-success mb-3">
              <i className="fa fa-tractor fa-3x"></i>
            </div>
            <h4 className="fw-bold text-dark mb-2">Farmer Stall Portal</h4>
            <p className="text-muted mb-4">
              Access is restricted to registered farmers and stall operators. Please sign in with your farmer account.
            </p>
            <button 
              type="button" 
              className="btn btn-success rounded-pill px-4 py-2 fw-semibold text-white"
              onClick={() => setIsAuthOpen(true)}
            >
              <i className="fa fa-sign-in-alt me-2"></i>Sign In as Farmer
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
        /* Farmer Portal Theme-Matching Styles */
        .farmer-pending-alert {
          background-color: #fffbeb;
          border: 1px solid #fde68a !important;
          border-left: 5px solid #f59e0b !important;
          color: #1e293b;
          transition: all 0.3s ease;
        }
        .farmer-pending-alert .alert-icon-box {
          background-color: rgba(245, 158, 11, 0.15);
          color: #d97706;
        }
        .farmer-pending-alert .alert-title {
          color: #92400e;
        }
        .farmer-pending-alert .alert-subtitle {
          color: #78350f;
        }
        .farmer-pending-alert .alert-inner-card {
          background-color: #ffffff;
          border: 1px solid #fef3c7 !important;
          color: #1e293b;
        }
        .farmer-pending-alert .btn-update-stall {
          border: 1px solid #d97706;
          color: #92400e;
          background: #ffffff;
          transition: all 0.2s ease;
        }
        .farmer-pending-alert .btn-update-stall:hover {
          background-color: #3CB815 !important;
          border-color: #3CB815 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(60, 184, 21, 0.3);
        }

        /* Dark Theme overrides for Pending Alert */
        [data-theme="dark"] .farmer-pending-alert {
          background-color: #131d2e !important;
          border: 1px solid rgba(245, 158, 11, 0.3) !important;
          border-left: 5px solid #eab308 !important;
          color: #f8fafc !important;
        }
        [data-theme="dark"] .farmer-pending-alert .alert-icon-box {
          background-color: rgba(234, 179, 8, 0.15) !important;
          color: #facc15 !important;
        }
        [data-theme="dark"] .farmer-pending-alert .alert-title {
          color: #fef08a !important;
        }
        [data-theme="dark"] .farmer-pending-alert .alert-subtitle {
          color: #cbd5e1 !important;
        }
        [data-theme="dark"] .farmer-pending-alert .alert-inner-card {
          background-color: #0c1322 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #f1f5f9 !important;
        }
        [data-theme="dark"] .farmer-pending-alert strong,
        [data-theme="dark"] .farmer-pending-alert .text-dark {
          color: #f8fafc !important;
        }
        [data-theme="dark"] .farmer-pending-alert .text-muted {
          color: #94a3b8 !important;
        }
        [data-theme="dark"] .farmer-pending-alert .btn-update-stall {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #f1f5f9;
        }
        [data-theme="dark"] .farmer-pending-alert .btn-update-stall:hover {
          background-color: #3CB815 !important;
          border-color: #3CB815 !important;
          color: #ffffff !important;
        }

        /* Print Media Styles for Weekly Statement */
        @media print {
          body * {
            visibility: hidden !important;
          }
          #weekly-statement-print-area, #weekly-statement-print-area * {
            visibility: visible !important;
          }
          #weekly-statement-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 24px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <PageHeader title="Farmer / Vendor Portal" breadcrumb="Farmer Portal" />

      <div className="container-xxl py-5">
        <div className="container">
          {/* Stall Setup & Submission Feedback Alert */}
          {stallAlert && (
            <div className={`alert alert-${stallAlert.type} alert-dismissible fade show shadow-sm rounded-3 mb-4`} role="alert">
              <i className={`fa ${stallAlert.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2 fs-5`}></i>
              <strong>{stallAlert.message}</strong>
              <button type="button" className="btn-close" onClick={() => setStallAlert(null)}></button>
            </div>
          )}

          {/* Stall Status Alert & Verification Banner for Pending Applicants */}
          {isPending && (
            <div className="farmer-pending-alert shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-3 alert-icon-box rounded-circle">
                    <i className="fa fa-clock fa-2x"></i>
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <h5 className="fw-bold mb-0 alert-title">Stall Application Pending Admin Approval</h5>
                      <span className="badge bg-warning text-dark text-uppercase px-2 py-1">Awaiting Review</span>
                    </div>
                    <p className="alert-subtitle mb-3 small">
                      Aapka stall setup submit ho chuka hai aur <strong>Market Administration</strong> ki approval k liye pending hai. Admin approval milty hi aapka stall public marketplace aur Leaflet Interactive Map par live ho jaye ga aur customers pre-order kar sakein ge.
                    </p>

                    <div className="alert-inner-card rounded-3 p-3 border small shadow-xs">
                      <div className="row g-2">
                        <div className="col-md-4 col-sm-6">
                          <span className="text-muted d-block">Stall / Farm Name:</span>
                          <strong className="text-dark">{farmerName}</strong>
                        </div>
                        <div className="col-md-4 col-sm-6">
                          <span className="text-muted d-block">Stall Number:</span>
                          <span className="badge bg-secondary">{stallNumber}</span>
                        </div>
                        <div className="col-md-4 col-sm-6">
                          <span className="text-muted d-block">Specialty / Category:</span>
                          <span className="badge bg-light text-success border">{stallCategory}</span>
                        </div>
                        <div className="col-md-4 col-sm-6">
                          <span className="text-muted d-block">City & Country:</span>
                          <strong className="text-dark">
                            <i className="fa fa-map-marker-alt text-danger me-1"></i>
                            {farmerCity || stallForm.city || 'Local'}, {farmerCountry || stallForm.country || 'Pakistan'}
                          </strong>
                        </div>
                        <div className="col-md-4 col-sm-6">
                          <span className="text-muted d-block">Contact Phone:</span>
                          <strong className="text-dark">
                            <i className="fa fa-phone text-success me-1"></i>
                            {farmerPhone || 'N/A'}
                          </strong>
                        </div>
                        <div className="col-md-4 col-sm-6">
                          <span className="text-muted d-block">Assigned Market Hub:</span>
                          <strong className="text-dark">{marketName}</strong>
                        </div>
                        <div className="col-12">
                          <span className="text-muted d-block">Items / Produce to Sell:</span>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {stallItems.split(',').map((it, idx) => (
                              <span key={idx} className="badge bg-success-subtle text-success border border-success-subtle">
                                <i className="fa fa-leaf me-1"></i>{it.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="btn btn-update-stall rounded-pill px-3 py-2 btn-sm fw-semibold shadow-sm"
                    onClick={() => setIsStallModalOpen(true)}
                  >
                    <i className="fa fa-edit me-1"></i> Update Stall Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Suspended Stall Alert */}
          {isSuspended && (
            <div className="alert alert-danger border-danger shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-3 bg-danger bg-opacity-25 rounded-circle text-danger">
                    <i className="fa fa-exclamation-triangle fa-2x"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1 text-danger">Stall Application Needs Revision / Suspended</h5>
                    <p className="text-muted mb-0 small">
                      Market administration requires you to adjust your stall details before it can be activated for public customer orders.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-danger text-white rounded-pill px-4 py-2 fw-semibold"
                  onClick={() => setIsStallModalOpen(true)}
                >
                  <i className="fa fa-redo me-1"></i> Update & Re-Submit
                </button>
              </div>
            </div>
          )}

          {/* Top Stall Profile Summary */}
          <div className="bg-white rounded-3 p-4 shadow-sm border mb-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '64px', height: '64px' }}>
                  <i className="fa fa-tractor fa-2x"></i>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <h4 className="mb-0 fw-bold">{farmerName}</h4>
                    {isApproved ? (
                      <span className="badge bg-success text-white text-uppercase px-2 py-1" style={{ fontSize: '0.72rem' }}>
                        <i className="fa fa-check-circle me-1"></i> Verified Stall ({stallNumber})
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark text-uppercase px-2 py-1" style={{ fontSize: '0.72rem' }}>
                        <i className="fa fa-clock me-1"></i> Pending Approval ({stallNumber})
                      </span>
                    )}
                    <span className="badge bg-light text-primary border" style={{ fontSize: '0.72rem' }}>
                      {stallCategory}
                    </span>
                  </div>
                  <small className="text-muted d-block mt-1">
                    Market Hub: <strong>{marketName}</strong> &bull; Stall Manager: {currentUser?.name || 'Farmer Vendor'}
                    {(farmerCity || stallForm.city) && (
                      <> &bull; Location: <strong>{farmerCity || stallForm.city}, {farmerCountry || stallForm.country || 'Pakistan'}</strong></>
                    )}
                    {farmerPhone && (
                      <> &bull; Contact: <strong>{farmerPhone}</strong></>
                    )}
                  </small>
                  <small className="text-secondary">
                    <i className="fa fa-clock text-primary me-1"></i> Pickup Window: <strong>08:00 AM - 01:00 PM</strong> (Cut-off: {farmerProfile?.cutoff_hours || stallForm.cutoff_hours || 4} hrs before slot)
                  </small>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button 
                  type="button" 
                  className="btn btn-outline-success rounded-pill px-3 shadow-sm"
                  onClick={() => setIsStallModalOpen(true)}
                >
                  <i className="fa fa-store me-1"></i> {isApproved ? 'Stall Settings' : 'Setup / Edit Stall'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary rounded-pill px-4 text-white shadow-sm"
                  onClick={() => setIsAddModalOpen(true)}
                  disabled={!isApproved}
                  title={!isApproved ? 'Produce listing is unlocked after Admin approves your stall' : 'Add weekly produce'}
                >
                  <i className="fa fa-plus me-1"></i> Add Weekly Produce
                </button>
              </div>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-3 col-sm-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm text-center">
                <small className="text-muted fw-bold text-uppercase d-block mb-1">Total Pre-Orders</small>
                <h3 className="mb-0 fw-bold text-dark">{stallOrders.length}</h3>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm text-center">
                <small className="text-muted fw-bold text-uppercase d-block mb-1">Awaiting Action</small>
                <h3 className="mb-0 fw-bold text-warning">{pendingOrders.length}</h3>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm text-center">
                <small className="text-muted fw-bold text-uppercase d-block mb-1">Ready for Pickup</small>
                <h3 className="mb-0 fw-bold text-success">{readyOrders.length}</h3>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="bg-white p-3 rounded-3 border shadow-sm text-center">
                <small className="text-muted fw-bold text-uppercase d-block mb-1">Settled Cash Revenue</small>
                <h3 className="mb-0 fw-bold text-primary">{formatPrice(totalRevenue)}</h3>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-success text-decoration-none fw-semibold p-0 mt-1"
                  onClick={() => setIsWeeklyReportOpen(true)}
                  style={{ fontSize: '0.78rem' }}
                >
                  <i className="fa fa-file-invoice-dollar me-1"></i> Week Ka Hisab (Print & Excel)
                </button>
              </div>
            </div>
          </div>

          {/* In-Stall QR & Token Verifier Desk */}
          <div className="card shadow-sm border-success mb-4 pass-verifier-card" style={{ borderWidth: '2px' }}>
            <div className="card-header bg-success text-white py-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="fa fa-qrcode fs-4"></i>
                <h5 className="mb-0 fw-bold text-white">In-Stall Customer Pass Verifier</h5>
              </div>
              <span className="badge bg-white text-success fw-bold text-uppercase" style={{ fontSize: '0.75rem' }}>
                Cash-on-Pickup Terminal
              </span>
            </div>
            <div className="card-body p-4 bg-light">
              <p className="small text-muted mb-3">
                Customer jab aapke stall par aaye, to unka <strong>QR Code scan karein</strong> ya unka <strong>Stall Pass Token</strong> (jaise <code>PKP-XXXXXX</code>) yahan enter karke <strong>Verify & Settle Cash</strong> dabayein:
              </p>

              <form onSubmit={handleVerifyOrder} className="row g-2 align-items-center">
                <div className="col-md-8 col-sm-12">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fa fa-key text-success"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-lg border-start-0 font-monospace text-uppercase"
                      placeholder="ENTER PASS TOKEN (e.g. PKP-98A1B2)"
                      value={verifyTokenInput}
                      onChange={(e) => setVerifyTokenInput(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg w-100 fw-bold rounded-pill text-white shadow-sm"
                    disabled={verificationLoading}
                  >
                    {verificationLoading ? (
                      <span><i className="fa fa-spinner fa-spin me-2"></i>Verifying...</span>
                    ) : (
                      <span><i className="fa fa-check-circle me-2"></i>Verify & Settle Cash</span>
                    )}
                  </button>
                </div>
              </form>

              {verificationResult && (
                <div className={`alert ${verificationResult.success ? 'alert-success' : 'alert-danger'} mt-3 mb-0 d-flex flex-wrap align-items-center justify-content-between gap-2`}>
                  <div className="d-flex align-items-center">
                    <i className={`fa ${verificationResult.success ? 'fa-check-circle' : 'fa-exclamation-triangle'} fs-5 me-2 flex-shrink-0`}></i>
                    <div>
                      <strong>{verificationResult.message}</strong>
                    </div>
                  </div>
                  {verificationResult.details && (
                    <button
                      type="button"
                      className="btn btn-sm btn-warning text-dark fw-bold rounded-pill px-3 shadow-xs"
                      onClick={() => openEditPaymentModal(verificationResult.details)}
                    >
                      <i className="fa fa-pen me-1"></i> Edit Received Amount
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Incoming Pre-Orders Section */}
          <div className="bg-white rounded-3 p-4 shadow-sm border mb-5">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom gap-2">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  <i className="fa fa-inbox text-primary me-2"></i>Incoming Customer Pre-Orders
                </h5>
                <small className="text-muted">Review, accept, and prepare orders for Saturday pickup.</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success fw-bold rounded-pill px-3 shadow-xs"
                  onClick={() => setIsWeeklyReportOpen(true)}
                  title="View and print weekly statement or download Excel spreadsheet"
                >
                  <i className="fa fa-file-excel me-1 text-success"></i> Week Ka Hisab (Print & Excel)
                </button>
                <span className="badge bg-primary text-white rounded-pill px-3 py-2">
                  {pendingOrders.length} New Orders
                </span>
              </div>
            </div>

            {stallOrders.length === 0 ? (
              <p className="text-muted text-center py-4">No pre-orders recorded for this stall yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-uppercase text-muted">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items & Units</th>
                      <th>Pickup Date / Slot</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stallOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td>
                          <strong className="text-primary">{ord.id}</strong>
                          {ord.pickupToken && (
                            <small className="d-block text-muted font-monospace" style={{ fontSize: '0.72rem' }}>
                              Token: {ord.pickupToken}
                            </small>
                          )}
                        </td>
                        <td>
                          <div className="fw-semibold">{ord.customerName}</div>
                          <small className="text-muted">{ord.customerPhone}</small>
                        </td>
                        <td>
                          <small>
                            {ord.items.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}
                          </small>
                        </td>
                        <td>
                          <small className="d-block">{ord.pickupDate}</small>
                          <small className="text-muted">{ord.timeSlot}</small>
                        </td>
                        <td>
                          <strong className="text-dark">{formatPrice(ord.totalAmount)}</strong>
                          <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                            {ord.paymentNote ? ord.paymentNote : 'Cash at stall'}
                          </small>
                        </td>
                        <td>
                          {ord.status === 'placed' && <span className="badge bg-warning text-dark">Placed</span>}
                          {ord.status === 'accepted' && <span className="badge bg-info text-white">Accepted</span>}
                          {ord.status === 'ready_for_pickup' && <span className="badge bg-success text-white">Ready</span>}
                          {ord.status === 'completed' && <span className="badge bg-secondary text-white">Completed & Paid</span>}
                          {ord.status === 'cancelled' && <span className="badge bg-danger text-white">Cancelled</span>}
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end align-items-center gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary rounded-pill px-2"
                              onClick={() => setSelectedPassOrder(ord)}
                              title="View Customer Pickup Pass & QR"
                            >
                              <i className="fa fa-qrcode me-1"></i> Pass
                            </button>

                            {ord.status === 'placed' && (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-success rounded-pill px-3"
                                  onClick={() => handleUpdateStatus(ord.id, 'accepted')}
                                >
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger rounded-pill px-2"
                                  onClick={() => handleUpdateStatus(ord.id, 'cancelled')}
                                >
                                  Decline
                                </button>
                              </>
                            )}

                            {ord.status === 'accepted' && (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary rounded-pill px-3"
                                onClick={() => handleUpdateStatus(ord.id, 'ready_for_pickup')}
                              >
                                <i className="fa fa-box me-1"></i> Mark Ready
                              </button>
                            )}

                            {ord.status === 'ready_for_pickup' && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success rounded-pill px-3"
                                onClick={() => handleUpdateStatus(ord.id, 'completed')}
                              >
                                <i className="fa fa-hand-holding-usd me-1"></i> Settle Cash
                              </button>
                            )}

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-warning rounded-pill px-2 fw-semibold"
                              onClick={() => openEditPaymentModal(ord)}
                              title="Edit received payment amount or status if entered incorrectly"
                            >
                              <i className="fa fa-pen me-1"></i> Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Weekly Stock & Pricing Management */}
          <div className="bg-white rounded-3 p-4 shadow-sm border">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  <i className="fa fa-boxes text-primary me-2"></i>Weekly Stall Inventory & Availability
                </h5>
                <small className="text-muted">Manage stock quantities and quickly toggle Sold Out status.</small>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase text-muted">
                  <tr>
                    <th>Produce Item</th>
                    <th>Category</th>
                    <th>Price / Unit</th>
                    <th>Available Stock</th>
                    <th>Availability</th>
                    <th className="text-end">Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={item.image} alt={item.name} className="rounded" style={{ width: '42px', height: '42px', objectFit: 'cover' }} />
                          <div className="fw-bold">{item.name}</div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border text-uppercase" style={{ fontSize: '0.75rem' }}>
                          {item.category}
                        </span>
                      </td>
                      <td><strong>{formatPrice(item.price)}</strong> / {item.unit}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button 
                            type="button" 
                            className="btn btn-sm btn-light border px-2 py-0 fw-bold"
                            onClick={() => handleAdjustStock(item.id, -5)}
                          >
                            -
                          </button>
                          <span className={`fw-bold ${item.stockQuantity === 0 ? 'text-danger' : 'text-success'}`}>
                            {item.stockQuantity} {item.unit}
                          </span>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-light border px-2 py-0 fw-bold"
                            onClick={() => handleAdjustStock(item.id, 5)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`btn btn-sm rounded-pill px-3 ${item.stockQuantity > 0 ? 'btn-outline-success' : 'btn-danger text-white'}`}
                          onClick={() => handleToggleStatus(item.id)}
                        >
                          {item.stockQuantity > 0 ? (
                            <><i className="fa fa-check-circle me-1"></i> In Stock</>
                          ) : (
                            <><i className="fa fa-times-circle me-1"></i> Sold Out</>
                          )}
                        </button>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-primary text-decoration-none"
                          onClick={() => {
                            setEditingProduceId(item.id);
                            setNewProduce({
                              name: item.name,
                              category: item.category || 'vegetables',
                              price: String(item.price),
                              unit: item.unit || 'kg',
                              stockQuantity: String(item.stockQuantity)
                            });
                            setIsAddModalOpen(true);
                          }}
                        >
                          <i className="fa fa-edit me-1"></i>Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Produce Modal */}
      {isAddModalOpen && (
        <div 
          className="farmer-produce-modal position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1080 }}
          onClick={() => {
            setIsAddModalOpen(false);
            setEditingProduceId(null);
          }}
        >
          <div 
            className="bg-white rounded-3 shadow-lg p-4" 
            style={{ maxWidth: '480px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="fw-bold mb-0">{editingProduceId ? 'Edit Stall Produce' : 'List New Produce'}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduceId(null);
                }}
              ></button>
            </div>

            <form onSubmit={handleAddProduce}>
              <div className="mb-3">
                <label className="form-label small text-muted">Produce Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Organic Curly Kale"
                  value={newProduce.name}
                  onChange={(e) => setNewProduce({ ...newProduce, name: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small text-muted">Category</label>
                  <select 
                    className="form-select"
                    value={newProduce.category}
                    onChange={(e) => setNewProduce({ ...newProduce, category: e.target.value })}
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="dairy">Dairy</option>
                    <option value="bakery">Baked Goods</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Unit</label>
                  <select 
                    className="form-select"
                    value={newProduce.unit}
                    onChange={(e) => setNewProduce({ ...newProduce, unit: e.target.value })}
                  >
                    <option value="kg">per kg</option>
                    <option value="bunch">per bunch</option>
                    <option value="box">per box</option>
                    <option value="liter">per liter</option>
                    <option value="loaf">per loaf</option>
                  </select>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small text-muted">Price ($ / Rs)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="form-control" 
                    placeholder="e.g. 3.50"
                    value={newProduce.price}
                    onChange={(e) => setNewProduce({ ...newProduce, price: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Initial Stock Quantity</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 30"
                    value={newProduce.stockQuantity}
                    onChange={(e) => setNewProduce({ ...newProduce, stockQuantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button type="button" className="btn btn-light rounded-pill px-3" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary rounded-pill px-4 text-white">
                  Add to Stall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stall Setup & Application Modal */}
      {isStallModalOpen && (
        <div 
          className="farmer-stall-modal position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1085, overflowY: 'auto' }}
        >
          <div className="bg-white rounded-4 shadow-lg p-4 w-100" style={{ maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 bg-success text-white rounded-3">
                  <i className="fa fa-store fs-5"></i>
                </div>
                <div>
                  <h5 className="modal-title fw-bold mb-0 text-dark">Stall Setup & Application</h5>
                  <small className="text-muted">Apna stall configure karein aur approval k liye bhejein</small>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setIsStallModalOpen(false)}
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={handleSubmitStall}>
              <div className="row g-3">
                {/* Stall / Farm Name */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">
                    Stall / Farm Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fa fa-tractor text-success"></i>
                    </span>
                    <input 
                      type="text" 
                      className="form-control border-start-0" 
                      placeholder="e.g. Al-Madina Organic Produce"
                      value={stallForm.farm_name}
                      onChange={(e) => setStallForm({ ...stallForm, farm_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Stall Number */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">
                    Stall Number <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fa fa-hashtag text-success"></i>
                    </span>
                    <input 
                      type="text" 
                      className="form-control border-start-0 font-monospace text-uppercase" 
                      placeholder="e.g. Stall #B-09"
                      value={stallForm.stall_number}
                      onChange={(e) => setStallForm({ ...stallForm, stall_number: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Stall Category / Specialty */}
                <div className="col-12">
                  <label className="form-label small fw-semibold text-dark">
                    Kis Cheez Ka Stall Hai? (Category) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fa fa-tag text-success"></i>
                    </span>
                    <select
                      className="form-select border-start-0"
                      value={stallForm.stall_category}
                      onChange={(e) => setStallForm({ ...stallForm, stall_category: e.target.value })}
                      required
                    >
                      <option value="Organic Vegetables & Fresh Greens">Organic Vegetables & Fresh Greens</option>
                      <option value="Fresh Farm Dairy, Milk & Desi Ghee">Fresh Farm Dairy, Milk & Desi Ghee</option>
                      <option value="Seasonal Fresh Fruits & Citrus">Seasonal Fresh Fruits & Citrus</option>
                      <option value="Desi Poultry & Farm Fresh Eggs">Desi Poultry & Farm Fresh Eggs</option>
                      <option value="Herbs, Spices & Natural Sidr Honey">Herbs, Spices & Natural Sidr Honey</option>
                      <option value="Farm Bakery, Whole Grains & Flours">Farm Bakery, Whole Grains & Flours</option>
                      <option value="Hydroponic Greens & Microgreens">Hydroponic Greens & Microgreens</option>
                      <option value="Artisanal Organic Food Products">Artisanal Organic Food Products</option>
                    </select>
                  </div>
                </div>

                {/* Country Selection Chips */}
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <label className="form-label small fw-bold text-success text-uppercase mb-0">
                      <i className="fa fa-globe me-1"></i> Choose Country / ملک منتخب کریں:
                    </label>
                  </div>
                  <div className="d-flex flex-wrap gap-1">
                    {COUNTRIES_CONFIG.map((cntry) => {
                      const isSel =
                        (stallForm.country || '').toLowerCase() === cntry.name.toLowerCase() ||
                        (stallForm.country || '').toLowerCase() === cntry.code.toLowerCase();
                      return (
                        <button
                          key={cntry.code}
                          type="button"
                          className={`btn btn-sm ${isSel ? 'btn-success text-white fw-bold shadow-xs' : 'btn-outline-secondary'}`}
                          style={{ fontSize: '0.76rem', borderRadius: '16px', padding: '3px 12px' }}
                          onClick={() => handleCountrySelect(cntry.name)}
                        >
                          {isSel && <i className="fa fa-check me-1" style={{ fontSize: '9px' }}></i>}
                          {cntry.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick City Selection Chips for Active Country */}
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <label className="form-label small fw-bold text-success text-uppercase mb-0">
                      <i className="fa fa-city me-1"></i> Choose City in {currentCountryConfig.name} / شہر منتخب کریں:
                    </label>
                    {availableCityMarkets.length > 0 && (
                      <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.72rem' }}>
                        <i className="fa fa-store me-1"></i>{availableCityMarkets.length} Bazars in {stallForm.city} ({currentCountryConfig.name})
                      </span>
                    )}
                  </div>
                  <div className="d-flex flex-wrap gap-1">
                    {currentCountryCities.map((c) => {
                      const cityName = c.name || c;
                      const isSel = (stallForm.city || '').toLowerCase() === cityName.toLowerCase();
                      return (
                        <button
                          key={cityName}
                          type="button"
                          className={`btn btn-sm ${isSel ? 'btn-success text-white fw-bold shadow-xs' : 'btn-outline-secondary'}`}
                          style={{ fontSize: '0.76rem', borderRadius: '16px', padding: '3px 12px' }}
                          onClick={() => handleCitySelect(cityName)}
                        >
                          {isSel && <i className="fa fa-check me-1" style={{ fontSize: '9px' }}></i>}
                          {c.label || cityName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Country */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">
                    Country / Mulk <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fa fa-globe text-success"></i>
                    </span>
                    <select
                      className="form-select border-start-0"
                      value={stallForm.country}
                      onChange={(e) => handleCountrySelect(e.target.value)}
                      required
                    >
                      {COUNTRIES_CONFIG.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">
                    City / Shehar <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fa fa-city text-success"></i>
                    </span>
                    <select
                      className="form-select border-start-0"
                      value={stallForm.city}
                      onChange={(e) => handleCitySelect(e.target.value)}
                      required
                    >
                      {currentCountryCities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.label || c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Assigned Market Hub filtered by City */}
                <div className="col-12">
                  <label className="form-label small fw-semibold text-dark d-flex justify-content-between align-items-center">
                    <span>
                      <i className="fa fa-store text-success me-1"></i>
                      Kis Bazar Mein Stall Lagana Hai? (Farmers Market Hub) <span className="text-danger">*</span>
                    </span>
                    {availableCityMarkets.length > 0 && (
                      <span className="badge bg-success text-white px-2 py-1" style={{ fontSize: '0.72rem' }}>
                        {availableCityMarkets.length} Bazars in {stallForm.city} ({currentCountryConfig.name})
                      </span>
                    )}
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fa fa-map-marker-alt text-success"></i>
                    </span>
                    <select
                      className="form-select border-start-0 fw-semibold"
                      value={stallForm.market_id}
                      onChange={(e) => setStallForm({ ...stallForm, market_id: e.target.value })}
                      required
                    >
                      {availableCityMarkets.length > 0 ? (
                        <>
                          <option value="">-- {stallForm.city} ({currentCountryConfig.name}) ka Bazar Select Karein --</option>
                          {availableCityMarkets.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} &bull; ({Array.isArray(m.operatingDays) ? m.operatingDays.join(', ') : m.operatingDays || 'Weekend'}) - {m.location || m.address}
                            </option>
                          ))}
                        </>
                      ) : (
                        <>
                          <option value="">-- Choose From {currentCountryConfig.name} Farmers Markets --</option>
                          {marketsList
                            .filter((m) => {
                              const mCountry = (m.country || '').toLowerCase().trim();
                              const mCountryCode = (m.countryCode || '').toLowerCase().trim();
                              return mCountry === currentCountryClean ||
                                     mCountryCode === currentCountryCode ||
                                     mCountry.includes(currentCountryClean);
                            })
                            .map((m) => (
                              <option key={m.id} value={m.id}>
                                [{m.city || currentCountryConfig.defaultCity}] {m.name} &bull; {m.location || m.address}
                              </option>
                            ))}
                        </>
                      )}
                    </select>
                  </div>
                  <small className="text-muted d-block mt-1">
                    Aapke muntakhib karda shehar <strong>({stallForm.city}, {currentCountryConfig.name})</strong> k mutabiq tamam local bazars list ho chuke hain.
                  </small>
                </div>

                {/* Items to Sell */}
                <div className="col-12">
                  <label className="form-label small fw-semibold text-dark">
                    Kya Cheezein Hongi? (Produce / Items to Sell) <span className="text-danger">*</span>
                  </label>
                  <textarea 
                    className="form-control" 
                    rows="2"
                    placeholder="e.g. Tomatoes, Organic Spinach, Mint, Carrots, Cucumbers, Potatoes"
                    value={stallForm.stall_items}
                    onChange={(e) => setStallForm({ ...stallForm, stall_items: e.target.value })}
                    required
                  ></textarea>
                  <small className="text-muted">Apne stall par farokht hone wali cheezon k naam comma (,) se alag likhein.</small>
                </div>

                {/* Stall Description */}
                <div className="col-12">
                  <label className="form-label small fw-semibold text-dark">
                    Stall Description / Organic Practices
                  </label>
                  <textarea 
                    className="form-control" 
                    rows="2"
                    placeholder="Describe your organic growing techniques, harvesting schedule, and pesticide-free guarantee..."
                    value={stallForm.bio}
                    onChange={(e) => setStallForm({ ...stallForm, bio: e.target.value })}
                  ></textarea>
                </div>

                {/* Cut-off Hours */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">Order Cut-Off Window</label>
                  <select
                    className="form-select"
                    value={stallForm.cutoff_hours}
                    onChange={(e) => setStallForm({ ...stallForm, cutoff_hours: e.target.value })}
                  >
                    <option value="2">2 Hours before pickup</option>
                    <option value="4">4 Hours before pickup (Standard)</option>
                    <option value="6">6 Hours before pickup</option>
                    <option value="12">12 Hours before pickup</option>
                  </select>
                </div>

                {/* Operating Days */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">Operating Days</label>
                  <div className="d-flex flex-wrap gap-2 pt-1">
                    {['Saturday', 'Sunday', 'Wednesday', 'Friday'].map((day) => {
                      const checked = stallForm.operating_days?.includes(day);
                      return (
                        <label key={day} className={`btn btn-sm ${checked ? 'btn-success text-white' : 'btn-outline-secondary'} rounded-pill`}>
                          <input
                            type="checkbox"
                            className="d-none"
                            checked={checked}
                            onChange={(e) => {
                              const newDays = e.target.checked
                                ? [...(stallForm.operating_days || []), day]
                                : (stallForm.operating_days || []).filter((d) => d !== day);
                              setStallForm({ ...stallForm, operating_days: newDays });
                            }}
                          />
                          <i className={`fa ${checked ? 'fa-check-circle' : 'fa-circle'} me-1`}></i>
                          {day}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center gap-2 pt-4 mt-3 border-top">
                <button 
                  type="button" 
                  className="btn btn-light rounded-pill px-4 text-muted" 
                  onClick={() => setIsStallModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success rounded-pill px-4 text-white fw-bold shadow-sm"
                  disabled={stallSubmitLoading}
                >
                  {stallSubmitLoading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                  ) : (
                    <><i className="fa fa-paper-plane me-2"></i>Submit for Admin Approval</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Weekly Sales & Accounting Statement Modal */}
      {isWeeklyReportOpen && (
        <div
          className="farmer-weekly-modal position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1085 }}
          onClick={() => setIsWeeklyReportOpen(false)}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-4"
            style={{ maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Printable Area */}
            <div id="weekly-statement-print-area">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                    <i className="fa fa-file-invoice-dollar fs-4"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">Weekly Stall Statement / ہفتہ وار حساب کتاب</h5>
                    <small className="text-muted">
                      {farmerName} &bull; {stallNumber} &bull; {marketName}
                    </small>
                  </div>
                </div>
                <div className="text-end">
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                    Statement Date: {new Date().toLocaleDateString()}
                  </span>
                  <button
                    type="button"
                    className="btn-close ms-2 no-print"
                    onClick={() => setIsWeeklyReportOpen(false)}
                  ></button>
                </div>
              </div>

              {/* 4 Financial KPI Highlight Cards */}
              <div className="row g-2 mb-4">
                <div className="col-sm-3 col-6">
                  <div className="bg-light p-3 rounded-3 text-center border">
                    <small className="text-muted text-uppercase d-block fw-semibold" style={{ fontSize: '0.72rem' }}>Total Orders</small>
                    <h4 className="fw-bold text-dark mb-0">{stallOrders.length}</h4>
                  </div>
                </div>
                <div className="col-sm-3 col-6">
                  <div className="bg-light p-3 rounded-3 text-center border">
                    <small className="text-muted text-uppercase d-block fw-semibold" style={{ fontSize: '0.72rem' }}>Settled & Paid</small>
                    <h4 className="fw-bold text-success mb-0">{completedOrders.length}</h4>
                  </div>
                </div>
                <div className="col-sm-3 col-6">
                  <div className="bg-light p-3 rounded-3 text-center border">
                    <small className="text-muted text-uppercase d-block fw-semibold" style={{ fontSize: '0.72rem' }}>Ready / Pending</small>
                    <h4 className="fw-bold text-warning mb-0">{pendingOrders.length + readyOrders.length}</h4>
                  </div>
                </div>
                <div className="col-sm-3 col-6">
                  <div className="bg-success bg-opacity-10 p-3 rounded-3 text-center border border-success">
                    <small className="text-success text-uppercase d-block fw-bold" style={{ fontSize: '0.72rem' }}>Settled Revenue</small>
                    <h4 className="fw-bold text-success mb-0">{formatPrice(totalRevenue)}</h4>
                  </div>
                </div>
              </div>

              {/* Item-Wise Sales Breakdown */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2">
                  <i className="fa fa-boxes text-success me-1"></i> Harvest & Produce Breakdown
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered align-middle mb-0">
                    <thead className="table-light small text-uppercase">
                      <tr>
                        <th>Item Description</th>
                        <th className="text-center">Total Quantity Ordered</th>
                        <th className="text-end">Revenue Status</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {Array.from(
                        stallOrders
                          .flatMap((o) => o.items || [])
                          .reduce((map, item) => {
                            const key = item.name;
                            const prev = map.get(key) || { name: item.name, quantity: 0, unit: item.unit || 'kg' };
                            prev.quantity += Number(item.quantity || 1);
                            map.set(key, prev);
                            return map;
                          }, new Map())
                          .values()
                      ).map((it, idx) => (
                        <tr key={idx}>
                          <td><strong>{it.name}</strong></td>
                          <td className="text-center">{it.quantity} {it.unit}</td>
                          <td className="text-end text-success fw-semibold">Recorded</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Orders Ledger */}
              <div className="mb-3">
                <h6 className="fw-bold text-dark mb-2">
                  <i className="fa fa-list-alt text-primary me-1"></i> Order Transactions Ledger
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm table-striped align-middle mb-0">
                    <thead className="table-light small text-uppercase">
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Slot</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment Note</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {stallOrders.map((o) => (
                        <tr key={o.id}>
                          <td><code>{o.id}</code></td>
                          <td>{o.customerName}<br /><small className="text-muted">{o.customerPhone}</small></td>
                          <td>{(o.items || []).map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}</td>
                          <td>{o.timeSlot}</td>
                          <td><strong>{formatPrice(o.totalAmount)}</strong></td>
                          <td>
                            <span className={`badge ${o.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {o.status === 'completed' ? 'Paid' : o.status}
                            </span>
                          </td>
                          <td><small className="text-muted">{o.paymentNote || 'Standard cash'}</small></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signature Block for Official Printouts */}
              <div className="row pt-4 mt-4 border-top text-center" style={{ fontSize: '0.8rem' }}>
                <div className="col-6">
                  <div className="border-top pt-2 mx-auto" style={{ maxWidth: '200px' }}>
                    <strong>Stall Owner / Manager</strong><br />
                    <span className="text-muted">{farmerName}</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border-top pt-2 mx-auto" style={{ maxWidth: '200px' }}>
                    <strong>Market Inspector / Verifier</strong><br />
                    <span className="text-muted">{marketName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="d-flex justify-content-between align-items-center gap-2 pt-3 mt-3 border-top no-print">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4 text-muted"
                onClick={() => setIsWeeklyReportOpen(false)}
              >
                Close
              </button>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-success rounded-pill px-3 fw-semibold shadow-sm"
                  onClick={handleExportCSV}
                >
                  <i className="fa fa-file-excel me-1 text-success"></i> Download Excel Sheet (CSV)
                </button>
                <button
                  type="button"
                  className="btn btn-success rounded-pill px-4 text-white fw-bold shadow-sm"
                  onClick={handlePrintStatement}
                >
                  <i className="fa fa-print me-1"></i> Print Statement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Received Payment Modal */}
      {isEditPaymentModalOpen && orderToEditPayment && (
        <div
          className="farmer-edit-payment-modal position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1090 }}
          onClick={() => setIsEditPaymentModalOpen(false)}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-4"
            style={{ maxWidth: '480px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-warning bg-opacity-25 text-warning p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <i className="fa fa-pen"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Edit Received Payment</h5>
                  <small className="text-muted">ادائیگی کی رقم درست کریں</small>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsEditPaymentModalOpen(false)}
              ></button>
            </div>

            <div className="bg-light rounded p-3 mb-3 border small">
              <div className="row g-2">
                <div className="col-6">
                  <span className="text-muted d-block">Order ID:</span>
                  <strong className="text-primary font-monospace">{orderToEditPayment.id}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Customer:</span>
                  <strong className="text-dark">{orderToEditPayment.customerName}</strong>
                </div>
                <div className="col-12">
                  <span className="text-muted d-block">Items Ordered:</span>
                  <span className="text-dark">
                    {(orderToEditPayment.items || []).map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSavePaymentEdit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">
                  Received Cash Amount (Rs) / موصول شدہ نقد رقم <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light fw-bold text-success">Rs</span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    className="form-control form-control-lg fw-bold"
                    value={editPaymentAmount}
                    onChange={(e) => setEditPaymentAmount(e.target.value)}
                    required
                  />
                </div>
                <small className="text-muted">
                  Agr customer ne kam ya zyada ada kia, ya ghalti se amount ghalat likh di gai, to yahan theek karein.
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">
                  Payment & Order Status / اسٹیٹس
                </label>
                <select
                  className="form-select"
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                >
                  <option value="completed">Completed & Paid (مکمل نقد رقم وصول)</option>
                  <option value="ready_for_pickup">Ready for Pickup (تیار ہے - ادائیگی باقی)</option>
                  <option value="accepted">Accepted (آرڈر قبول شدہ)</option>
                  <option value="cancelled">Cancelled (منسوخ)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">
                  Correction Reason / Note (وجہ / وضاحتی نوٹ)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Extra 1kg discount, Customer added mint, Typo correction"
                  value={editPaymentNote}
                  onChange={(e) => setEditPaymentNote(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4 text-muted"
                  onClick={() => setIsEditPaymentModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success rounded-pill px-4 text-white fw-bold shadow-sm"
                >
                  <i className="fa fa-save me-1"></i> Save & Recalculate
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
          isFarmerView={true}
        />
      )}
    </>
  );
}
