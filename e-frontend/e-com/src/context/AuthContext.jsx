import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const DUMMY_USER = {
  name: "Vikas Chauhan",
  email: "vikas@example.com",
  phone: "+1 234 567 890",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
};

const DEFAULT_ADDRESSES = [
  {
    id: 1,
    type: "Home",
    fullName: "Vikas Chauhan",
    street: "123 Elegance Boulevard, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    phone: "+1 234 567 890",
    isDefault: true
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lavender_user');
    return saved ? JSON.parse(saved) : DUMMY_USER; // Start with logged in Vikas for smooth user testing
  });

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('lavender_addresses');
    return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('lavender_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: "ORD-98421",
        date: "2026-05-18",
        status: "Delivered",
        total: 3998,
        items: [
          { name: "Classic White Oversized T-Shirt", price: 1999, qty: 2 }
        ]
      }
    ];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('lavender_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lavender_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lavender_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('lavender_orders', JSON.stringify(orders));
  }, [orders]);

  const login = (email, password) => {
    // Elegant simulated login
    const loggedInUser = {
      name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      email: email,
      phone: "+1 555 0199",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
    };
    setUser(loggedInUser);
    return true;
  };

  const register = (name, email, password) => {
    const newUser = {
      name,
      email,
      phone: "+1 555 0199",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: Date.now(),
      isDefault: addresses.length === 0 ? true : address.isDefault
    };

    if (address.isDefault) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })).concat(newAddress));
    } else {
      setAddresses(prev => [...prev, newAddress]);
    }
  };

  const deleteAddress = (id) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const placeOrder = (items, total, shippingAddress) => {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      status: "Processing",
      total,
      items,
      shippingAddress
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      addresses,
      orders,
      login,
      register,
      logout,
      updateProfile,
      addAddress,
      deleteAddress,
      placeOrder
    }}>
      {children}
    </AuthContext.Provider>
  );
};
