import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { DollarSign, ShoppingBag, Users, ClipboardList, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const { user, token, backendUrl } = useAuth();
  const navigate = useNavigate();

  // States
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Access validation
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${backendUrl}/orders/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch dashboard stats');
        }

        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [backendUrl, token]);

  if (!user || !user.isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--danger)', fontWeight: 700, marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You do not have administrative privileges to view this section.</p>
        <Link to="/" className="admin-btn" style={{ display: 'inline-flex', margin: '0 auto' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', fontWeight: 500 }}>Loading dashboard analytics...</div>;
  }

  if (error) {
    return <div className="error-alert">{error}</div>;
  }

  const { totalOrders, totalProducts, totalUsers, totalSales, statusCounts, recentOrders } = stats;

  return (
    <div className="admin-container animate-fade-in">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-header-row">
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Overview Dashboard</h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Welcome back, <strong>{user.name}</strong>
          </span>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon-wrapper sales">
              <DollarSign size={24} />
            </div>
            <div className="dashboard-card-info">
              <label>Total Sales</label>
              <h3>${totalSales.toFixed(2)}</h3>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon-wrapper orders">
              <ClipboardList size={24} />
            </div>
            <div className="dashboard-card-info">
              <label>Total Orders</label>
              <h3>{totalOrders}</h3>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon-wrapper products">
              <ShoppingBag size={24} />
            </div>
            <div className="dashboard-card-info">
              <label>Active Products</label>
              <h3>{totalProducts}</h3>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon-wrapper users">
              <Users size={24} />
            </div>
            <div className="dashboard-card-info">
              <label>Customers</label>
              <h3>{totalUsers}</h3>
            </div>
          </div>
        </div>

        {/* Widgets section */}
        <div className="dashboard-widgets">
          {/* Recent Orders */}
          <div className="widget-card">
            <h3 className="widget-title">Recent Orders</h3>
            <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
              {recentOrders.length === 0 ? (
                <div style={{ padding: '2rem 0', color: 'var(--text-muted)', textAlign: 'center' }}>No orders placed yet.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((ord) => (
                      <tr key={ord._id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                        </td>
                        <td>{ord.user ? ord.user.name : 'Deleted User'}</td>
                        <td style={{ fontWeight: 600 }}>${ord.totalPrice.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${ord.orderStatus.toLowerCase().replace(/ /g, '-')}`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Status breakdown progress bars */}
          <div className="widget-card">
            <h3 className="widget-title">Order Status Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {Object.keys(statusCounts).map((status) => {
                const count = statusCounts[status];
                const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                
                // Color mapping
                let barColor = 'var(--primary)';
                if (status === 'Pending') barColor = '#d97706';
                if (status === 'Processing') barColor = '#2563eb';
                if (status === 'Out for Delivery') barColor = '#9333ea';
                if (status === 'Delivered') barColor = '#059669';
                if (status === 'Cancelled') barColor = '#dc2626';

                return (
                  <div key={status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 500 }}>
                      <span>{status}</span>
                      <span>{count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: barColor, borderRadius: '4px', transition: 'width 0.8s ease' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
