"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const { cart, getCartTotal } = useCart();
  const { token, getAddresses } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const router = useRouter();

  // Fetch cart items with product details
  const fetchCartItems = async () => {
    setCartLoading(true);
    try {
      const items = await Promise.all(
        cart.items.map(async (item) => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${item.product}`);
            const data = await response.json();
            if (data.success) {
              const product = data.data.product;
              const variant = product.variants.find(v => v._id === item.variantId);
              return {
                ...item,
                product,
                variant
              };
            }
            return null;
          } catch (error) {
            console.error("Error fetching product details:", error);
            return null;
          }
        })
      );
      setCartItems(items.filter(Boolean));
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setCartLoading(false);
    }
  };

  // Razorpay order creation and payment
  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      if (!selectedAddressId) {
        throw new Error("Please select a shipping address.");
      }
      // 1. Create order with selected address
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ addressId: selectedAddressId })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) throw new Error(orderData.message || "Order creation failed");
      const orderId = orderData.data.order._id;
      // 2. Create Razorpay order
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      console.log('Razorpay order backend response:', data);
      if (!res.ok || !data.success) throw new Error(data.message || "Razorpay order creation failed");

      const options = {
        key: data.data.keyId, // Razorpay key_id from backend
        amount: data.data.amount,
        currency: data.data.currency,
        order_id: data.data.razorpayOrderId,
        name: "Dumbbers",
        description: "Order Payment",
        handler: async function (response) {
          // Call backend to verify payment
          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              orderId: data.data.orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push("/profile?tab=orders");
          } else {
            setError("Payment verification failed");
          }
        },
        prefill: {},
        theme: { color: "#000" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load Razorpay script
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Fetch cart items and addresses
    const initializeCheckout = async () => {
      await fetchCartItems();
      
      const addrResult = await getAddresses();
      if (addrResult.success && addrResult.data.length) {
        setAddresses(addrResult.data);
        // Select default or first address
        const defaultAddr = addrResult.data.find(a => a.isDefault) || addrResult.data[0];
        setSelectedAddressId(defaultAddr._id);
      }
    };
    
    initializeCheckout();
  }, [getAddresses, cart.items]);

  // Show loading overlay during payment processing
  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Processing Payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutHeader}>
        <h1 className={styles.checkoutTitle}>Checkout</h1>
        <p className={styles.checkoutSubtitle}>Complete your order securely</p>
      </div>

      <div className={styles.checkoutContent}>
        <div className={styles.checkoutMain}>
          {/* Shipping Address Section */}
          <div className={styles.checkoutSection}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>
            {addresses.length === 0 ? (
              <div className={styles.noAddressMessage}>
                <p>No addresses found. Please add an address in your profile.</p>
                <Link href="/profile?tab=addresses" className={styles.addAddressLink}>
                  Add Address
                </Link>
              </div>
            ) : (
              <div className={styles.addressList}>
                {addresses.map(addr => (
                  <div
                    key={addr._id}
                    className={`${styles.addressItem} ${selectedAddressId === addr._id ? styles.selected : ''}`}
                    onClick={() => setSelectedAddressId(addr._id)}
                  >
                    <input
                      type="radio"
                      name="shippingAddress"
                      value={addr._id}
                      checked={selectedAddressId === addr._id}
                      onChange={() => setSelectedAddressId(addr._id)}
                      className={styles.addressRadio}
                    />
                    <div className={styles.addressDetails}>
                      <h3 className={styles.addressName}>{addr.name}</h3>
                      <p className={styles.addressText}>
                        {addr.line1}
                        {addr.line2 && `, ${addr.line2}`}
                        <br />
                        {addr.city}, {addr.state} {addr.pincode}
                        <br />
                        {addr.country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className={styles.orderSummary}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            {cartLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div className={styles.loadingSpinner} style={{ margin: '0 auto 1rem auto' }}></div>
                <p>Loading items...</p>
              </div>
            ) : (
              <>
                <div className={styles.orderItems}>
                  {cartItems.map((item, index) => (
                    <div key={`${item.product._id}-${item.variantId}`} className={styles.orderItem}>
                      <div className={styles.itemImage}>
                        <Image
                          src={item.product.images?.[0] || '/placeholder.jpg'}
                          alt={item.product.name}
                          width={60}
                          height={60}
                        />
                      </div>
                      <div className={styles.itemDetails}>
                        <h4 className={styles.itemName}>{item.product.name}</h4>
                        <p className={styles.itemVariant}>
                          Size: {item.variant?.size} | Color: {item.variant?.color}
                        </p>
                        <p className={styles.itemQuantity}>Qty: {item.quantity}</p>
                      </div>
                      <div className={styles.itemPrice}>
                        ₹{item.priceSnapshot * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.summaryTotals}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Subtotal</span>
                    <span className={styles.summaryValue}>₹{getCartTotal()}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Shipping</span>
                    <span className={styles.summaryValue}>Free</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Tax</span>
                    <span className={styles.summaryValue}>₹0</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span className={styles.summaryLabel}>Total</span>
                    <span className={styles.summaryValue}>₹{getCartTotal()}</span>
                  </div>
                </div>

                <button
                  className={styles.paymentButton}
                  onClick={handlePayment}
                  disabled={loading || !selectedAddressId || cartItems.length === 0}
                >
                  {loading ? "Processing..." : "Pay with Razorpay"}
                </button>

                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
