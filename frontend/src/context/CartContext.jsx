/**
 * MarketLink - Customer Cart Context
 * Multi-stall pre-order basket state management
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'marketlink_cart_state';

const INITIAL_CART = [
  {
    product: {
      id: 1,
      name: 'Heirloom Vine Tomato',
      price: 4.50,
      unit: 'kg',
      stockQuantity: 45,
      farmerId: '2',
      farmerName: 'Oak Ridge Organics',
      marketId: '1',
      marketName: 'Liberty Farmers Market',
      image: '/img/product-1.jpg'
    },
    quantity: 2
  }
];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  const [pickupDate, setPickupDate] = useState('2026-09-30');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('08:30 AM - 10:30 AM');
  const [orderNotes, setOrderNotes] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // storage unavailable
    }
  }, [cartItems]);

  // Load active cart from backend if authenticated
  useEffect(() => {
    let isMounted = true;
    async function loadBackendCart() {
      const token = localStorage.getItem('marketlink_token');
      if (token && !token.startsWith('offline_')) {
        try {
          const res = await cartAPI.getCart();
          if (isMounted && res?.items && res.items.length > 0) {
            const mapped = res.items.map((it) => ({
              cartItemId: it.cart_item_id,
              product: {
                id: it.product_id,
                name: it.product_name,
                price: it.unit_price,
                unit: it.unit,
                stockQuantity: it.available_stock,
                farmerId: String(it.farmer_id),
                farmerName: it.farm_name || it.farmer_name || 'Oak Ridge Organics',
                image: it.image || '/img/product-1.jpg'
              },
              quantity: it.quantity
            }));
            setCartItems(mapped);
          }
        } catch {
          // Graceful fallback to cached cart
        }
      }
    }
    loadBackendCart();
    return () => { isMounted = false; };
  }, []);

  const addToCart = (product, quantity = 1) => {
    const existingIndex = cartItems.findIndex((item) => item.product.id === product.id);

    if (existingIndex > -1) {
      const currentQty = cartItems[existingIndex].quantity;
      const nextQty = currentQty + quantity;

      if (product.stockQuantity !== undefined && nextQty > product.stockQuantity) {
        return {
          success: false,
          message: `Cannot add more. Maximum available stock is ${product.stockQuantity} ${product.unit}.`
        };
      }

      const updated = [...cartItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: nextQty
      };
      setCartItems(updated);

      // Async backend sync
      const token = localStorage.getItem('marketlink_token');
      if (token && !token.startsWith('offline_')) {
        cartAPI.addToCart(product.id, quantity).catch(() => {});
      }

      return { success: true, message: `Updated ${product.name} quantity to ${nextQty}.` };
    }

    if (product.stockQuantity !== undefined && quantity > product.stockQuantity) {
      return {
        success: false,
        message: `Only ${product.stockQuantity} ${product.unit} available in stock.`
      };
    }

    setCartItems([...cartItems, { product, quantity }]);

    // Async backend sync
    const token = localStorage.getItem('marketlink_token');
    if (token && !token.startsWith('offline_')) {
      cartAPI.addToCart(product.id, quantity).catch(() => {});
    }

    return { success: true, message: `Added ${product.name} to pre-order basket.` };
  };

  const removeFromCart = (productId) => {
    const targetItem = cartItems.find((item) => item.product.id === productId);
    setCartItems(cartItems.filter((item) => item.product.id !== productId));

    if (targetItem?.cartItemId) {
      const token = localStorage.getItem('marketlink_token');
      if (token && !token.startsWith('offline_')) {
        cartAPI.removeItem(targetItem.cartItemId).catch(() => {});
      }
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const targetItem = cartItems.find((item) => item.product.id === productId);

    setCartItems(
      cartItems.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stockQuantity ?? Infinity;
          const clamped = Math.min(newQuantity, maxStock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );

    if (targetItem?.cartItemId) {
      const token = localStorage.getItem('marketlink_token');
      if (token && !token.startsWith('offline_')) {
        cartAPI.updateQuantity(targetItem.cartItemId, newQuantity).catch(() => {});
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
    const token = localStorage.getItem('marketlink_token');
    if (token && !token.startsWith('offline_')) {
      cartAPI.clearCart().catch(() => {});
    }
  };

  /**
   * Cash-on-Pickup Checkout (Atomically creates orders per farmer)
   */
  const checkoutCart = async (checkoutPayload = {}) => {
    setLoading(true);
    const token = localStorage.getItem('marketlink_token');

    try {
      if (token && !token.startsWith('offline_')) {
        const payload = {
          pickup_date: checkoutPayload.pickupDate || pickupDate,
          pickup_time_slot: checkoutPayload.pickupTimeSlot || pickupTimeSlot,
          farmer_notes: checkoutPayload.orderNotes || orderNotes || 'Cash on Pickup'
        };

        const res = await cartAPI.checkout(payload);

        if (res.success && res.data) {
          clearCart();
          const placedOrders = res.data.orders_placed || [res.data];
          return {
            success: true,
            orders: placedOrders,
            primaryOrder: placedOrders[0],
            message: res.message || 'Pre-order created successfully'
          };
        } else if (res.message && !res.isOffline) {
          return {
            success: false,
            message: res.message || 'Checkout failed due to cutoff or availability'
          };
        }
      }

      // Local order fallback if backend is offline
      let savedUser = null;
      try {
        savedUser = JSON.parse(localStorage.getItem('marketlink_user') || 'null');
      } catch {
        savedUser = null;
      }

      const fallbackOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: savedUser?.id || 6,
        customerName: savedUser?.name || 'Hamza Ali',
        customerPhone: savedUser?.phone || '+92 300 1234567',
        farmerId: cartItems[0]?.product?.farmerId || 2,
        farmerName: cartItems[0]?.product?.farmerName || 'Punjab Green Organics',
        stallNumber: cartItems[0]?.product?.stallNumber || 'Stall #A-04',
        marketName: cartItems[0]?.product?.marketName || 'Liberty Farmers Market',
        pickupDate: checkoutPayload.pickupDate || pickupDate,
        timeSlot: checkoutPayload.pickupTimeSlot || pickupTimeSlot,
        notes: checkoutPayload.orderNotes || orderNotes || 'Cash on stall pickup',
        pickupToken: `PKP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: 'placed',
        totalAmount: subtotal,
        placedAt: new Date().toISOString(),
        items: cartItems.map((it) => ({
          id: it.product.id,
          name: it.product.name,
          quantity: it.quantity,
          unit: it.product.unit,
          price: it.product.price
        }))
      };

      clearCart();
      return {
        success: true,
        orders: [fallbackOrder],
        primaryOrder: fallbackOrder,
        isFallback: true
      };
    } finally {
      setLoading(false);
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkoutCart,
    loading,
    totalItems,
    subtotal,
    isEmpty: cartItems.length === 0,
    pickupDate,
    setPickupDate,
    pickupTimeSlot,
    setPickupTimeSlot,
    orderNotes,
    setOrderNotes,
    isDrawerOpen,
    setIsDrawerOpen
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
