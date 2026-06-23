import React from 'react';
import { useCart } from '../context/CartContext';
import { Plus, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="product-card animate-fade-in">
      <span className="product-badge">{product.category}</span>
      <div className="product-img-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-img"
          onError={(e) => {
            // fallback image if seeded image path doesn't load
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400';
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <div className="product-price">${product.price.toFixed(2)}</div>
          {isOutOfStock ? (
            <span className="out-of-stock">Out of Stock</span>
          ) : (
            <button
              className="btn-add-cart"
              onClick={handleAdd}
              title="Add to Cart"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
