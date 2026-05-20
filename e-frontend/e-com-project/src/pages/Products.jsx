import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Grid, List, ArrowUpDown, X } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/products/ProductCard';

const CATEGORIES = ['All', 'T-Shirts', 'Watches', 'Shoes'];
const GENDERS = ['All', 'Women', 'Men'];
const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' }
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFilter = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'All';
  const genderFilter = searchParams.get('gender') || 'All';

  const [searchVal, setSearchVal] = useState(searchFilter);
  const [category, setCategory] = useState(categoryFilter);
  const [gender, setGender] = useState(genderFilter);
  const [priceRange, setPriceRange] = useState(30000);
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setSearchVal(searchFilter);
    setCategory(categoryFilter);
    setGender(genderFilter);
  }, [searchFilter, categoryFilter, genderFilter]);

  const updateFilters = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'All') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange(30000);
    setSortBy('featured');
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesCategory = category === 'All' || product.category === category;
      const matchesGender = gender === 'All' || product.gender === gender;
      const matchesPrice = (product.discountPrice || product.price) <= priceRange;
      return matchesSearch && matchesCategory && matchesGender && matchesPrice;
    })
    .sort((a, b) => {
      const aPrice = a.discountPrice || a.price;
      const bPrice = b.discountPrice || b.price;
      if (sortBy === 'price-low') return aPrice - bPrice;
      if (sortBy === 'price-high') return bPrice - aPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.isFeatured === a.isFeatured ? 0 : b.isFeatured ? 1 : -1; // featured
    });

  return (
    <div className="page-wrapper pt-24">
      {/* Banner */}
      <div className="bg-[#E8E0F0] py-12 lg:py-14 px-6 text-center">
        <span className="section-subtitle text-[#9B7EC8]">COCO COLLECTION</span>
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A0A0A] mt-2 mb-4">
          All Products
        </h1>
        <p className="text-xs tracking-[1px] uppercase font-inter text-[#6B6B6B]">
          Elegance is not standing out, but being remembered
        </p>
      </div>

      {/* Main Content Area */}
      <div className="page-content">
        <div className="container-fluid py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28 space-y-8">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-sm font-semibold tracking-[2px] uppercase flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-[#9B7EC8]" /> Filters
                  </h2>
                  <button
                    onClick={clearAllFilters}
                    className="text-[10px] tracking-[1.5px] uppercase text-[#9B9B9B] hover:text-[#9B7EC8] transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search input in sidebar */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold tracking-[1px] uppercase text-[#0A0A0A]">Search</h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchVal}
                      onChange={(e) => {
                        setSearchVal(e.target.value);
                        updateFilters('search', e.target.value);
                      }}
                      placeholder="Search collection..."
                      className="w-full text-xs font-inter border border-gray-200 py-3 pl-4 pr-10 outline-none focus:border-[#9B7EC8]"
                    />
                    <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold tracking-[1px] uppercase text-[#0A0A0A]">Category</h3>
                  <div className="flex flex-col gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => updateFilters('category', cat)}
                        className={`text-left text-xs font-inter py-1 transition-colors ${
                          category === cat ? 'text-[#9B7EC8] font-semibold' : 'text-[#6B6B6B] hover:text-[#0A0A0A]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold tracking-[1px] uppercase text-[#0A0A0A]">Gender</h3>
                  <div className="flex flex-col gap-2">
                    {GENDERS.map((g) => (
                      <button
                        key={g}
                        onClick={() => updateFilters('gender', g)}
                        className={`text-left text-xs font-inter py-1 transition-colors ${
                          gender === g ? 'text-[#9B7EC8] font-semibold' : 'text-[#6B6B6B] hover:text-[#0A0A0A]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-semibold tracking-[1px] uppercase text-[#0A0A0A]">Max Price</h3>
                    <span className="text-xs font-semibold text-[#9B7EC8]">₹{priceRange.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="30000"
                    step="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#9B7EC8] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-inter">
                    <span>₹1,000</span>
                    <span>₹30,000</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid & Controls */}
            <main className="flex-1 w-full overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4 mb-8">
                <span className="text-xs text-[#6B6B6B] font-inter">
                  Showing <span className="font-semibold text-[#0A0A0A]">{filteredProducts.length}</span> results
                </span>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 text-xs tracking-[1px] uppercase font-semibold text-[#0A0A0A] border border-gray-200 px-4 py-2.5 hover:border-black transition-colors"
                  >
                    <SlidersHorizontal size={12} /> Filter
                  </button>

                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={12} className="text-gray-400 hidden sm:block" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-xs font-inter border border-gray-200 px-3 py-2.5 outline-none focus:border-[#9B7EC8]"
                    >
                      {SORTS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Active search filter details */}
              {searchFilter && (
                <div className="flex items-center gap-2 mb-6 bg-gray-50 px-4 py-2 w-fit text-xs text-[#6B6B6B] font-inter">
                  Search query: <span className="font-semibold text-black">"{searchFilter}"</span>
                  <button onClick={() => updateFilters('search', 'All')} className="text-red-500 hover:text-red-700 ml-2">
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* Empty State */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 md:py-20 bg-gray-50 border border-dashed border-gray-200">
                  <Search size={36} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="font-playfair text-lg md:text-xl font-semibold mb-2">No Products Found</h3>
                  <p className="text-xs text-[#6B6B6B] max-w-xs mx-auto mb-6">
                    We couldn't find any products matching your active filters. Try adjusting your settings.
                  </p>
                  <button onClick={clearAllFilters} className="btn-primary py-3 text-xs">
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                >
                  {filteredProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </motion.div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-[200] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute top-0 left-0 bottom-0 w-80 max-w-[calc(100vw-60px)] bg-white shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-sm font-semibold tracking-[2px] uppercase">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 hover:text-black">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold tracking-[1px] uppercase">Search</h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchVal}
                      onChange={(e) => {
                        setSearchVal(e.target.value);
                        updateFilters('search', e.target.value);
                      }}
                      placeholder="Search..."
                      className="w-full text-xs border border-gray-200 py-3 pl-4 pr-10 outline-none"
                    />
                    <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold tracking-[1px] uppercase">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => updateFilters('category', cat)}
                        className={`text-xs px-4 py-2 border transition-all ${
                          category === cat ? 'bg-black text-white border-black' : 'border-gray-200 text-[#6B6B6B]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold tracking-[1px] uppercase">Gender</h3>
                  <div className="flex flex-wrap gap-2">
                    {GENDERS.map(g => (
                      <button
                        key={g}
                        onClick={() => updateFilters('gender', g)}
                        className={`text-xs px-4 py-2 border transition-all ${
                          gender === g ? 'bg-black text-white border-black' : 'border-gray-200 text-[#6B6B6B]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-semibold tracking-[1px] uppercase">Max Price</h3>
                    <span className="text-xs font-semibold text-[#9B7EC8]">₹{priceRange.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="30000"
                    step="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#9B7EC8] cursor-pointer"
                  />
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-4">
                  <button
                    onClick={() => { clearAllFilters(); setShowMobileFilters(false); }}
                    className="flex-1 btn-secondary text-center py-3 text-xs justify-center"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 btn-primary text-center py-3 text-xs justify-center"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
