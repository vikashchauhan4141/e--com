import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('lavender_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem('lavender_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, size, color) => {
    if (!size || !color) {
      toast.error("Please select a size and color");
      return false;
    }

    const cartId = `${product.id}-${size}-${color}`;

    setCartItems(prev => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        // Check stock
        if (existing.quantity + quantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`);
          return prev;
        }
        toast.success(`Updated ${product.name} quantity in cart`);
        return prev.map(item =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`);
          return prev;
        }
        toast.success(`Added ${product.name} to cart`);
        return [...prev, {
          cartId,
          id: product.id,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          image: product.image,
          stock: product.stock,
          size,
          color,
          quantity
        }];
      }
    });
    return true;
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => {
      const item = prev.find(i => i.cartId === cartId);
      if (item) {
        toast.success(`Removed ${item.name} from cart`);
      }
      return prev.filter(i => i.cartId !== cartId);
    });
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    setCartItems(prev => prev.map(item => {
      if (item.cartId === cartId) {
        if (quantity > item.stock) {
          toast.error(`Only ${item.stock} items available in stock`);
          return item;
        }
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  const applyPromoCode = (code) => {
    const uppercaseCode = code.toUpperCase().trim();
    if (uppercaseCode === 'LAVENDER10' || uppercaseCode === 'AURA10') {
      setPromoCode(uppercaseCode);
      setDiscountPercent(10);
      toast.success("Promo code applied: 10% Off!");
      return true;
    } else if (uppercaseCode === 'FREESHIP') {
      setPromoCode(uppercaseCode);
      toast.success("Promo code applied: Free Shipping!");
      return true;
    } else {
      toast.error("Invalid promo code");
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
    toast.success("Promo code removed");
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.discountPrice || item.price;
    return acc + (itemPrice * item.quantity);
  }, 0);

  const shipping = subtotal > 5000 || promoCode === 'FREESHIP' ? 0 : (subtotal > 0 ? 150 : 0);
  const discount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal + shipping - discount;

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      promoCode,
      discountPercent,
      subtotal,
      shipping,
      discount,
      total,
      totalItemsCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyPromoCode,
      removePromoCode
    }}>
      {children}
    </CartContext.Provider>
  );
};
