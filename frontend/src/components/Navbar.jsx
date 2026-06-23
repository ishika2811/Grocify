import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Search, LogOut, LayoutDashboard, History, Leaf } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogoutClick = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">
        <Leaf size={28} style={{ color: '#10b981', fill: 'rgba(16, 185, 129, 0.2)' }} />
        <span>Grocify</span>
      </Link>

      {/* Hide search bar on Admin pages */}
      {!location.pathname.startsWith('/admin') && (
        <form onSubmit={handleSearchSubmit} className="nav-search">
          <input
            type="text"
            placeholder="Search fresh groceries..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <Search size={18} className="nav-search-icon" />
        </form>
      )}

      <nav className="nav-links">
        <Link to="/" className="nav-item">
          <span>Shop</span>
        </Link>

        <Link to="/cart" className="nav-item cart-icon-container">
          <ShoppingCart size={20} />
          {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          <span>Cart</span>
        </Link>

        {user ? (
          <div className="user-menu">
            <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <User size={18} />
              <span>{user.name.split(' ')[0]}</span>
            </button>

            {dropdownOpen && (
              <div className="user-dropdown" onMouseLeave={() => setDropdownOpen(false)}>
                {user.isAdmin && (
                  <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <LayoutDashboard size={16} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <History size={16} />
                  <span>My Orders</span>
                </Link>
                <button onClick={handleLogoutClick} className="dropdown-item" style={{ color: 'var(--danger)' }}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-item">
            <User size={18} />
            <span>Login</span>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
