"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Productcard from '../components/Productcard';
import styles from './wishlist.module.css';
import AuthModal from '../components/AuthModal';

export default function WishlistPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Listen for wishlist changes from other components
  useEffect(() => {
    const handleWishlistItemRemoved = (event) => {
      const { productId } = event.detail;
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
    };

    const handleWishlistItemAdded = (event) => {
      // Optionally refresh the entire wishlist to get the new item
      if (isAuthenticated) {
        fetchWishlist();
      }
    };

    window.addEventListener('wishlistItemRemoved', handleWishlistItemRemoved);
    window.addEventListener('wishlistItemAdded', handleWishlistItemAdded);

    return () => {
      window.removeEventListener('wishlistItemRemoved', handleWishlistItemRemoved);
      window.removeEventListener('wishlistItemAdded', handleWishlistItemAdded);
    };
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No auth token found. Please sign in again.');
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.data.items || []);
      } else {
        setError('Failed to fetch wishlist. Please try again.');
      }
    } catch (error) {
      setError('Error fetching wishlist. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };


  if (!isAuthenticated) {
    return (
      <div className={styles.wishlistContainer}>
        <div className={styles.loginPrompt}>
          <h2>Sign in to view your wishlist</h2>
          <p>Save your favorite items and access them anytime</p>
          <button 
            className={styles.loginButton}
            onClick={() => setAuthModalOpen(true)}
          >
            Sign In
          </button>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.wishlistContainer}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wishlistContainer}>
        <div className={styles.errorState}>
          <h2>Error</h2>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={fetchWishlist}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wishlistContainer}>
      <div className={styles.wishlistHeader}>
        <h1>My Wishlist</h1>
        <p>Your favorite items saved for later</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className={styles.emptyWishlist}>
          <div className={styles.emptyIcon}>♡</div>
          <h2>Your wishlist is empty</h2>
          <p>Start adding items you love to your wishlist</p>
          <button 
            className={styles.browseButton}
            onClick={() => router.push('/')}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className={styles.wishlistContent}>
          <div className={styles.wishlistInfo}>
            <span className={styles.itemCount}>{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className={styles.wishlistGrid}>
            {wishlistItems.map((product) => (
              <Productcard
                key={product._id}
                prodId={product._id}
                prodName={product.name}
                imageUrl={product.images?.[0] || '/placeholder.jpg'}
                prodDiscription={product.description}
                prodPrice={product.variants?.[0]?.price || 0}
                prodMrp={product.variants?.[0]?.mrp || null}
                prodSlug={product.slug}
                images={product.images || []}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
