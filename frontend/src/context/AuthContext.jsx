import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const BACKEND_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on start
  useEffect(() => {
    const storedUser = localStorage.getItem('grocify_user');
    const storedToken = localStorage.getItem('grocify_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      });
      setToken(data.token);
      localStorage.setItem('grocify_user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      }));
      localStorage.setItem('grocify_token', data.token);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password, isAdmin = false) => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, isAdmin }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      });
      setToken(data.token);
      localStorage.setItem('grocify_user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      }));
      localStorage.setItem('grocify_token', data.token);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('grocify_user');
    localStorage.removeItem('grocify_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, backendUrl: BACKEND_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
