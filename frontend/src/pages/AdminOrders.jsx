import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { Calendar, User, DollarSign, MapPin, CheckCircle, RefreshCw } from 'lucide-react';

const AdminOrders = () => {
  const { user, token, backendUrl } = useAuth();

  // States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${backendUrl}/orders`, {
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

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [backendUrl, token]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`${backendUrl}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status');
      }

      // Update in UI
      setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: data.orderStatus, isPaid: data.isPaid, paidAt: data.paidAt, deliveredAt: data.deliveredAt } : o));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaidToggle = async (id, currentPaidState) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`${backendUrl}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isPaid: !currentPaidState })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update payment status');
      }

      // Update in UI
      setOrders(orders.map(o => o._id === id ? { ...o, isPaid: data.isPaid, paidAt: data.paidAt } : o));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

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

  return (
    <div className="admin-container animate-fade-in">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-header-row">
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Manage Orders</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fulfill and update order statuses across all customer accounts.</p>
          </div>
          <button className="admin-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} onClick={fetchOrders}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', fontWeight: 500 }}>Loading orders catalog...</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer / Date</th>
                  <th>Delivery Address</th>
                  <th>Items Summary</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No customer orders found in the system yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord._id} style={{ opacity: updatingId === ord._id ? 0.6 : 1 }}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{ord.user ? ord.user.name : 'Deleted User'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                          <Calendar size={12} />
                          {formatDate(ord.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{ord.shippingAddress.address}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {ord.shippingAddress.city}, {ord.shippingAddress.postalCode}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', maxHeight: '60px', overflowY: 'auto' }}>
                          {ord.orderItems.map((item, idx) => (
                            <div key={idx}>
                              <strong>{item.qty}</strong> x {item.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>${ord.totalPrice.toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => handlePaidToggle(ord._id, ord.isPaid)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            backgroundColor: ord.isPaid ? 'var(--success-light)' : 'var(--danger-light)',
                            color: ord.isPaid ? 'var(--success)' : 'var(--danger)',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: ord.isPaid ? 'var(--success)' : 'var(--danger)' }}></span>
                          {ord.isPaid ? 'Paid' : 'Unpaid'}
                        </button>
                      </td>
                      <td>
                        <select
                          className={getStatusClass(ord.orderStatus)}
                          style={{ border: '1px solid var(--border)', fontSize: '0.85rem', padding: '4px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
                          value={ord.orderStatus}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrders;
