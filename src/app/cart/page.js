"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthModal from '../components/AuthModal';
import styles from './cart.module.css';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { cart, updateCartItem, removeFromCart, clearCart, getCartTotal } = useCart();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, cart]);

  const fetchCartItems = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      console.log('Cart items:', cart.items);
      const items = await Promise.all(
        cart.items.map(async (item) => {
          try {
            const response = await fetch(`https://dumbbers-backend.onrender.com/api/products/${item.product}`);
            const data = await response.json();
            if (data.success) {
              const product = data.data.product;
              const variant = product.variants.find(v => v._id === item.variantId);
              return {
                ...item,
                product: product,
                variant: variant
              };
            }
            return null;
          } catch (error) {
            console.error('Error fetching product:', item.product, error);
            return null;
          }
        })
      );
      setCartItems(items.filter(Boolean));
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, variantId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId, variantId);
    } else {
      await updateCartItem(productId, variantId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId, variantId) => {
    await removeFromCart(productId, variantId);
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.cartContainer}>
        <div className={styles.loginPrompt}>
          <h2>Sign in to view your cart</h2>
          <p>Add items to your cart and proceed to checkout</p>
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
      <div className={styles.cartContainer}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <h1>Shopping Cart</h1>
        <p>Review your items before checkout</p>
      </div>

      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <h2>Your cart is empty</h2>
          <p>Add some items to get started</p>
          <button 
            className={styles.browseButton}
            onClick={() => router.push('/')}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            <div className={styles.cartItemsHeader}>
              <h2>Cart Items ({cartItems.length})</h2>
              <button 
                className={styles.clearCartButton}
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>
            
            <div className={styles.cartItemsList}>
              {cartItems.map((item, index) => (
                <div key={`${item.product._id}-${item.variantId}`} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.product.images?.[0] || '/placeholder.jpg'}
                      alt={item.product.name}
                      width={120}
                      height={120}
                      className={styles.productImage}
                    />
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.product.name}</h3>
                    <div className={styles.itemVariant}>
                      <span className={styles.variantSize}>Size: {item.variant?.size}</span>
                      <span className={styles.variantColor}>Color: {item.variant?.color}</span>
                    </div>
                    <div className={styles.itemPrice}>
                      ₹{item.priceSnapshot} each
                    </div>
                  </div>
                  
                  <div className={styles.itemQuantity}>
                    <button 
                      className={styles.quantityBtn}
                      onClick={() => handleQuantityChange(item.product._id, item.variantId, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button 
                      className={styles.quantityBtn}
                      onClick={() => handleQuantityChange(item.product._id, item.variantId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className={styles.itemTotal}>
                    <span className={styles.totalPrice}>₹{item.priceSnapshot * item.quantity}</span>
                  </div>
                  
                  <button 
                    className={styles.removeItemButton}
                    onClick={() => handleRemoveItem(item.product._id, item.variantId)}
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.cartSummary}>
            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax</span>
                <span>₹0</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <button 
                className={styles.checkoutButton}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
