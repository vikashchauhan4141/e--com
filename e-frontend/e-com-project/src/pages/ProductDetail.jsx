import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Share2, Shield, Truck, RotateCcw, AlertTriangle } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import ProductCard from '../components/products/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = products.find(p => p.id === parseInt(id));

  // State management
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <AlertTriangle size={48} className="text-red-400 mb-4" />
        <h2 className="font-playfair text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  
  // Find related products in same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success(`Added ${quantity} item(s) to bag — ${selectedSize} size`, {
      icon: '🛍️',
      style: {
        background: '#0A0A0A',
        color: '#FAFAFA',
        borderLeft: '3px solid #9B7EC8',
        borderRadius: '0',
        fontSize: '13px',
      }
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!', { icon: '🔗' });
  };

  return (
    <div className="page-wrapper pt-24">
      <div className="page-content bg-white">
        <div className="container-fluid py-8 lg:py-12">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-inter text-gray-400 mb-10 overflow-x-auto pb-2">
            <Link to="/" className="hover:text-black transition-colors whitespace-nowrap">Home</Link>
            <span className="shrink-0">/</span>
            <Link to="/products" className="hover:text-black transition-colors whitespace-nowrap">Products</Link>
            <span className="shrink-0">/</span>
            <span className="text-gray-800 font-medium truncate whitespace-nowrap">{product.name}</span>
          </div>

          {/* Product Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Left: Image Gallery */}
            <div className="w-full overflow-hidden">
              <div className="space-y-4">
                <div className="bg-[#F5F5F5] aspect-[3/4] overflow-hidden">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Gallery Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`w-20 h-24 bg-gray-50 overflow-hidden border shrink-0 transition-colors ${
                          selectedImage === img ? 'border-[#9B7EC8]' : 'border-gray-200 hover:border-black'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Info Panels */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category & Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <span className="text-xs tracking-[3px] uppercase font-inter text-[#9B7EC8]">
                    {product.category} · {product.gender}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={star <= Math.round(product.rating) ? 'text-[#9B7EC8] fill-[#9B7EC8]' : 'text-gray-200 fill-gray-200'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-inter font-medium whitespace-nowrap">({product.reviews} reviews)</span>
                  </div>
                </div>

                {/* Title & Price */}
                <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-[#0A0A0A] mb-5 leading-tight">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-baseline gap-3 mb-6">
                  {product.discountPrice ? (
                    <>
                      <span className="font-inter font-bold text-2xl text-[#0A0A0A]">
                        ₹{product.discountPrice.toLocaleString()}
                      </span>
                      <span className="font-inter text-base text-gray-400 line-through">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 tracking-wide">
                        {discount}% Off
                      </span>
                    </>
                  ) : (
                    <span className="font-inter font-bold text-2xl text-[#0A0A0A]">
                      ₹{product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm font-inter text-[#6B6B6B] leading-relaxed mb-8">
                  {product.description}
                </p>

                <hr className="border-gray-100 mb-6" />

                {/* Sizes selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-semibold tracking-[1px] uppercase text-[#0A0A0A]">Select Size</label>
                    <span className="text-[10px] text-gray-400 tracking-wider uppercase underline cursor-pointer">Size Guide</span>
                  </div>
                  <div className="flex gap-2.5 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`text-xs font-inter border px-5 py-3 tracking-widest transition-all ${
                          selectedSize === size
                            ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                            : 'border-gray-200 hover:border-black text-gray-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

              {/* Color selection */}
              <div className="mb-8">
                <label className="block text-xs font-semibold tracking-[1px] uppercase text-[#0A0A0A] mb-3">Color</label>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs font-inter border px-4 py-2 tracking-wider transition-all ${
                        selectedColor === color
                          ? 'bg-[#E8E0F0] border-[#9B7EC8] text-black font-medium'
                          : 'border-gray-200 hover:border-black text-gray-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty & Cart buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 py-3.5 px-4 shrink-0">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-gray-400 hover:text-black font-semibold text-sm">−</button>
                  <span className="mx-6 text-sm font-semibold font-inter w-4 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="text-gray-400 hover:text-black font-semibold text-sm">+</button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary justify-center gap-2 py-4"
                >
                  <ShoppingBag size={16} /> Add to Bag
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`border py-4 px-4 sm:px-5 transition-colors shrink-0 ${
                    wishlisted ? 'text-red-500 border-red-500 bg-red-50' : 'border-gray-200 hover:border-black text-gray-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={18} className={wishlisted ? 'fill-red-500' : ''} />
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="border border-gray-200 py-4 px-4 sm:px-5 hover:border-black text-gray-500 transition-colors shrink-0"
                  aria-label="Share"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-col items-center text-center p-2 sm:p-3 bg-[#FAFAFA]">
                <Truck size={18} className="text-[#9B7EC8] mb-1.5 shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0A0A0A]">Free Shipping</span>
                <span className="text-[9px] text-gray-400 font-inter mt-0.5">On orders &gt; ₹2999</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 sm:p-3 bg-[#FAFAFA]">
                <RotateCcw size={18} className="text-[#9B7EC8] mb-1.5 shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0A0A0A]">15-Day Return</span>
                <span className="text-[9px] text-gray-400 font-inter mt-0.5">Easy returns policy</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 sm:p-3 bg-[#FAFAFA]">
                <Shield size={18} className="text-[#9B7EC8] mb-1.5 shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0A0A0A]">100% Genuine</span>
                <span className="text-[9px] text-gray-400 font-inter mt-0.5">Quality guaranteed</span>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 lg:mt-24 pt-10 lg:pt-12 border-t border-gray-100">
            <div className="text-center mb-10 lg:mb-12">
              <span className="section-subtitle">You May Also Like</span>
              <div className="divider mx-auto" />
              <h2 className="section-title">Related <em className="text-[#9B7EC8]">Products</em></h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
