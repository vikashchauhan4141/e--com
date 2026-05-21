import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { ProductCard } from '../components/shared/ProductCard';
import { Button } from '../components/ui/Button';

export const Wishlist = () => {
  const { wishlistItems, clearWishlist } = useContext(WishlistContext);

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
        
        <button
          onClick={clearWishlist}
          className="font-heading font-semibold text-[10px] tracking-widest uppercase text-error hover:underline transition-colors pb-1"
        >
          Clear All
        </button>
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
