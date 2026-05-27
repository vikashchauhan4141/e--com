import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { IoBagOutline, IoHeartOutline, IoPersonOutline, IoClose, IoMenu } from 'react-icons/io5';
import { Menu, Transition } from '@headlessui/react';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { totalItemsCount } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-surface-container-lowest/85 backdrop-blur-md border-b border-outline-variant shadow-sm py-4' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-container mx-auto px-6 lg:px-16 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <button
          className="md:hidden text-ink p-1"
          onClick={() => setMobileMenuOpen(true)}
        >
          <IoMenu size={24} />
        </button>

        {/* Brand Logo - Montserrat editorial */}
        <Link to="/" className="font-heading font-light text-base tracking-[0.2em] uppercase text-ink">
          Stylee <span className="font-semibold text-primary">Atelier</span>
        </Link>

        {/* Nav Links - Inter Caps 10% spacing */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                font-sans font-semibold text-[10px] tracking-[0.15em] uppercase transition-colors duration-200
                ${isActive ? 'text-primary' : 'text-secondary hover:text-ink'}
              `}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Actions (Wishlist icon, Cart, Profile) */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Wishlist Icon */}
          <Link to="/wishlist" className="relative text-secondary hover:text-primary transition-colors p-1.5">
            <IoHeartOutline size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative text-secondary hover:text-primary transition-colors p-1.5">
            <IoBagOutline size={20} />
            {totalItemsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ink text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* Profile Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="text-secondary hover:text-primary transition-colors p-1.5 focus:outline-none flex items-center gap-1.5">
              <IoPersonOutline size={20} />
            </Menu.Button>
            
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-3 w-48 origin-top-right rounded bg-surface-container-lowest border border-outline-variant shadow-lg py-2 focus:outline-none">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 border-b border-outline-variant mb-1">
                      <p className="text-[10px] text-secondary tracking-widest uppercase">Signed in as</p>
                      <p className="text-xs font-semibold text-ink truncate">{user.name}</p>
                    </div>
                    
                    {user?.role === 'admin' && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/admin"
                            className={`block px-4 py-2 text-xs font-sans font-semibold tracking-wide text-primary ${active ? 'bg-primary/10 text-primary' : ''}`}
                          >
                            Admin Workspace
                          </Link>
                        )}
                      </Menu.Item>
                    )}

                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`block px-4 py-2 text-xs font-sans tracking-wide ${active ? 'bg-surface-container text-ink' : 'text-secondary'}`}
                        >
                          My Profile
                        </Link>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`block w-full text-left px-4 py-2 text-xs font-sans tracking-wide ${active ? 'bg-error-container text-error-on-container' : 'text-error'}`}
                        >
                          Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/login"
                          className={`block px-4 py-2 text-xs font-sans tracking-wide ${active ? 'bg-surface-container text-ink' : 'text-secondary'}`}
                        >
                          Login
                        </Link>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/register"
                          className={`block px-4 py-2 text-xs font-sans tracking-wide ${active ? 'bg-surface-container text-ink' : 'text-secondary'}`}
                        >
                          Register
                        </Link>
                      )}
                    </Menu.Item>
                  </>
                )}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Mobile Drawer Slide-out */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-ink/20 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="relative w-full max-w-xs bg-surface-container-lowest h-full shadow-xl flex flex-col p-6 z-10 transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-outline-variant pb-6 mb-8">
              <Link to="/" className="font-heading font-light text-sm tracking-[0.2em] uppercase text-ink">
                Stylee <span className="font-semibold text-primary">Atelier</span>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-secondary p-1"
              >
                <IoClose size={22} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `
                    font-sans font-semibold text-xs tracking-[0.15em] uppercase py-2
                    ${isActive ? 'text-primary' : 'text-secondary'}
                  `}
                >
                  {link.name}
                </NavLink>
              ))}
              
              <hr className="border-outline-variant" />
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin"
                      className="font-sans font-bold text-xs tracking-[0.15em] uppercase text-primary py-2"
                    >
                      Admin Workspace
                    </Link>
                  )}

                  <Link 
                    to="/profile"
                    className="font-sans font-semibold text-xs tracking-[0.15em] uppercase text-secondary py-2"
                  >
                    Account Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="font-sans font-semibold text-xs tracking-[0.15em] uppercase text-error text-left py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="font-sans font-semibold text-xs tracking-[0.15em] uppercase text-secondary py-2"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register"
                    className="font-sans font-semibold text-xs tracking-[0.15em] uppercase text-secondary py-2"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
