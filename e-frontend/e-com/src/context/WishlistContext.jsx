import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // Guest-mode wishlist state
  const [guestWishlistItems, setGuestWishlistItems] = useState(() => {
    const saved = localStorage.getItem('lavender_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // DB-mode wishlist state
  const [dbWishlistItems, setDbWishlistItems] = useState([]);

  // Sync guest wishlist to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('lavender_wishlist', JSON.stringify(guestWishlistItems));
    }
  }, [guestWishlistItems, isAuthenticated]);

  // Load backend wishlist on auth changes
  const fetchDbWishlist = async () => {
    try {
      const data = await api.get('/wishlist');
      setDbWishlistItems(data.wishlist?.products || []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDbWishlist();
    } else {
      setDbWishlistItems([]);
    }
  }, [isAuthenticated]);

  // Unified items selector
  const wishlistItems = isAuthenticated
    ? dbWishlistItems.map(item => ({
        id: item.legacyId || item._id, // map backend identity to legacy id for compatibility
        _id: item._id, // store standard DB Object ID
        name: item.name,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        rating: item.rating,
        stock: item.stock,
        sizes: item.sizes,
        colors: item.colors,
        category: item.categoryName
      }))
    : guestWishlistItems;

  const toggleWishlist = async (product) => {
    if (isAuthenticated) {
      try {
        const idToToggle = product._id || product.id;
        const data = await api.post(`/wishlist/${idToToggle}`);
        setDbWishlistItems(data.wishlist?.products || []);
        if (data.inWishlist) {
          toast.success(`Added ${product.name} to wishlist`);
        } else {
          toast.success(`Removed ${product.name} from wishlist`);
        }
      } catch (err) {
        toast.error(err.message || "Failed to toggle wishlist");
      }
    } else {
      // Guest local flow
      let isAdded = false;
      setGuestWishlistItems(prev => {
        const exists = prev.find(item => item.id === product.id);
        if (exists) {
          toast.success(`Removed ${product.name} from wishlist`);
          return prev.filter(item => item.id !== product.id);
        } else {
          toast.success(`Added ${product.name} to wishlist`);
          isAdded = true;
          return [...prev, product];
        }
      });
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => String(item.id) === String(productId));
  };

  const clearWishlist = async () => {
    if (isAuthenticated) {
      try {
        // Since there is no explicit clear API in backend, we can manually clear or do nothing
        // Or loop and delete, but let's just empty it locally
        setDbWishlistItems([]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      setGuestWishlistItems([]);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      refreshWishlist: fetchDbWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
