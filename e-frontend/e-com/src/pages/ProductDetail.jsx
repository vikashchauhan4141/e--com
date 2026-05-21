import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { IoHeart, IoHeartOutline, IoBagOutline, IoReturnUpBackOutline } from 'react-icons/io5';
import { products } from '../data/products';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { StarRating } from '../components/shared/StarRating';
import { ProductCard } from '../components/shared/ProductCard';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../utils/formatPrice';
import { Badge } from '../components/ui/Badge';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  // Retrieve active product
  const product = useMemo(() => {
    return products.find(p => p.id === Number(id));
  }, [id]);

  // States
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="max-w-container mx-auto px-6 py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="font-heading font-light text-2xl mb-4">Piece Not Found</h2>
        <p className="font-sans text-xs text-secondary mb-8">This specific coordinate isn't available in our catalog.</p>
        <Link to="/shop">
          <Button variant="primary">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  const liked = isInWishlist(product.id);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  // Filter related coordinates
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    const success = addToCart(product, quantity, selectedSize, selectedColor);
    if (success) {
      setQuantity(1);
    }
  };

  return (
    <div className="max-w-container mx-auto px-6 lg:px-16 mt-6 min-h-screen">
      
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-heading font-semibold text-[10px] tracking-widest uppercase text-secondary hover:text-ink transition-colors mb-8 text-left"
      >
        <IoReturnUpBackOutline size={14} /> Back
      </button>

      {/* Main split grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 border-b border-outline-variant pb-16">
        
        {/* Left Side: Premium Image View */}
        <div className="relative aspect-[3/4] w-full bg-surface-container overflow-hidden rounded-lg border border-[#e6e0f0]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          {hasDiscount && (
            <Badge variant="accent" className="absolute top-4 left-4 z-10">
              Sale
            </Badge>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="flex flex-col items-start text-left gap-6">
          
          {/* Header */}
          <div className="flex flex-col gap-1.5 w-full">
            <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase">
              {product.category}
            </span>
            <h1 className="font-heading font-light text-2xl md:text-3xl tracking-wide text-ink">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <StarRating rating={product.rating} />
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="text-xs font-sans text-secondary font-semibold">Gender: {product.gender}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-4 py-2 border-y border-outline-variant/40 w-full">
            {hasDiscount ? (
              <>
                <span className="font-heading font-bold text-xl tracking-wider text-primary">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="font-heading text-sm tracking-wider text-outline line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge variant="accent">
                  Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </Badge>
              </>
            ) : (
              <span className="font-heading font-bold text-xl tracking-wider text-ink">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Colors Selector */}
          <div className="flex flex-col gap-2.5 w-full">
            <span className="font-heading font-semibold text-[10px] tracking-widest uppercase text-ink">
              Select Color: <span className="font-sans font-semibold text-secondary lowercase">{selectedColor}</span>
            </span>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 rounded text-[10px] font-sans font-semibold border tracking-wider uppercase transition-all ${
                    selectedColor === color
                      ? 'bg-ink text-white border-ink'
                      : 'bg-transparent text-secondary border-outline-variant hover:border-outline'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes Selector */}
          <div className="flex flex-col gap-2.5 w-full">
            <span className="font-heading font-semibold text-[10px] tracking-widest uppercase text-ink">
              Select Size: <span className="font-sans font-semibold text-secondary">{selectedSize}</span>
            </span>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-9 h-9 rounded flex items-center justify-center text-[10px] font-sans font-semibold border transition-all ${
                    selectedSize === size
                      ? 'bg-primary text-white border-primary'
                      : 'bg-transparent text-secondary border-outline-variant hover:border-outline'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full">
            
            {/* Quantity Selector stepper */}
            <div className="flex items-center border border-outline-variant rounded bg-surface-container-lowest h-[46px] w-full sm:w-32 justify-between px-3">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="text-secondary hover:text-ink font-semibold p-1"
              >
                -
              </button>
              <span className="font-sans text-xs font-semibold text-ink">{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                className="text-secondary hover:text-ink font-semibold p-1"
              >
                +
              </button>
            </div>

            {/* Add to Cart CTA */}
            <Button 
              variant="primary" 
              onClick={handleAddToCart}
              className="flex-grow w-full py-3.5 h-[46px] flex items-center justify-center gap-2"
              disabled={product.stock <= 0}
            >
              <IoBagOutline size={16} /> 
              {product.stock <= 0 ? 'SOLD OUT' : 'ADD TO BAG'}
            </Button>

            {/* Wishlist Icon */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-[46px] h-[46px] border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container transition-colors ${
                liked ? 'text-primary' : 'text-secondary'
              }`}
            >
              {liked ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
            </button>

          </div>

          {/* Low Stock Warning Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-[10px] text-error font-sans font-semibold tracking-wide">
              Only {product.stock} pieces remaining in our inventory.
            </p>
          )}

          {/* Sizing alert detail */}
          <p className="text-[10px] text-outline font-sans leading-relaxed">
            Free shipping on orders above ₹5,000. Easy exchanges and returns within 14 days of dispatch.
          </p>

        </div>

      </div>

      {/* Tabs Layout: Description and simulated reviews */}
      <div className="py-16 text-left max-w-3xl border-b border-outline-variant/60">
        <div className="flex border-b border-outline-variant pb-3 gap-8">
          <button
            onClick={() => setActiveTab('description')}
            className={`font-heading font-semibold text-[10px] tracking-widest uppercase transition-colors ${
              activeTab === 'description' ? 'text-primary border-b-2 border-primary pb-3 -mb-[14px]' : 'text-secondary'
            }`}
          >
            Description
          </button>
          
          <button
            onClick={() => setActiveTab('reviews')}
            className={`font-heading font-semibold text-[10px] tracking-widest uppercase transition-colors ${
              activeTab === 'reviews' ? 'text-primary border-b-2 border-primary pb-3 -mb-[14px]' : 'text-secondary'
            }`}
          >
            Atelier Reviews (3)
          </button>
        </div>

        <div className="mt-8">
          {activeTab === 'description' ? (
            <div className="flex flex-col gap-4 font-sans text-xs text-surface-on-variant leading-relaxed">
              <p>{product.description}</p>
              <p>
                Crafted following strict modern minimalist directives. Features double-faced flat-locked seams, premium fabric finishing, and pre-shrunk organic weaves. Hand washed or dry clean recommended to maintain long-term garment compose and shape integrity.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 border-b border-outline-variant/20 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink font-sans">Ananya S.</span>
                  <span className="text-[10px] text-outline font-sans">May 19, 2026</span>
                </div>
                <StarRating rating={5} size={10} />
                <p className="font-sans text-xs text-surface-on-variant mt-1">
                  Exquisite fabric weight! The lavender color is soft and highly premium. Fits perfectly as per size guidelines.
                </p>
              </div>

              <div className="flex flex-col gap-2 border-b border-outline-variant/20 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink font-sans">Rohan D.</span>
                  <span className="text-[10px] text-outline font-sans">May 12, 2026</span>
                </div>
                <StarRating rating={4} size={10} />
                <p className="font-sans text-xs text-surface-on-variant mt-1">
                  Super soft organic cotton. Great minimalist design. Shipped very fast in beautiful eco-friendly paper packaging.
                </p>
              </div>

              <div className="flex flex-col gap-2 border-b border-outline-variant/20 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink font-sans">Sarah M.</span>
                  <span className="text-[10px] text-outline font-sans">May 05, 2026</span>
                </div>
                <StarRating rating={5} size={10} />
                <p className="font-sans text-xs text-surface-on-variant mt-1">
                  Absolute quiet luxury! Will definitely buy other coordinates from this collection. Matches the Stitch specifications flawlessly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Pieces section */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 text-left">
          <h2 className="font-heading font-light text-xl tracking-wide text-ink mb-8">Related Coordinates</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
