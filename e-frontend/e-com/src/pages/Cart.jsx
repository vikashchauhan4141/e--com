import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoTrashOutline, IoBagCheckOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { CartContext } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    shipping, 
    discount, 
    total, 
    promoCode, 
    applyPromoCode, 
    removePromoCode 
  } = useContext(CartContext);

  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-container mx-auto px-6 py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase mb-2">Your Bag is Empty</span>
        <h2 className="font-heading font-light text-2xl mb-8">No pieces selected</h2>
        <Link to="/shop">
          <Button variant="primary">Explore Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-6 lg:px-16 mt-6 min-h-screen">
      
      {/* Title Header */}
      <div className="flex flex-col gap-2 border-b border-outline-variant pb-8 mb-8 text-left">
        <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase">Your Selection</span>
        <h1 className="font-heading font-light text-3xl md:text-4xl tracking-wide text-ink">Shopping Bag</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left: Items list (2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6 text-left">
          
          <div className="flex flex-col border border-outline-variant rounded bg-surface-container-lowest overflow-hidden divide-y divide-outline-variant">
            {cartItems.map((item) => (
              <div key={item.cartId} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                
                {/* Product Image preview */}
                <Link to={`/product/${item.id}`} className="w-20 aspect-[3/4] bg-surface-container rounded overflow-hidden flex-shrink-0 border border-outline-variant">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                  />
                </Link>

                {/* Details */}
                <div className="flex-grow flex flex-col gap-1">
                  <Link to={`/product/${item.id}`} className="hover:text-primary transition-colors">
                    <h3 className="font-sans font-semibold text-sm text-ink leading-tight">{item.name}</h3>
                  </Link>
                  <p className="text-[10px] font-sans text-secondary uppercase tracking-wider mt-0.5">
                    Size: <span className="font-bold text-ink">{item.size}</span> • Color: <span className="font-bold text-ink">{item.color}</span>
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-heading font-bold text-xs tracking-wider text-primary">
                      {formatPrice(item.discountPrice || item.price)}
                    </span>
                    {item.discountPrice && item.discountPrice < item.price && (
                      <span className="font-heading text-[10px] tracking-wider text-outline line-through">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity adjustments stepper & Delete */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                  
                  {/* Stepper */}
                  <div className="flex items-center border border-outline-variant rounded bg-surface-container-low h-9 w-24 justify-between px-2">
                    <button 
                      onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                      className="text-secondary hover:text-ink font-semibold p-1"
                    >
                      -
                    </button>
                    <span className="font-sans text-xs font-semibold text-ink">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                      className="text-secondary hover:text-ink font-semibold p-1"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove action */}
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-secondary hover:text-error transition-colors p-1.5"
                    title="Remove item"
                  >
                    <IoTrashOutline size={18} />
                  </button>

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Right: Summary panel (1 column) */}
        <div className="lg:col-span-1 flex flex-col gap-6 text-left">
          
          {/* Order totals card */}
          <Card padding="md" className="flex flex-col gap-6">
            <h2 className="font-heading font-semibold text-xs tracking-widest uppercase text-ink border-b border-outline-variant/60 pb-3">
              Order Summary
            </h2>
            
            <div className="flex flex-col gap-3 font-sans text-xs text-surface-on-variant border-b border-outline-variant/60 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Atelier Discount</span>
                  <span className="font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-ink">
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              
              {shipping === 0 && (
                <p className="text-[10px] text-emerald-600 font-sans -mt-1 leading-normal font-semibold">
                  🎉 Congratulations! Your order qualifies for Free Shipping.
                </p>
              )}
            </div>

            {/* Total price */}
            <div className="flex justify-between items-center text-ink font-heading font-bold text-sm tracking-wider">
              <span>Total</span>
              <span className="text-primary text-base">{formatPrice(total)}</span>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2 border-t border-outline-variant/40 pt-4">
              {promoCode ? (
                <div className="w-full bg-primary/10 border border-primary/20 rounded p-2.5 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[9px] font-heading font-semibold tracking-wider text-primary uppercase">Promo Code Applied</p>
                    <p className="text-xs font-semibold font-sans text-ink">{promoCode}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-xs text-error hover:underline uppercase font-semibold font-sans"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Input
                    placeholder="PROMO CODE"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="py-2 text-xs"
                  />
                  <Button 
                    type="submit" 
                    variant="secondary" 
                    className="px-4 py-2 hover:bg-ink hover:text-white"
                  >
                    Apply
                  </Button>
                </>
              )}
            </form>

            {/* Checkout CTA */}
            <Link to="/checkout" className="w-full mt-2">
              <Button 
                variant="primary" 
                className="w-full py-4 flex items-center justify-center gap-2"
              >
                <IoBagCheckOutline size={16} /> Checkout <IoArrowForwardOutline size={14} />
              </Button>
            </Link>

          </Card>
          
        </div>

      </div>

    </div>
  );
};
