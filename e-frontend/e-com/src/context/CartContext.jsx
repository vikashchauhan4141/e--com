import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Guest-mode cart items in state
  const [guestCartItems, setGuestCartItems] = useState(() => {
    const saved = localStorage.getItem('lavender_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // DB-mode cart details in state
  const [dbCart, setDbCart] = useState(null);

  // Guest promo configurations
  const [guestPromoCode, setGuestPromoCode] = useState('');
  const [guestDiscountPercent, setGuestDiscountPercent] = useState(0);

  // Sync guest cart changes to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('lavender_cart', JSON.stringify(guestCartItems));
    }
  }, [guestCartItems, isAuthenticated]);

  // Load backend cart on auth state changes
  const fetchDbCart = async () => {
    try {
      const data = await api.get('/cart');
      setDbCart(data.cart);
    } catch (err) {
      console.error('Failed to fetch backend cart:', err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDbCart();
    } else {
      setDbCart(null);
    }
  }, [isAuthenticated]);

  // Unified cart items state
  const cartItems = isAuthenticated && dbCart
    ? dbCart.items.map(item => ({
        cartId: item._id, // Map backend item _id to cartId so that update/delete flows match perfectly
        id: item.product.legacyId || item.product._id, // link back to product ID for details page navigation
        name: item.name,
        price: item.product.price,
        discountPrice: item.product.discountPrice,
        image: item.image,
        stock: item.product.stock,
        size: item.size,
        color: item.color,
        quantity: item.quantity
      }))
    : guestCartItems;

  const addToCart = async (product, quantity = 1, size, color) => {
    if (!size || !color) {
      toast.error("Please select a size and color");
      return false;
    }

    if (isAuthenticated) {
      try {
        const data = await api.post('/cart/items', {
          productId: product._id || product.id,
          quantity,
          size,
          color
        });
        setDbCart(data.cart);
        toast.success(`Added ${product.name} to cart`);
        return true;
      } catch (err) {
        toast.error(err.message || "Failed to add item to cart");
        return false;
      }
    } else {
      // Guest local flow
      const cartId = `${product.id}-${size}-${color}`;
      let success = false;
      
      setGuestCartItems(prev => {
        const existing = prev.find(item => item.cartId === cartId);
        if (existing) {
          if (existing.quantity + quantity > product.stock) {
            toast.error(`Only ${product.stock} items available in stock`);
            return prev;
          }
          toast.success(`Updated ${product.name} quantity in cart`);
          success = true;
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
          success = true;
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
      return success;
    }
  };

  const removeFromCart = async (cartId) => {
    if (isAuthenticated) {
      try {
        const data = await api.delete(`/cart/items/${cartId}`);
        setDbCart(data.cart);
        toast.success("Item removed from cart");
      } catch (err) {
        toast.error(err.message || "Failed to remove item");
      }
    } else {
      setGuestCartItems(prev => {
        const item = prev.find(i => i.cartId === cartId);
        if (item) {
          toast.success(`Removed ${item.name} from cart`);
        }
        return prev.filter(i => i.cartId !== cartId);
      });
    }
  };

  const updateQuantity = async (cartId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(cartId);
      return;
    }

    if (isAuthenticated) {
      try {
        const data = await api.patch(`/cart/items/${cartId}`, { quantity });
        setDbCart(data.cart);
      } catch (err) {
        toast.error(err.message || "Failed to update quantity");
      }
    } else {
      setGuestCartItems(prev => prev.map(item => {
        if (item.cartId === cartId) {
          if (quantity > item.stock) {
            toast.error(`Only ${item.stock} items available in stock`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      }));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        const data = await api.delete('/cart');
        setDbCart(data.cart);
      } catch (err) {
        console.error('Failed to clear backend cart:', err.message);
      }
    } else {
      setGuestCartItems([]);
      setGuestPromoCode('');
      setGuestDiscountPercent(0);
    }
  };

  const applyPromoCode = async (code) => {
    const uppercaseCode = code.toUpperCase().trim();
    
    if (isAuthenticated) {
      try {
        const data = await api.post('/cart/apply-coupon', { code: uppercaseCode });
        setDbCart(data.cart);
        toast.success(`Promo code applied!`);
        return true;
      } catch (err) {
        toast.error(err.message || "Invalid promo code");
        return false;
      }
    } else {
      // Guest local flow
      if (uppercaseCode === 'STYLEE10' || uppercaseCode === 'LAVENDER10' || uppercaseCode === 'AURA10') {
        setGuestPromoCode(uppercaseCode);
        setGuestDiscountPercent(10);
        toast.success("Promo code applied: 10% Off!");
        return true;
      } else if (uppercaseCode === 'FREESHIP') {
        setGuestPromoCode(uppercaseCode);
        toast.success("Promo code applied: Free Shipping!");
        return true;
      } else {
        toast.error("Invalid promo code");
        return false;
      }
    }
  };

  const removePromoCode = async () => {
    if (isAuthenticated) {
      try {
        const data = await api.delete('/cart/coupon');
        setDbCart(data.cart);
        toast.success("Promo code removed");
      } catch (err) {
        toast.error(err.message || "Failed to remove promo code");
      }
    } else {
      setGuestPromoCode('');
      setGuestDiscountPercent(0);
      toast.success("Promo code removed");
    }
  };

  // Calculations
  const subtotal = isAuthenticated && dbCart
    ? dbCart.subtotal
    : cartItems.reduce((acc, item) => {
        const itemPrice = item.discountPrice || item.price;
        return acc + (itemPrice * item.quantity);
      }, 0);

  const promoCode = isAuthenticated && dbCart ? dbCart.couponCode : guestPromoCode;
  const discountPercent = isAuthenticated && dbCart ? dbCart.discountPercent : guestDiscountPercent;

  const shipping = isAuthenticated && dbCart
    ? dbCart.shipping
    : (subtotal > 5000 || promoCode === 'FREESHIP' ? 0 : (subtotal > 0 ? 150 : 0));

  const discount = isAuthenticated && dbCart
    ? dbCart.discount
    : Math.round((subtotal * discountPercent) / 100);

  const total = isAuthenticated && dbCart
    ? dbCart.total
    : (subtotal + shipping - discount);

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
      removePromoCode,
      refreshCart: fetchDbCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
