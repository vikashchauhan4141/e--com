import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { ProductCard } from '../components/shared/ProductCard';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const Wishlist = () => {
  const { wishlistItems, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleBuyAll = async () => {
    const loadingToast = toast.loading("Adding all coordinates to your bag...");
    try {
      let addedCount = 0;
      for (const item of wishlistItems) {
        // Fallback size and color from product definition
        const defaultSize = item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'M';
        const defaultColor = item.colors && item.colors.length > 0 ? item.colors[0] : 'Black';
        
        // Add to bag using context action
        const success = await addToCart(item, 1, defaultSize, defaultColor);
        if (success) {
          addedCount++;
        }
      }
      
      toast.dismiss(loadingToast);
      
      if (addedCount > 0) {
        toast.success(`Successfully moved ${addedCount} coordinates to your bag!`);
        clearWishlist(); // Sweep wishlist clean once successfully carted
        navigate('/cart'); // Smoothly redirect client to checkout/bag pipeline
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Failed to add items to bag");
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-container mx-auto px-6 py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase mb-2">No Saved Coordinates</span>
        <h2 className="font-heading font-light text-2xl mb-8">Wishlist is empty</h2>
        <Link to="/shop">
          <Button variant="primary">Explore Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-6 lg:px-16 mt-6 min-h-screen">
      
      {/* Title Header */}
      <div className="flex flex-row items-end justify-between border-b border-outline-variant pb-8 mb-8">
        <div className="flex flex-col gap-2 text-left">
          <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase">Saved Coordinates</span>
          <h1 className="font-heading font-light text-3xl md:text-4xl tracking-wide text-ink">My Wishlist</h1>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={handleBuyAll}
            className="font-heading font-semibold text-[10px] tracking-widest uppercase text-primary hover:underline transition-colors pb-1 cursor-pointer"
          >
            Buy All (Add to Bag)
          </button>
          <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/60 mb-1" />
          <button
            onClick={clearWishlist}
            className="font-heading font-semibold text-[10px] tracking-widest uppercase text-error hover:underline transition-colors pb-1 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Grid of liked items */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
        {wishlistItems.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>

    </div>
  );
};
