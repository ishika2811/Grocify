import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart, ArrowLeft, ArrowRight, Plus, Minus } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartQty, cartTotal } = useCart();

  const shippingCost = cartTotal > 20 || cartTotal === 0 ? 0.0 : 3.99;
  const grandTotal = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart animate-fade-in">
        <div style={{ display: 'inline-flex', padding: '1.2rem', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '1rem' }}>
          <ShoppingCart size={40} />
        </div>
        <h2 className="empty-cart-title">Your Cart is Empty</h2>
        <p className="empty-cart-desc">Looks like you haven't added any fresh groceries to your cart yet.</p>
        <Link to="/" className="admin-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}>
          <ArrowLeft size={16} />
          <span>Start Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container animate-fade-in">
      <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShoppingCart size={28} />
        <span>Shopping Cart</span>
      </h2>

      <div className="cart-layout">
        {/* Cart items */}
        <div className="cart-items-container">
          {cartItems.map((item) => (
            <div key={item.product} className="cart-item">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="cart-item-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400';
                }}
              />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>Unit Price: ${item.price.toFixed(2)}</p>
                {item.stock < 5 && item.stock > 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600 }}>
                    Only {item.stock} left in stock!
                  </span>
                )}
              </div>
              <div className="cart-item-qty">
                <button
                  className="qty-btn"
                  onClick={() => updateCartQty(item.product, item.qty - 1)}
                  disabled={item.qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-val">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateCartQty(item.product, item.qty + 1)}
                  disabled={item.qty >= item.stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span className="cart-item-price">${(item.price * item.qty).toFixed(2)}</span>
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="btn-remove-item"
                  title="Remove item"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart summary */}
        <div className="cart-summary-card">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
          </div>
          {shippingCost > 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: '500' }}>
              * Spend $20.00 or more to get FREE shipping!
            </div>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="btn-checkout" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </Link>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <ArrowLeft size={14} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
