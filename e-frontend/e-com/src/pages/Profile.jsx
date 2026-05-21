import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoBagCheckOutline, IoLocationOutline, IoPersonOutline, IoAddOutline, IoTrashOutline } from 'react-icons/io5';
import { AuthContext } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const Profile = () => {
  const { user, isAuthenticated, addresses, orders, updateProfile, addAddress, deleteAddress } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  // Redirection checks
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  // Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addrType, setAddrType] = useState('Home');
  const [addrName, setAddrName] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrPhone, setAddrPhone] = useState('');

  if (!user) return null;

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfile({ name: profileName, phone: profilePhone });
    alert("Profile details updated successfully!");
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addrName || !addrStreet || !addrCity || !addrState || !addrZip || !addrPhone) {
      alert("Please fill in all address details");
      return;
    }
    
    addAddress({
      type: addrType,
      fullName: addrName,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      zipCode: addrZip,
      country: "United States",
      phone: addrPhone,
      isDefault: addresses.length === 0
    });

    setIsAddingAddress(false);
    // Reset inputs
    setAddrName('');
    setAddrStreet('');
    setAddrCity('');
    setAddrState('');
    setAddrZip('');
    setAddrPhone('');
  };

  return (
    <div className="max-w-container mx-auto px-6 lg:px-16 mt-6 min-h-screen">
      
      {/* Editorial Dashboard Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-outline-variant pb-8 mb-10 text-left gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase">Atelier Client Workspace</span>
          <h1 className="font-heading font-light text-3xl md:text-4xl tracking-wide text-ink">Welcome back, {user.name}</h1>
        </div>
        <div className="flex items-center gap-3 bg-surface-container/60 rounded-full px-4 py-2 border border-outline-variant/30">
          <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
          <span className="font-sans text-xs font-semibold text-ink">{user.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Left Side Tab Controls */}
        <aside className="lg:col-span-1 flex flex-col gap-1 text-left border-r border-outline-variant pr-6 h-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-heading font-semibold tracking-wider uppercase rounded transition-colors ${
              activeTab === 'orders' ? 'bg-primary text-white' : 'text-secondary hover:bg-surface-container'
            }`}
          >
            <IoBagCheckOutline size={16} /> Order History
          </button>
          
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-heading font-semibold tracking-wider uppercase rounded transition-colors ${
              activeTab === 'addresses' ? 'bg-primary text-white' : 'text-secondary hover:bg-surface-container'
            }`}
          >
            <IoLocationOutline size={16} /> Saved Addresses
          </button>
          
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-heading font-semibold tracking-wider uppercase rounded transition-colors ${
              activeTab === 'account' ? 'bg-primary text-white' : 'text-secondary hover:bg-surface-container'
            }`}
          >
            <IoPersonOutline size={16} /> Account Info
          </button>
        </aside>

        {/* Right Side Content Tab Panel */}
        <main className="lg:col-span-3 text-left">
          
          {/* Tab 1: Orders */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-6">
              <h2 className="font-heading font-semibold text-sm tracking-widest uppercase text-ink border-b border-outline-variant/60 pb-3 mb-2">
                Active Orders
              </h2>
              {orders.length === 0 ? (
                <p className="font-sans text-xs text-secondary py-6">You haven't placed any orders in our boutique yet.</p>
              ) : (
                <div className="flex flex-col gap-6">
                  {orders.map((order) => (
                    <Card key={order.id} padding="md" className="border border-outline-variant">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-outline-variant/60 pb-4 mb-4 gap-2">
                        <div>
                          <p className="font-heading font-bold text-xs tracking-wider text-primary">{order.id}</p>
                          <p className="text-[10px] font-sans text-secondary mt-0.5">Placed on {order.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 text-[9px] font-semibold tracking-wider uppercase bg-primary-fixed text-primary-on-container rounded">
                            Status: {order.status}
                          </span>
                          <span className="font-heading font-bold text-xs text-ink">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 font-sans text-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-surface-on-variant">
                            <span>{item.name} <span className="text-secondary">x{item.qty}</span></span>
                            <span className="font-semibold text-ink">{formatPrice(item.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Addresses */}
          {activeTab === 'addresses' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3 mb-2">
                <h2 className="font-heading font-semibold text-sm tracking-widest uppercase text-ink">
                  Saved Addresses
                </h2>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center gap-1 font-heading font-semibold text-[10px] tracking-widest uppercase text-primary hover:text-primary-accent"
                  >
                    <IoAddOutline size={14} /> Add Address
                  </button>
                )}
              </div>

              {isAddingAddress ? (
                <Card padding="md" className="border border-outline-variant">
                  <form onSubmit={handleAddAddress} className="flex flex-col gap-4">
                    <h3 className="font-heading font-semibold text-xs tracking-widest uppercase text-ink mb-2">New Address Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-heading font-semibold text-[9px] tracking-widest uppercase text-secondary">Address Type</label>
                        <select
                          value={addrType}
                          onChange={(e) => setAddrType(e.target.value)}
                          className="px-3 py-2 bg-surface-container border border-outline-variant rounded font-sans text-xs"
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                        </select>
                      </div>
                      <Input
                        label="Full Name"
                        placeholder="Vikas Chauhan"
                        value={addrName}
                        onChange={(e) => setAddrName(e.target.value)}
                        required
                      />
                    </div>

                    <Input
                      label="Street Address"
                      placeholder="123 Atelier Street"
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        label="City"
                        placeholder="New York"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        required
                      />
                      <Input
                        label="State"
                        placeholder="NY"
                        value={addrState}
                        onChange={(e) => setAddrState(e.target.value)}
                        required
                      />
                      <Input
                        label="Zip Code"
                        placeholder="10001"
                        value={addrZip}
                        onChange={(e) => setAddrZip(e.target.value)}
                        required
                      />
                    </div>

                    <Input
                      label="Phone Number"
                      placeholder="+1 234 567 890"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      required
                    />

                    <div className="flex justify-end gap-3 mt-2">
                      <Button variant="secondary" onClick={() => setIsAddingAddress(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary">
                        Save Address
                      </Button>
                    </div>
                  </form>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <Card key={addr.id} padding="md" className="border border-outline-variant relative flex flex-col items-start gap-1">
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="absolute top-4 right-4 text-secondary hover:text-error transition-colors p-1"
                        title="Delete Address"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-heading font-semibold text-[9px] tracking-wider uppercase px-2 py-0.5 bg-surface-container rounded text-ink">
                          {addr.type}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[9px] font-sans text-primary font-bold uppercase tracking-wider">
                            [Default]
                          </span>
                        )}
                      </div>
                      
                      <p className="font-sans font-semibold text-xs text-ink">{addr.fullName}</p>
                      <p className="font-sans text-xs text-secondary-on-container leading-relaxed">{addr.street}</p>
                      <p className="font-sans text-xs text-secondary-on-container">{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="font-sans text-[11px] text-outline mt-1">{addr.phone}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Account Info */}
          {activeTab === 'account' && (
            <div className="flex flex-col gap-6 max-w-md">
              <h2 className="font-heading font-semibold text-sm tracking-widest uppercase text-ink border-b border-outline-variant/60 pb-3 mb-2">
                Atelier Client Details
              </h2>
              
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                <Input
                  label="Registered Email"
                  value={user.email}
                  disabled
                  className="bg-surface-container opacity-60 text-secondary"
                />
                
                <Input
                  label="Display Name"
                  placeholder="Vikas Chauhan"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
                
                <Input
                  label="Contact Phone"
                  placeholder="+1 234 567 890"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  required
                />

                <Button type="submit" variant="primary" className="w-fit py-3 px-8 mt-2">
                  Update Settings
                </Button>
              </form>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
