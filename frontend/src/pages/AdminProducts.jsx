import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { Plus, Edit, Trash2, X, RefreshCw } from 'lucide-react';

const categories = ['Fruits & Vegetables', 'Dairy & Eggs', 'Bakery', 'Beverages'];

const AdminProducts = () => {
  const { user, token, backendUrl } = useAuth();

  // Product loading states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${backendUrl}/products`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [backendUrl]);

  // Open modal for adding
  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditId(null);
    setName('');
    setPrice('');
    setStock('');
    setCategory(categories[0]);
    setImageUrl('');
    setDescription('');
    setFormError('');
    setModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (product) => {
    setIsEditing(true);
    setEditId(product._id);
    setName(product.name);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setCategory(product.category);
    setImageUrl(product.imageUrl);
    setDescription(product.description);
    setFormError('');
    setModalOpen(true);
  };

  // Handle product delete
  const handleDelete = async (id, prodName) => {
    if (window.confirm(`Are you sure you want to delete "${prodName}"?`)) {
      try {
        const response = await fetch(`${backendUrl}/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete product');
        }

        // Remove from UI state
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Modal Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!name || !price || !stock || !category || !imageUrl || !description) {
      setFormError('Please fill in all fields');
      return;
    }

    setFormSubmitting(true);

    const productData = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      imageUrl,
      description
    };

    try {
      const url = isEditing 
        ? `${backendUrl}/products/${editId}` 
        : `${backendUrl}/products`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error saving product');
      }

      setModalOpen(false);
      fetchProducts(); // Refresh list
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="admin-container animate-fade-in">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-header-row">
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Manage Products</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create, update, and manage your grocery catalog items.</p>
          </div>
          <button className="admin-btn" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', fontWeight: 500 }}>Loading inventory list...</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No products found. Click "Add Product" to create your first item.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: '#f1f5f9' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100';
                          }}
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{product.name}</td>
                      <td>
                        <span className="status-badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '3px 8px' }}>
                          {product.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>${product.price.toFixed(2)}</td>
                      <td style={{ fontWeight: 500 }}>
                        <span style={{ color: product.stock <= 5 ? 'var(--danger)' : 'inherit' }}>
                          {product.stock} units
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="action-btn edit"
                            onClick={() => handleOpenEdit(product)}
                            title="Edit"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(product._id, product.name)}
                            title="Delete"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
              <h3 className="modal-title">{isEditing ? 'Edit Product Details' : 'Add New Product'}</h3>

              {formError && <div className="error-alert">{formError}</div>}

              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="prod-name">Product Name</label>
                  <input
                    type="text"
                    id="prod-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Red Grapes"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="prod-price">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      id="prod-price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 2.99"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prod-stock">Stock Units</label>
                    <input
                      type="number"
                      id="prod-stock"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="e.g. 50"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="prod-cat">Category</label>
                  <select
                    id="prod-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="prod-img">Image URL</label>
                  <input
                    type="text"
                    id="prod-img"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="e.g. /assets/products/grapes.png"
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Can use relative paths (e.g. <code>/assets/products/apples.png</code>) or remote Unsplash links.
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="prod-desc">Product Description</label>
                  <textarea
                    id="prod-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    placeholder="Provide details about freshness, source, or nutritional value..."
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="admin-btn-secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn" disabled={formSubmitting}>
                    {formSubmitting ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProducts;
