"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './OrderHistory.module.css';

export default function OrderHistory() {
  const { getOrders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'created', label: 'Created' },
    { value: 'payment_pending', label: 'Payment Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'fulfilled', label: 'Fulfilled' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'failed', label: 'Failed' }
  ];

  const fetchOrders = async (page = 1, status = '') => {
    setLoading(true);
    setError('');
    
    try {
      const result = await getOrders(page, 10, status);
      
      if (result.success) {
        setOrders(result.data.items || []);
        setTotalPages(result.data.pages || 1);
        setCurrentPage(page);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, statusFilter);
  }, [statusFilter]);

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (page) => {
    fetchOrders(page, statusFilter);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (paise) => {
    return `₹${(paise / 100).toFixed(2)}`;
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      created: 'status-created',
      payment_pending: 'status-pending',
      paid: 'status-paid',
      fulfilled: 'status-fulfilled',
      cancelled: 'status-cancelled',
      refunded: 'status-refunded',
      failed: 'status-failed'
    };

    return (
      <span className={`${styles.statusBadge} ${styles[statusStyles[status] || 'status-default']}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading && orders.length === 0) {
    return (
      <div className={styles.orderHistoryContainer}>
        <div className={styles.header}>
          <h2>Order History</h2>
          <p>View all your past and current orders</p>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderHistoryContainer}>
      <div className={styles.header}>
        <h2>Order History</h2>
        <p>View all your past and current orders</p>
      </div>

      {/* Order status filter removed as only paid orders are shown */}

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => fetchOrders(currentPage, statusFilter)} className={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <>
          <div className={styles.ordersList}>
            {orders.filter(order => order.status === 'paid').map((order) => (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className={styles.orderDate}>
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className={styles.orderStatus}>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {order.items.map((item, index) => (
                    <div key={index} className={styles.orderItem}>
                      <div className={styles.itemInfo}>
                        <h4>{item.name}</h4>
                        <p className={styles.itemDetails}>
                          Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                        </p>
                      </div>
                      <div className={styles.itemPrice}>
                        {formatCurrency(item.price * item.quantity * 100)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.orderTotal}>
                    <div className={styles.totalLine}>
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order.subtotalPaise)}</span>
                    </div>
                    {order.discountPercent > 0 && (
                      <div className={styles.totalLine}>
                        <span>Discount ({order.discountPercent}%):</span>
                        <span>-{formatCurrency(order.subtotalPaise * order.discountPercent / 100)}</span>
                      </div>
                    )}
                    {order.taxPaise > 0 && (
                      <div className={styles.totalLine}>
                        <span>Tax:</span>
                        <span>{formatCurrency(order.taxPaise)}</span>
                      </div>
                    )}
                    {order.shippingPaise > 0 && (
                      <div className={styles.totalLine}>
                        <span>Shipping:</span>
                        <span>{formatCurrency(order.shippingPaise)}</span>
                      </div>
                    )}
                    <div className={`${styles.totalLine} ${styles.totalAmount}`}>
                      <span>Total:</span>
                      <span>{formatCurrency(order.amountPaise)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.orderAddress}>
                  <h4>Shipping Address:</h4>
                  <p>
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.line1}<br />
                    {order.shippingAddress.line2 && `${order.shippingAddress.line2}<br />`}
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className={styles.paginationButton}
              >
                Previous
              </button>
              
              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                    className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
