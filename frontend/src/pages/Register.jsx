import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [formError, setFormError] = useState('');

  const { register, user, error, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = user.isAdmin ? '/admin' : '/';
      navigate(redirectPath);
    }
  }, [user, navigate]);

  // Sync validation errors
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(name, email, password, isAdmin);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'inline-flex', padding: '0.8rem', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '1rem' }}>
            <UserPlus size={24} />
          </div>
          <h2>Create Account</h2>
          <p>Register to start ordering fresh groceries.</p>
        </div>

        {formError && <div className="error-alert">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="e.g. jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password (min 6 chars)</label>
            <input
              type="password"
              id="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Verify your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <label htmlFor="isAdmin" style={{ margin: 0, fontWeight: 500, cursor: 'pointer' }}>
              Register as Administrator (for testing Admin Panel)
            </label>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
