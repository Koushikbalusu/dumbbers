"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CiHeart } from 'react-icons/ci';
import './WishlistButton.css';

export default function WishlistButton({ productId }) {
  const { isAuthenticated } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, productId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const isInList = data.data.items.some(item => item._id === productId);
        setIsInWishlist(isInList);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${productId}`;
      const method = isInWishlist ? 'DELETE' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsInWishlist(!isInWishlist);
        
        // Dispatch custom event to notify other components
        if (isInWishlist) {
          // Item was removed from wishlist
          window.dispatchEvent(new CustomEvent('wishlistItemRemoved', { 
            detail: { productId } 
          }));
        } else {
          // Item was added to wishlist
          window.dispatchEvent(new CustomEvent('wishlistItemAdded', { 
            detail: { productId } 
          }));
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Always show the button, but handle authentication in the click handler

  return (
    <button
      className={`wishlist-button ${isInWishlist ? 'active' : ''} ${!isAuthenticated ? 'unauthenticated' : ''}`}
      onClick={toggleWishlist}
      disabled={loading}
      title={!isAuthenticated ? 'Login to add to wishlist' : (isInWishlist ? 'Remove from wishlist' : 'Add to wishlist')}
    >
      <CiHeart />
    </button>
  );
}
