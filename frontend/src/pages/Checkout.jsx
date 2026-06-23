import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Truck, CreditCard, ShoppingBag, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { user, token, backendUrl } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const navigate = useNavigate();

  // Form states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate]);

  const shippingCost = cartTotal > 20 ? 0.0 : 3.99;
  const grandTotal = cartTotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!address || !city || !postalCode) {
      setError('Please fill in all delivery details');
      return;
    }

    setSubmitting(true);

    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        product: item.product
      })),
      shippingAddress: {
        address,
        city,
        postalCode
      },
      totalPrice: grandTotal
    };

    try {
      const response = await fetch(`${backendUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error placing order');
      }

      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page animate-fade-in">
      <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Truck size={28} />
        <span>Secure Checkout</span>
      </h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="cart-layout">
        {/* Delivery Details Form */}
        <form onSubmit={handleSubmit} className="cart-items-container">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            Delivery Details
          </h3>

          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              placeholder="e.g. Apartment, suite, unit, 123 Main St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                placeholder="e.g. New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postal">Postal / Zip Code</label>
              <input
                type="text"
                id="postal"
                placeholder="e.g. 10001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '1.2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            Payment Method
          </h3>

          <div className="form-check" style={{ border: '1px solid var(--border)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--background)' }}>
            <input
              type="radio"
              id="cod"
              name="payment"
              checked={paymentMethod === 'Cash on Delivery'}
              onChange={() => setPaymentMethod('Cash on Delivery')}
            />
            <label htmlFor="cod" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer', margin: 0 }}>
              <CreditCard size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <span>Cash on Delivery (COD)</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                  Pay cash or card at your doorstep when products arrive.
                </span>
              </div>
            </label>
          </div>

          <button type="submit" className="auth-btn" style={{ marginTop: '1.5rem' }} disabled={submitting}>
            {submitting ? 'Placing Order...' : `Place Order ($${grandTotal.toFixed(2)})`}
          </button>
        </form>

        {/* Order review */}
        <div className="cart-summary-card">
          <h3 className="summary-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShoppingBag size={18} />
            <span>Review Items</span>
          </h3>
          
          <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.4rem' }}>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{item.qty}x</span> {item.name}
                </div>
                <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link to="/cart" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <ArrowLeft size={14} />
              <span>Back to Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
