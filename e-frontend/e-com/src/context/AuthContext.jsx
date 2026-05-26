import React, { createContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { DEFAULT_AVATAR } from '../utils/constants';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch addresses from the backend Mongoose API
  const fetchAddresses = async () => {
    try {
      const data = await api.get('/addresses');
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error('Failed to fetch addresses:', err.message);
    }
  };

  // Fetch orders from the backend Mongoose API
  const fetchOrders = async () => {
    try {
      const data = await api.get('/orders/my');
      
      // Format orders to match frontend expectation perfectly
      const formatted = (data.orders || []).map(order => ({
        id: order.orderNumber,
        dbId: order._id,
        date: new Date(order.createdAt).toISOString().split('T')[0],
        status: order.status,
        paymentStatus: order.payment?.status || 'Pending',
        paymentMethod: order.payment?.method || 'COD',
        total: order.pricing.total,
        items: order.items.map(item => ({
          name: item.name,
          price: item.price,
          qty: item.quantity,
          size: item.size,
          color: item.color
        }))
      }));
      
      setOrders(formatted);
    } catch (err) {
      console.error('Failed to fetch orders:', err.message);
    }
  };

  // Verify authentication on mount (restores active sessions using session cookies)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await api.get('/auth/me');
        if (data && data.user) {
          setUser(data.user);
          await Promise.all([fetchAddresses(), fetchOrders()]);
        }
      } catch (err) {
        console.log('Session inactive or expired');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data && data.user) {
        setUser(data.user);
        toast.success(`Logged in as ${data.user.name}`);
        // Fetch fresh addresses and orders
        await Promise.all([fetchAddresses(), fetchOrders()]);
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await api.post('/auth/register', { name, email, password });
      if (data && data.user) {
        setUser(data.user);
        toast.success(`Account created for ${data.user.name}`);
        // Fetch fresh addresses and orders
        await Promise.all([fetchAddresses(), fetchOrders()]);
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setAddresses([]);
      setOrders([]);
      toast.success('Signed out successfully');
    } catch (err) {
      console.error('Logout error:', err.message);
      // fallback: clear state anyway
      setUser(null);
      setAddresses([]);
      setOrders([]);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const data = await api.patch('/users/profile', updatedData);
      if (data && data.user) {
        setUser(data.user);
        toast.success('Profile details updated successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile settings.');
    }
  };

  const updateAvatar = async (formData) => {
    const loadingToast = toast.loading('Uploading avatar...');
    try {
      const data = await api.patch('/users/avatar', formData);
      if (data && data.user) {
        setUser(data.user);
        toast.success('Avatar updated successfully', { id: loadingToast });
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload avatar.', { id: loadingToast });
      throw err;
    }
  };

  const addAddress = async (address) => {
    try {
      const data = await api.post('/addresses', address);
      if (data && data.address) {
        toast.success('Address saved successfully');
        await fetchAddresses();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save address.');
    }
  };

  const deleteAddress = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      toast.success('Address deleted successfully');
      await fetchAddresses();
    } catch (err) {
      toast.error(err.message || 'Failed to delete address.');
    }
  };

  const placeOrder = async (orderPayload) => {
    try {
      const data = await api.post('/orders', orderPayload);
      await fetchOrders();
      return data.order;
    } catch (err) {
      toast.error(err.message || 'Failed to place order.');
      throw err;
    }
  };

  const verifyOrderPayment = async (verificationPayload) => {
    try {
      const data = await api.post('/orders/verify', verificationPayload);
      await fetchOrders();
      return data.order;
    } catch (err) {
      toast.error(err.message || 'Failed to verify payment.');
      throw err;
    }
  };

  const retryOrderPayment = async (orderId) => {
    try {
      const data = await api.post(`/orders/${orderId}/retry-payment`);
      return data;
    } catch (err) {
      toast.error(err.message || 'Failed to re-initialize payment.');
      throw err;
    }
  };

  const cancelOrderAction = async (orderId) => {
    const loadingToast = toast.loading("Processing order cancellation...");
    try {
      const data = await api.post(`/orders/${orderId}/cancel`);
      await fetchOrders();
      toast.success("Order cancelled and inventory stock restored!", { id: loadingToast });
      return data.order;
    } catch (err) {
      toast.error(err.message || "Failed to cancel order.", { id: loadingToast });
      throw err;
    }
  };

  const deleteOrderAction = async (orderId) => {
    const loadingToast = toast.loading("Removing order from history...");
    try {
      await api.delete(`/orders/${orderId}`);
      await fetchOrders();
      toast.success("Order removed from history!", { id: loadingToast });
    } catch (err) {
      toast.error(err.message || "Failed to remove order.", { id: loadingToast });
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user: user ? {
        ...user,
        avatar: user.avatar || DEFAULT_AVATAR
      } : null,
      isAuthenticated: !!user,
      addresses,
      orders,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      updateAvatar,
      addAddress,
      deleteAddress,
      placeOrder,
      verifyOrderPayment,
      retryOrderPayment,
      cancelOrder: cancelOrderAction,
      deleteOrder: deleteOrderAction,
      refreshAddresses: fetchAddresses,
      refreshOrders: fetchOrders
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
