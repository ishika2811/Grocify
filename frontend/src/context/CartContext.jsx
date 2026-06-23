import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('grocify_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('Error parsing cart items', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('grocify_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);

      if (existItem) {
        // limit quantity by available stock
        const newQty = Math.min(existItem.qty + qty, product.stock);
        return prevItems.map((x) =>
          x.product === product._id ? { ...existItem, qty: newQty } : x
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            stock: product.stock,
            qty: Math.min(qty, product.stock),
          },
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== productId));
  };

  const updateCartQty = (productId, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) =>
        x.product === productId ? { ...x, qty: Math.max(1, Math.min(qty, x.stock)) } : x
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        cartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
