import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';

// User Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';

// User Route Layout Wrapper
const UserLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

// Protected Routes (must be logged in)
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading session...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Admin Protection Wrapper
const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading session...</div>;
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* User facing paths */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<CartPage />} />
              
              {/* Authenticated Customer Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
              </Route>
            </Route>

            {/* Authenticated Admin Routes (no User Header) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Route>
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
