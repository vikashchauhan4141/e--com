import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoFilterOutline, IoClose, IoSearchOutline } from 'react-icons/io5';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { ProductCard } from '../components/shared/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

const SIZES = ["XS", "S", "M", "L", "XL", "One Size"];
const COLORS = ["White", "Lavender", "Sand", "Charcoal", "Black", "Gold", "Blue"];
const GENDERS = ["Women", "Men", "Unisex"];

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange] = useState(15000);
  const [sortBy, setSortBy] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync category from URL search query (e.g. ?category=Dresses)
  const categoryParam = searchParams.get('category') || '';

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Simulate premium loading state on filter change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [categoryParam, selectedGender, selectedSize, selectedColor, priceRange, sortBy, debouncedSearch]);

  const activeCategory = categoryParam;

  const handleSelectCategory = (catName) => {
    if (activeCategory === catName) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setSelectedGender('');
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange(15000);
    setSortBy('default');
  };

  // Advanced memoized filtering
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (activeCategory) {
      result = result.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Gender
    if (selectedGender) {
      result = result.filter(p => p.gender.toLowerCase() === selectedGender.toLowerCase());
    }

    // Size
    if (selectedSize) {
      result = result.filter(p => p.sizes.includes(selectedSize));
    }

    // Color
    if (selectedColor) {
      result = result.filter(p => p.colors.includes(selectedColor));
    }

    // Price
    result = result.filter(p => {
      const activePrice = p.discountPrice || p.price;
      return activePrice <= priceRange;
    });

    // Search Query
    if (debouncedSearch) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeCategory, selectedGender, selectedSize, selectedColor, priceRange, debouncedSearch, sortBy]);

  const FilterSidebarContent = () => (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Category Filter */}
      <div className="flex flex-col gap-3">
        <h3 className="font-heading font-semibold text-[10px] tracking-widest uppercase text-ink">Categories</h3>
        <div className="flex flex-col gap-2 font-sans text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.name)}
              className={`text-left transition-colors py-1 ${
                activeCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'text-primary font-semibold'
                  : 'text-secondary hover:text-ink'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="flex flex-col gap-3">
        <h3 className="font-heading font-semibold text-[10px] tracking-widest uppercase text-ink">Gender</h3>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((gender) => (
            <button
              key={gender}
              onClick={() => setSelectedGender(prev => prev === gender ? '' : gender)}
              className={`px-3 py-1.5 rounded text-[10px] font-sans font-semibold tracking-wider uppercase border transition-all ${
                selectedGender === gender
                  ? 'bg-ink text-white border-ink'
                  : 'bg-transparent text-secondary border-outline-variant hover:border-outline'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-[10px] tracking-widest uppercase text-ink">Max Price</h3>
          <span className="text-xs font-semibold text-primary font-heading tracking-wide">₹{priceRange.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="1000"
          max="15000"
          step="500"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-primary bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex items-center justify-between text-[10px] font-sans text-outline mt-0.5">
          <span>₹1,000</span>
          <span>₹15,000</span>
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-3">
        <h3 className="font-heading font-semibold text-[10px] tracking-widest uppercase text-ink">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(prev => prev === size ? '' : size)}
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

      {/* Colors */}
      <div className="flex flex-col gap-3">
        <h3 className="font-heading font-semibold text-[10px] tracking-widest uppercase text-ink">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(prev => prev === color ? '' : color)}
              className={`px-3 py-1.5 rounded text-[10px] font-sans font-semibold tracking-wider uppercase border transition-all ${
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

      {/* Reset button */}
      <Button 
        variant="secondary" 
        onClick={handleResetFilters}
        className="w-full py-2.5 mt-2"
      >
        Clear Filters
      </Button>

    </div>
  );

  return (
    <div className="max-w-container mx-auto px-6 lg:px-16 mt-6 min-h-screen">
      
      {/* Editorial Title Header */}
      <div className="flex flex-col gap-2 border-b border-outline-variant pb-8 mb-8 text-left">
        <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase">Atelier Catalog</span>
        <h1 className="font-heading font-light text-3xl md:text-4xl tracking-wide text-ink">Coordinates</h1>
      </div>

      {/* Control bar (Search, Filter Button for mobile, Sort) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 border-b border-outline-variant pb-6">
        
        {/* Search Field */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="SEARCH PRODUCTS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded pl-11 pr-4 py-2.5 font-sans text-xs tracking-wider uppercase text-ink placeholder-outline focus:outline-none focus:border-primary"
          />
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={16} />
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-outline-variant px-4 py-2.5 rounded font-heading font-semibold text-[10px] tracking-widest uppercase text-ink hover:bg-surface-container"
          >
            <IoFilterOutline size={16} /> Filters
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline font-heading font-semibold text-[9px] tracking-widest uppercase text-secondary">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-outline-variant rounded px-3 py-2.5 font-sans text-[11px] tracking-wider uppercase text-ink font-semibold focus:outline-none focus:border-primary"
            >
              <option value="default">Trending</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Grid Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Desktop Filter Sidebar (1 column) */}
        <aside className="hidden lg:block lg:col-span-1 border-r border-outline-variant pr-8">
          <FilterSidebarContent />
        </aside>

        {/* Product Grid Panel (3 columns) */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase mb-2">No coordinates match</span>
              <p className="font-sans text-xs text-secondary max-w-xs">
                We couldn't find any products matching your specific filters. Try loosening your constraints or resetting.
              </p>
              <Button variant="secondary" onClick={handleResetFilters} className="mt-6 py-2.5">
                Reset Filters
              </Button>
            </div>
          )}
        </main>

      </div>

      {/* Mobile Filters Slide-out Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-ink/20 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-surface-container-lowest h-full shadow-xl flex flex-col p-6 overflow-y-auto z-10 transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-outline-variant pb-6 mb-6">
              <h2 className="font-heading font-semibold text-xs tracking-widest uppercase text-ink">
                Filters
              </h2>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="text-secondary p-1"
              >
                <IoClose size={22} />
              </button>
            </div>
            
            <FilterSidebarContent />
          </div>
        </div>
      )}

    </div>
  );
};
