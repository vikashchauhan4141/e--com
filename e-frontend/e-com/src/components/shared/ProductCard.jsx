import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { WishlistContext } from '../../context/WishlistContext';
import { StarRating } from './StarRating';
import { formatPrice } from '../../utils/formatPrice';
import { Badge } from '../ui/Badge';

export const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const liked = isInWishlist(product.id);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col w-full bg-transparent overflow-hidden"
    >
      
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full bg-surface-container overflow-hidden rounded-lg border border-[#e6e0f0]">
        
        {/* Wishlist Button Overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-ink hover:text-primary transition-all duration-300 shadow-sm active:scale-90"
        >
          {liked ? (
            <IoHeart size={18} className="text-primary" />
          ) : (
            <IoHeartOutline size={18} />
          )}
        </button>

        {/* Badges (New, Sale, Sold Out) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {hasDiscount && (
            <Badge variant="accent">Sale</Badge>
          )}
          {product.stock <= 0 ? (
            <Badge variant="danger">Sold Out</Badge>
          ) : product.stock <= 5 && (
            <Badge variant="secondary">Low Stock</Badge>
          )}
        </div>

        {/* Link to Detail Page */}
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          {/* Zooming Image */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        
        {/* Quick Shop Overlay Panel on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/60 to-transparent flex justify-center z-10">
          <Link 
            to={`/product/${product.id}`}
            className="w-full bg-white text-ink text-[10px] tracking-widest font-heading font-semibold uppercase text-center py-2.5 rounded hover:bg-primary hover:text-white transition-colors"
          >
            Quick View
          </Link>
        </div>

      </div>

      {/* Details Box - Left-aligned matching Stitch specs */}
      <div className="flex flex-col gap-1.5 pt-4">
        {/* Category Label */}
        <span className="text-[9px] font-semibold text-secondary tracking-widest uppercase">
          {product.category}
        </span>

        {/* Product Title */}
        <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-sans font-medium text-sm text-ink leading-tight line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Star Ratings */}
        <StarRating rating={product.rating} />

        {/* Price Tag */}
        <div className="flex items-center gap-2 mt-0.5">
          {hasDiscount ? (
            <>
              <span className="font-heading font-semibold text-xs tracking-wider text-primary">
                {formatPrice(product.discountPrice)}
              </span>
              <span className="font-heading text-[10px] tracking-wider text-outline line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="font-heading font-semibold text-xs tracking-wider text-ink">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

      </div>

    </motion.div>
  );
};
