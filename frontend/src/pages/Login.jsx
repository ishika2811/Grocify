import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const { login, user, error, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = user.isAdmin ? '/admin' : '/';
      navigate(redirectPath);
    }
  }, [user, navigate]);

  // Synchronize context errors
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      const data = await login(email, password);
      if (data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Handled by context state, but just in case
      console.error(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'inline-flex', padding: '0.8rem', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '1rem' }}>
            <LogIn size={24} />
          </div>
          <h2>Welcome Back</h2>
          <p>Log in to access your shopping cart and orders.</p>
        </div>

        {formError && <div className="error-alert">{formError}</div>}

        <div className="helper-alert">
          <strong>Quick Test Accounts:</strong><br />
          Customer: <code>user@grocify.com</code> / <code>user123</code><br />
          Admin: <code>admin@grocify.com</code> / <code>admin123</code>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="e.g. user@grocify.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
