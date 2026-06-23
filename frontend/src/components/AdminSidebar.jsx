import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ClipboardList, ArrowLeft, Leaf } from 'lucide-react';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <Link to="/" className="admin-logo">
        <Leaf size={24} style={{ color: '#10b981', fill: 'rgba(16, 185, 129, 0.2)' }} />
        <span>Grocify Admin</span>
      </Link>
      <nav className="admin-menu">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive ? 'admin-menu-item active' : 'admin-menu-item'
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive ? 'admin-menu-item active' : 'admin-menu-item'
          }
        >
          <ShoppingBag size={20} />
          <span>Products</span>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive ? 'admin-menu-item active' : 'admin-menu-item'
          }
        >
          <ClipboardList size={20} />
          <span>Orders</span>
        </NavLink>
        
        <hr style={{ border: '0', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '1rem 0' }} />
        
        <Link to="/" className="admin-menu-item" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={20} />
          <span>Back to Shop</span>
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
