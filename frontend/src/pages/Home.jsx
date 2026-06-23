import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const categories = ['All', 'Fruits & Vegetables', 'Dairy & Eggs', 'Bakery', 'Beverages'];

const Home = () => {
  const { backendUrl } = useAuth();
  const location = useLocation();
  
  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Extract search query parameter
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${backendUrl}/products`;
        const params = [];
        
        if (selectedCategory && selectedCategory !== 'All') {
          params.push(`category=${encodeURIComponent(selectedCategory)}`);
        }
        if (searchQuery) {
          params.push(`search=${encodeURIComponent(searchQuery)}`);
        }

        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backendUrl, selectedCategory, searchQuery]);

  const scrollToShop = () => {
    document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-container animate-fade-in">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-text">
          <h1>Fresh Groceries, <br />Delivered To Your Doorstep</h1>
          <p>Get high quality, organic fruits, vegetables, dairy products, bakery goods, and beverages at unbeatable prices, delivered within 30 minutes.</p>
          <button className="hero-btn" onClick={scrollToShop}>
            Shop Now
          </button>
        </div>
        <div className="hero-visual">
          <ShoppingBag size={48} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', textAlign: 'center' }}>Weekly Super Deal</h2>
          <p style={{ fontSize: '0.9rem', color: '#a7f3d0', textAlign: 'center' }}>Save up to 40% on fresh seasonal greens and organic farm eggs</p>
          <button onClick={scrollToShop} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'white', fontWeight: '600' }}>
            <span>Browse Deals</span> <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Catalog Section */}
      <div id="shop-section" style={{ scrollMarginTop: '100px' }}>
        {/* Categories Bar */}
        <section className="category-container">
          <div className="category-title">
            <span>Browse Categories</span>
          </div>
          <div className="category-list">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Catalog List */}
        <section>
          {searchQuery && (
            <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              Search results for "<strong>{searchQuery}</strong>" in <strong>{selectedCategory}</strong>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', fontWeight: '500' }}>
              Loading fresh products...
            </div>
          ) : error ? (
            <div className="error-alert">{error}</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: '700' }}>No products found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>We couldn't find any products matching your selection. Try a different filter or search.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  // Reset search via redirect to base
                  window.history.pushState({}, '', '/');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="admin-btn-secondary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
