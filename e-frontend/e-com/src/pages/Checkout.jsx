import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronForwardOutline, IoShieldCheckmarkOutline, IoLockClosedOutline } from 'react-icons/io5';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import toast from 'react-hot-toast';

export const Checkout = () => {
  const { cartItems, total, subtotal, shipping, discount, clearCart } = useContext(CartContext);
  const { user, isAuthenticated, addresses, placeOrder, verifyOrderPayment } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect checks
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed to checkout");
      navigate('/login');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, cartItems, navigate]);

  // Steps: 'shipping' | 'payment' | 'review'
  const [step, setStep] = useState('shipping');

  // Step 1: Shipping Address State
  const [selectedAddrId, setSelectedAddrId] = useState('new');
  const [newFullName, setNewFullName] = useState(user?.name || '');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');
  const [newPhone, setNewPhone] = useState(user?.phone || '');

  // Automatically select the default address or first address on load
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault);
      setSelectedAddrId(defaultAddr?._id || addresses[0]._id);
    }
  }, [addresses]);

  // Step 2: Payment Details State
  const [paymentMethod, setPaymentMethod] = useState('ONLINE'); // Default to ONLINE

  if (cartItems.length === 0 || !user) return null;

  // Derive active shipping address
  const activeAddress = (() => {
    if (selectedAddrId !== 'new') {
      return addresses.find(a => a._id === selectedAddrId);
    }
    return {
      fullName: newFullName,
      street: newStreet,
      city: newCity,
      state: newState,
      zipCode: newZip,
      country: "India",
      phone: newPhone
    };
  })();

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (selectedAddrId === 'new') {
      if (!newFullName || !newStreet || !newCity || !newState || !newZip || !newPhone) {
        toast.error("Please fill in all shipping details");
        return;
      }
    }
    setStep('payment');
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    const loadingToast = toast.loading("Processing order details...");
    try {
      const payload = {
        paymentMethod: paymentMethod,
      };
      
      if (selectedAddrId !== 'new') {
        payload.addressId = selectedAddrId;
      } else {
        payload.shippingAddress = {
          fullName: newFullName,
          street: newStreet,
          city: newCity,
          state: newState,
          zipCode: newZip,
          country: "India",
          phone: newPhone
        };
      }

      const orderData = await placeOrder(payload);
      
      if (paymentMethod === 'COD') {
        toast.success("Order Placed Successfully! Thank you.", { id: loadingToast });
        await clearCart();
        navigate('/profile');
      } else {
        toast.dismiss(loadingToast);
        
        const rpOrder = orderData.razorpayOrder;
        if (!rpOrder) {
          toast.error("Failed to initialize payment gateway.");
          return;
        }

        const options = {
          key: rpOrder.keyId,
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          name: "Stylee Fashion",
          description: `Atelier Receipt - Order #${orderData.orderNumber}`,
          order_id: rpOrder.id,
          handler: async function (response) {
            const verificationToast = toast.loading("Verifying your payment transaction...");
            try {
              await verifyOrderPayment({
                orderId: orderData._id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              
              toast.success("Payment Verified! Your order is confirmed.", { id: verificationToast });
              await clearCart();
              navigate('/profile');
            } catch (err) {
              console.error("Signature verification failed:", err);
              toast.error(err.message || "Payment verification failed.", { id: verificationToast });
            }
          },
          prefill: {
            name: activeAddress.fullName || user.name,
            email: user.email,
            contact: activeAddress.phone || user.phone || "",
          },
          theme: {
            color: "#967bb6", // Premium lavender matching toast icon primary
          },
          modal: {
            ondismiss: function () {
              toast.error("Payment dismissed. Order is saved as pending.");
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err.message || "Order placement failed.", { id: loadingToast });
      console.error("Order placement failed:", err.message);
    }
  };

  const stepsList = [
    { key: 'shipping', label: '1. Shipping' },
    { key: 'payment', label: '2. Payment' },
    { key: 'review', label: '3. Review' }
  ];

  return (
    <div className="max-w-container mx-auto px-6 lg:px-16 mt-6 min-h-screen">
      
      {/* Title Header */}
      <div className="flex flex-col gap-2 border-b border-outline-variant pb-8 mb-8 text-left">
        <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase">Safe checkout pipeline</span>
        <h1 className="font-heading font-light text-3xl md:text-4xl tracking-wide text-ink">Checkout Workspace</h1>
      </div>

      {/* Progress pipeline header */}
      <div className="flex justify-center items-center gap-4 md:gap-10 mb-12">
        {stepsList.map((s, idx) => (
          <React.Fragment key={s.key}>
            <span className={`font-heading font-semibold text-[10px] tracking-widest uppercase transition-colors ${
              step === s.key ? 'text-primary font-bold' : 'text-outline'
            }`}>
              {s.label}
            </span>
            {idx < stepsList.length - 1 && (
              <IoChevronForwardOutline className="text-outline-variant" size={12} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
        
        {/* Left Side: Dynamic Pipeline Card Step (2 columns) */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Shipping Address Form */}
            {step === 'shipping' && (
              <motion.div
                key="shipping-step"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleShippingSubmit} className="flex flex-col gap-6">
                  
                  {/* Select Saved Address */}
                  {addresses.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <h3 className="font-heading font-semibold text-xs tracking-widest uppercase text-ink">
                        Select Shipping Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div 
                            key={addr._id}
                            onClick={() => setSelectedAddrId(addr._id)}
                            className={`p-4 border rounded cursor-pointer transition-all ${
                              selectedAddrId === addr._id
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
                            }`}
                          >
                            <p className="font-sans font-semibold text-xs text-ink">{addr.fullName}</p>
                            <p className="font-sans text-[11px] text-secondary mt-1">{addr.street}</p>
                            <p className="font-sans text-[11px] text-secondary">{addr.city}, {addr.state} {addr.zipCode}</p>
                          </div>
                        ))}
                        <div 
                          onClick={() => setSelectedAddrId('new')}
                          className={`p-4 border border-dashed rounded cursor-pointer transition-all flex items-center justify-center ${
                            selectedAddrId === 'new'
                              ? 'border-primary bg-primary/5'
                              : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
                          }`}
                        >
                          <span className="font-heading font-semibold text-[10px] tracking-wider uppercase text-secondary">
                            + Use A New Address
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Input Form for New Address */}
                  {selectedAddrId === 'new' && (
                    <Card padding="md" className="border border-outline-variant flex flex-col gap-4">
                      <h3 className="font-heading font-semibold text-xs tracking-widest uppercase text-ink">
                        Enter Address Details
                      </h3>
                      
                      <Input
                        label="Full Name"
                        placeholder="Vikas Chauhan"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        required
                      />

                      <Input
                        label="Street Address"
                        placeholder="456 Fashion Atelier Lane"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        required
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          label="City"
                          placeholder="New York"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          required
                        />
                        <Input
                          label="State"
                          placeholder="NY"
                          value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                          required
                        />
                        <Input
                          label="Zip Code"
                          placeholder="10001"
                          value={newZip}
                          onChange={(e) => setNewZip(e.target.value)}
                          required
                        />
                      </div>

                      <Input
                        label="Contact Phone"
                        placeholder="+1 234 567 890"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        required
                      />
                    </Card>
                  )}

                  {/* Submit button */}
                  <Button type="submit" variant="primary" className="w-fit py-3.5 px-8 self-end mt-4">
                    Continue to Payment
                  </Button>

                </form>
              </motion.div>
            )}

            {/* STEP 2: Secure Payment Selector Form */}
            {step === 'payment' && (
              <motion.div
                key="payment-step"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-6">
                  
                  <Card padding="md" className="border border-outline-variant flex flex-col gap-6 max-w-lg mx-auto w-full">
                    <div className="flex flex-col gap-1 border-b border-outline-variant/60 pb-3">
                      <span className="font-heading font-semibold text-[9px] tracking-widest text-primary uppercase">Secure options</span>
                      <h3 className="font-heading font-light text-lg tracking-wide text-ink">
                        Select Payment Method
                      </h3>
                    </div>

                    <div className="flex flex-col gap-4">
                      
                      {/* Option 1: Razorpay Pay Online */}
                      <div 
                        onClick={() => setPaymentMethod('ONLINE')}
                        className={`p-5 border rounded-lg cursor-pointer transition-all flex items-start gap-4 ${
                          paymentMethod === 'ONLINE'
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
                        }`}
                      >
                        <div className="mt-1 flex items-center justify-center">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            paymentMethod === 'ONLINE' ? 'border-primary' : 'border-outline'
                          }`}>
                            {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                          </div>
                        </div>
                        <div className="flex-grow text-left">
                          <p className="font-sans font-semibold text-xs text-ink flex items-center gap-2">
                            Pay Securely Online 
                            <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-heading font-bold uppercase tracking-wider">
                              UPI / Cards / Netbanking
                            </span>
                          </p>
                          <p className="font-sans text-[11px] text-secondary mt-1">
                            Pay securely with Razorpay checkout. Supports UPI (Google Pay, PhonePe, Paytm), Credit/Debit cards, Netbanking, and Wallets.
                          </p>
                        </div>
                      </div>

                      {/* Option 2: Cash on Delivery */}
                      <div 
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-5 border rounded-lg cursor-pointer transition-all flex items-start gap-4 ${
                          paymentMethod === 'COD'
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
                        }`}
                      >
                        <div className="mt-1 flex items-center justify-center">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            paymentMethod === 'COD' ? 'border-primary' : 'border-outline'
                          }`}>
                            {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                          </div>
                        </div>
                        <div className="flex-grow text-left">
                          <p className="font-sans font-semibold text-xs text-ink">Cash on Delivery (COD)</p>
                          <p className="font-sans text-[11px] text-secondary mt-1">
                            Pay in cash or make instant digital transactions on delivery when your premium clothing is delivered.
                          </p>
                        </div>
                      </div>

                    </div>

                    <div className="flex items-center justify-center gap-2 text-outline text-[10px] tracking-wider uppercase font-semibold border-t border-outline-variant/60 pt-4 mt-2">
                      <IoShieldCheckmarkOutline size={14} className="text-primary" />
                      <span>Razorpay Secured SSL Pipeline</span>
                    </div>

                  </Card>

                  {/* Actions buttons */}
                  <div className="flex justify-between items-center mt-6">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="font-heading font-semibold text-[10px] tracking-widest uppercase text-secondary hover:text-ink hover:underline"
                    >
                      Back to Shipping
                    </button>
                    
                    <Button type="submit" variant="primary" className="py-3.5 px-8">
                      Continue to Review
                    </Button>
                  </div>

                </form>
              </motion.div>
            )}

            {/* STEP 3: Full Order Review */}
            {step === 'review' && (
              <motion.div
                key="review-step"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                
                <Card padding="md" className="border border-outline-variant flex flex-col gap-4 text-left">
                  <h3 className="font-heading font-semibold text-xs tracking-widest uppercase text-ink border-b border-outline-variant/60 pb-3">
                    Atelier Dispatch Details
                  </h3>
                  <div className="font-sans text-xs flex flex-col gap-1 text-surface-on-variant mt-1">
                    <p className="font-semibold text-ink">{activeAddress.fullName}</p>
                    <p>{activeAddress.street}</p>
                    <p>{activeAddress.city}, {activeAddress.state} {activeAddress.zipCode}</p>
                    <p className="text-[11px] text-outline mt-1">{activeAddress.phone}</p>
                  </div>
                </Card>

                <Card padding="md" className="border border-outline-variant flex flex-col gap-4 text-left">
                  <h3 className="font-heading font-semibold text-xs tracking-widest uppercase text-ink border-b border-outline-variant/60 pb-3">
                    Secure Payment Guarantee
                  </h3>
                  <div className="font-sans text-xs flex items-center gap-3 text-emerald-700 mt-1">
                    <IoShieldCheckmarkOutline size={18} />
                    {paymentMethod === 'ONLINE' ? (
                      <span>Secure online checkout via Razorpay active. Supports GPay, Netbanking, Cards, and UPI.</span>
                    ) : (
                      <span>Cash on Delivery active. Make payments on package arrival.</span>
                    )}
                  </div>
                </Card>

                {/* Actions buttons */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="font-heading font-semibold text-[10px] tracking-widest uppercase text-secondary hover:text-ink hover:underline"
                  >
                    Back to Payment
                  </button>
                  
                  <Button onClick={handlePlaceOrder} variant="primary" className="py-3.5 px-8">
                    {paymentMethod === 'ONLINE' ? 'Pay & Place Order' : 'Confirm & Place Order'}
                  </Button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Side: Bag Breakdown (1 column) */}
        <div className="lg:col-span-1">
          <Card padding="md" className="border border-outline-variant flex flex-col gap-6">
            <h3 className="font-heading font-semibold text-xs tracking-widest uppercase text-ink border-b border-outline-variant/60 pb-3">
              Order Breakdown
            </h3>

            {/* List of items */}
            <div className="flex flex-col gap-4 border-b border-outline-variant/60 pb-4 max-h-[220px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.cartId} className="flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 aspect-[3/4] object-cover rounded border border-outline-variant"
                  />
                  <div className="flex-grow text-left">
                    <p className="font-sans font-semibold text-xs text-ink truncate max-w-[130px]">{item.name}</p>
                    <p className="text-[9px] font-sans text-secondary uppercase tracking-wider">
                      Qty: {item.quantity} • Size: {item.size}
                    </p>
                  </div>
                  <span className="font-heading text-xs font-semibold text-ink">
                    {formatPrice((item.discountPrice || item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations summaries */}
            <div className="flex flex-col gap-3 font-sans text-xs text-surface-on-variant border-b border-outline-variant/60 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Atelier Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center font-heading font-bold text-sm tracking-wider text-ink">
              <span>Grand Total</span>
              <span className="text-primary text-base">{formatPrice(total)}</span>
            </div>

          </Card>
        </div>

      </div>

    </div>
  );
};
