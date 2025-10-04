"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  // API base URL
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [isAuthenticated, token]);

  const fetchCart = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, variantId, quantity = 1) => {
    if (!token) {
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      const response = await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, variantId, quantity }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.data.cart);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const updateCartItem = async (productId, variantId, quantity) => {
    if (!token) return { success: false, message: 'Please login to update cart' };

    try {
      const response = await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, variantId, quantity }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.data.cart);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Update cart error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const removeFromCart = async (productId, variantId) => {
    if (!token) return { success: false, message: 'Please login to remove items from cart' };

    try {
      const response = await fetch(`${API_BASE}/cart/item`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, variantId }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.data.cart);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const clearCart = async () => {
    if (!token) return { success: false, message: 'Please login to clear cart' };

    try {
      const response = await fetch(`${API_BASE}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCart({ items: [] });
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Clear cart error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => total + (item.priceSnapshot * item.quantity), 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
