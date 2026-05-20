import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search, ShoppingBag, Heart, User, ChevronDown,
  Menu, X, LogOut, Settings, Package, ArrowRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const profileRef = useRef(null);
  const cartRef = useRef(null);
  const navigate = useNavigate();

  const { cartCount, cartItems, cartTotal, removeFromCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-white/96 backdrop-blur-xl shadow-[0_2px_40px_rgba(0,0,0,0.08)]'
            : 'bg-white/90 backdrop-blur-md'
        }`}
      >
        <div className="container-fluid max-w-[1440px]">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">

            {/* Left — Mobile toggle + Desktop nav links */}
            <div className="flex items-center gap-6 md:gap-8 shrink-0">
              <button
                className="lg:hidden text-[#0A0A0A] hover:text-[#9B7EC8] transition-colors p-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <div className="hidden lg:flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `navbar-link ${isActive ? 'active !text-[#9B7EC8]' : ''}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Center — Logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group select-none shrink-0"
            >
              <span className="font-playfair text-lg md:text-2xl font-bold tracking-[4px] md:tracking-[8px] text-[#0A0A0A] leading-none group-hover:text-[#9B7EC8] transition-colors duration-300">
                COCO
              </span>
              <span className="text-[8px] tracking-[3px] md:tracking-[4px] text-[#9B7EC8] font-inter font-medium mt-0.5">
                FASHION
              </span>
            </Link>

            {/* Right — Action icons */}
            <div className="flex items-center gap-3 md:gap-5 shrink-0">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-[#0A0A0A] hover:text-[#9B7EC8] transition-colors duration-300 p-1"
                aria-label="Search"
              >
                <Search size={18} className="md:w-5 md:h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/products"
                className="relative text-[#0A0A0A] hover:text-[#9B7EC8] transition-colors duration-300 p-1"
                aria-label={`Wishlist (${wishlistCount})`}
              >
                <Heart size={18} className="md:w-5 md:h-5" />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-[#9B7EC8] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Cart */}
              <div className="relative" ref={cartRef}>
                <button
                  onClick={() => setCartOpen(!cartOpen)}
                  className="relative text-[#0A0A0A] hover:text-[#9B7EC8] transition-colors duration-300 p-1"
                  aria-label={`Cart (${cartCount})`}
                >
                  <ShoppingBag size={18} className="md:w-5 md:h-5" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-[#0A0A0A] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {/* Cart Dropdown */}
                <AnimatePresence>
                  {cartOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] md:max-w-[32rem] bg-white shadow-2xl border border-gray-100 z-50 rounded-sm"
                    >
                      <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between">
                        <span className="font-playfair text-lg font-semibold">Shopping Bag</span>
                        <span className="text-[10px] text-[#6B6B6B] tracking-[2px] uppercase">{cartCount} items</span>
                      </div>

                      <div className="max-h-72 overflow-y-auto">
                        {cartItems.length === 0 ? (
                          <div className="p-6 md:p-8 text-center">
                            <ShoppingBag size={32} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-sm text-[#6B6B6B]">Your bag is empty</p>
                            <p className="text-xs text-[#9B9B9B] mt-1">Add some luxury to your life</p>
                          </div>
                        ) : (
                          cartItems.map(item => (
                            <div key={item.key} className="flex gap-3 p-3 md:p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                              <img src={item.image} alt={item.name} className="w-12 h-12 md:w-14 md:h-14 object-cover shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-[#0A0A0A] truncate">{item.name}</p>
                                <p className="text-[10px] text-[#9B7EC8] mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
                                <p className="text-xs font-semibold mt-1">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.key)}
                                className="text-gray-300 hover:text-red-400 transition-colors self-start mt-1 p-0.5"
                                aria-label="Remove item"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {cartItems.length > 0 && (
                        <div className="p-4 md:p-5 bg-[#FAFAFA]">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] tracking-[2px] uppercase text-[#6B6B6B]">Total</span>
                            <span className="font-playfair text-lg md:text-xl font-semibold">₹{cartTotal.toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => { setCartOpen(false); toast('Checkout coming soon!', { icon: '🛍️' }); }}
                            className="w-full btn-primary justify-center py-3 text-xs"
                          >
                            Proceed to Checkout <ArrowRight size={14} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 text-[#0A0A0A] hover:text-[#9B7EC8] transition-colors duration-300 p-1"
                  aria-label="Profile"
                >
                  {isAuthenticated && user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 md:w-7 h-6 md:h-7 rounded-full object-cover border-2 border-[#C4B0D8]"
                    />
                  ) : (
                    <User size={18} className="md:w-5 md:h-5" />
                  )}
                  <ChevronDown
                    size={12}
                    className={`hidden sm:block transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-56 max-w-[calc(100vw-2rem)] md:max-w-[14rem] bg-white shadow-2xl border border-gray-100 z-50 rounded-sm"
                    >
                      {isAuthenticated ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-100 bg-[#F9F6FC]">
                            <p className="text-sm font-semibold text-[#0A0A0A]">{user?.name}</p>
                            <p className="text-[11px] text-[#6B6B6B] mt-0.5 truncate">{user?.email}</p>
                          </div>
                          <div className="py-1">
                            {[
                              { icon: Package, label: 'My Orders' },
                              { icon: Heart, label: 'Wishlist' },
                              { icon: Settings, label: 'Settings' },
                            ].map(({ icon: Icon, label }) => (
                              <button
                                key={label}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] text-[#6B6B6B] hover:bg-[#F9F6FC] hover:text-[#0A0A0A] transition-colors tracking-[1.5px] uppercase"
                              >
                                <Icon size={13} /> {label}
                              </button>
                            ))}
                            <div className="border-t border-gray-100">
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] text-red-500 hover:bg-red-50 transition-colors tracking-[1.5px] uppercase"
                              >
                                <LogOut size={13} /> Sign Out
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-4">
                          <p className="text-xs text-[#6B6B6B] mb-3 tracking-wide leading-relaxed">
                            Sign in to access your account, orders & wishlist.
                          </p>
                          <Link
                            to="/login"
                            onClick={() => setProfileOpen(false)}
                            className="btn-primary w-full justify-center text-xs py-3 block text-center"
                          >
                            Sign In
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-gray-100 bg-white"
            >
              <div className="container-fluid py-4 flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `navbar-link text-sm ${isActive ? '!text-[#9B7EC8]' : ''}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm flex items-start justify-center pt-24 md:pt-32 px-4"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands..."
                  className="w-full bg-white text-[#0A0A0A] px-4 md:px-6 py-4 md:py-5 text-base md:text-lg font-playfair italic pr-12 md:pr-16 outline-none border-b-2 border-[#9B7EC8] shadow-2xl"
                  autoFocus
                />
                <button type="submit" className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[#9B7EC8] hover:text-[#0A0A0A] transition-colors p-1">
                  <Search size={20} />
                </button>
              </form>
              <button
                onClick={() => setSearchOpen(false)}
                className="mt-4 md:mt-6 flex items-center gap-2 text-white/60 hover:text-white text-xs tracking-[2px] uppercase transition-colors"
              >
                <X size={14} /> Close Search
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
