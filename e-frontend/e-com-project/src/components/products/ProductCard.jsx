import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={11}
          className={star <= Math.round(rating) ? 'text-[#C4B0D8] fill-[#C4B0D8]' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
};

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0];
    addToCart(product, defaultSize);
    toast.success(`Added to bag — ${product.sizes[0]} size`, {
      icon: '🛍️',
      style: {
        background: '#0A0A0A',
        color: '#FAFAFA',
        borderLeft: '3px solid #9B7EC8',
        borderRadius: '0',
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '0.3px',
      },
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!wishlisted) {
      toast('Added to wishlist', {
        icon: '♥',
        style: {
          background: '#0A0A0A',
          color: '#FAFAFA',
          borderLeft: '3px solid #9B7EC8',
          borderRadius: '0',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      className="product-card group"
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-[#F5F5F5] aspect-[3/4]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="badge badge-new text-[9px] tracking-[1px]">New</span>
            )}
            {discount > 0 && (
              <span className="badge badge-sale text-[9px] tracking-[1px]">{discount}% Off</span>
            )}
          </div>

          {/* Action Buttons — appear on hover */}
          <div className="overlay absolute inset-0 flex flex-col items-end justify-between p-3">
            {/* Wishlist */}
            <motion.button
              onClick={handleWishlist}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-9 h-9 flex items-center justify-center bg-white shadow-md transition-all duration-300 ${
                wishlisted ? 'text-red-500' : 'text-[#6B6B6B] hover:text-red-500'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart
                size={16}
                className={wishlisted ? 'fill-red-500' : ''}
              />
            </motion.button>

            {/* Add to Cart — bottom full-width */}
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[#0A0A0A] text-white py-3 text-[10px] tracking-[2px] uppercase font-medium flex items-center justify-center gap-2 hover:bg-[#9B7EC8] transition-colors duration-300"
            >
              <ShoppingBag size={13} />
              Add to Bag
            </motion.button>
          </div>
        </div>

        {/* Info */}
        <div className="pt-4 pb-2">
          <p className="text-[10px] tracking-[2px] uppercase text-[#9B7EC8] font-inter mb-1">
            {product.category} · {product.gender}
          </p>
          <h3 className="text-sm font-inter font-medium text-[#0A0A0A] leading-snug mb-2 group-hover:text-[#9B7EC8] transition-colors duration-300">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={product.rating} />
            <span className="text-[10px] text-[#9B9B9B] font-inter">({product.reviews})</span>
          </div>

          <div className="flex items-center gap-3">
            {product.discountPrice ? (
              <>
                <span className="font-inter font-semibold text-[#0A0A0A] text-sm">
                  ₹{product.discountPrice.toLocaleString()}
                </span>
                <span className="font-inter text-xs text-[#9B9B9B] line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-inter font-semibold text-[#0A0A0A] text-sm">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Size chips */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="text-[9px] border border-gray-200 px-2 py-0.5 text-[#6B6B6B] font-inter tracking-wider"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
