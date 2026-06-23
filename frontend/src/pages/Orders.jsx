import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { History, Calendar, DollarSign, MapPin, Eye } from 'lucide-react';

const Orders = () => {
  const { user, token, backendUrl } = useAuth();
  const navigate = useNavigate();

  // States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${backendUrl}/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }

        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [backendUrl, token]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-badge pending';
      case 'Processing': return 'status-badge processing';
      case 'Out for Delivery': return 'status-badge out-for-delivery';
      case 'Delivered': return 'status-badge delivered';
      case 'Cancelled': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', fontWeight: 500 }}>Loading your order history...</div>;
  }

  if (error) {
    return <div className="error-alert">{error}</div>;
  }

  return (
    <div className="orders-page animate-fade-in">
      <h2 className="orders-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <History size={28} />
        <span>My Orders</span>
      </h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: '700' }}>No Orders Placed Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>You haven't placed any orders with Grocify yet. Fill your cart and checkout!</p>
          <Link to="/" className="admin-btn" style={{ display: 'inline-flex', margin: '0 auto' }}>
            Browse Fresh Groceries
          </Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              {/* Header card details */}
              <div className="order-header">
                <div className="order-meta">
                  <div className="meta-item">
                    <label>Order ID</label>
                    <span style={{ fontFamily: 'monospace' }}>#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                  </div>
                  <div className="meta-item">
                    <label>Placed On</label>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="meta-item">
                    <label>Total Price</label>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', color: 'var(--text-main)', fontWeight: 700 }}>
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div>
                  <span className={getStatusClass(order.orderStatus)}>{order.orderStatus}</span>
                </div>
              </div>

              {/* Items details */}
              <div className="order-body">
                <div className="order-item-list">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <span style={{ color: 'var(--text-muted)' }}>
                        <strong style={{ color: 'var(--text-main)' }}>{item.qty}</strong> x {item.name}
                      </span>
                      <span style={{ fontWeight: 500 }}>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-address" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} />
                    <span>Deliver to: {order.shippingAddress.address}, {order.shippingAddress.city} ({order.shippingAddress.postalCode})</span>
                  </div>
                  {order.isPaid ? (
                    <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>
                      Paid on Delivery
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>
                      Cash on Delivery
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
