import React, { useState, useContext } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  IoGridOutline, 
  IoShirtOutline, 
  IoReceiptOutline, 
  IoPeopleOutline, 
  IoArrowBackOutline,
  IoMenu,
  IoClose,
  IoLogOutOutline,
  IoPersonOutline
} from 'react-icons/io5';
import { AuthContext } from '../../context/AuthContext';

export const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: <IoGridOutline size={18} /> },
    { name: 'Category Tags', path: '/admin/categories', icon: <IoGridOutline size={18} /> },
    { name: 'Catalog CRUD', path: '/admin/products', icon: <IoShirtOutline size={18} /> },
    { name: 'Orders Dispatch', path: '/admin/orders', icon: <IoReceiptOutline size={18} /> },
    { name: 'User Access', path: '/admin/users', icon: <IoPeopleOutline size={18} /> },
  ];

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-background text-onBackground font-sans">
      
      {/* Sidebar Navigation - Sticky Glass Panel */}
      <aside className="hidden md:flex flex-col w-64 border-r border-outline-variant bg-surface-container-lowest/80 backdrop-blur-md px-6 py-8 fixed top-0 bottom-0 z-30">
        
        {/* Workspace Brand Title */}
        <div className="mb-10 px-2">
          <Link to="/" className="font-heading font-light text-[11px] tracking-[0.25em] uppercase text-ink flex items-center gap-2">
            Stylee <span className="font-semibold text-primary">Atelier</span>
          </Link>
          <div className="mt-2 text-[9px] font-sans tracking-[0.1em] text-secondary uppercase bg-surface-container px-2 py-0.5 rounded w-max">
            Admin Workspace
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-grow flex flex-col gap-1">
          {adminLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded text-[11px] font-semibold tracking-wider uppercase transition-all duration-300
                ${isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-secondary hover:text-ink hover:bg-surface-container-low'}
              `}
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* User Status Card & Actions */}
        <div className="mt-auto border-t border-outline-variant pt-6">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img 
              src={user?.avatar} 
              alt={user?.name} 
              className="w-8 h-8 rounded-full border border-outline object-cover"
            />
            <div className="truncate">
              <p className="text-[10px] font-bold text-ink truncate leading-tight">{user?.name}</p>
              <p className="text-[9px] text-secondary truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2 rounded text-[10px] font-bold tracking-wider uppercase text-secondary hover:text-ink hover:bg-surface-container-low transition-colors duration-200"
            >
              <IoPersonOutline size={16} />
              My Profile
            </Link>
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2 rounded text-[10px] font-bold tracking-wider uppercase text-secondary hover:text-ink hover:bg-surface-container-low transition-colors duration-200"
            >
              <IoArrowBackOutline size={16} />
              Return To Shop
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2 rounded text-[10px] font-bold tracking-wider uppercase text-error hover:bg-error-container/20 transition-colors duration-200 w-full text-left"
            >
              <IoLogOutOutline size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        
        {/* Top Sticky Header for Mobile Menu / Header context */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest/80 backdrop-blur-md px-6 py-4 md:py-6">
          <div className="flex items-center gap-4">
            {/* Hamburger trigger for mobile side drawer */}
            <button
              className="md:hidden text-ink p-1"
              onClick={() => setMobileMenuOpen(true)}
            >
              <IoMenu size={24} />
            </button>
            
            <h1 className="font-heading font-light text-base tracking-[0.15em] uppercase text-ink">
              Workspace <span className="font-semibold text-primary">Console</span>
            </h1>
          </div>

          {/* Quick status details */}
          <div className="hidden sm:flex items-center gap-3 text-[10px] tracking-widest uppercase text-secondary">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
            <span>API Synchronized</span>
          </div>
        </header>

        {/* Dynamic Nested View Viewport */}
        <main className="flex-grow p-6 lg:p-10 max-w-container mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Navigation Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-ink/30 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="relative w-full max-w-xs bg-surface-container-lowest h-full shadow-2xl flex flex-col p-6 z-10">
            <div className="flex items-center justify-between border-b border-outline-variant pb-6 mb-8">
              <div>
                <Link to="/" className="font-heading font-light text-xs tracking-[0.2em] uppercase text-ink">
                  Stylee <span className="font-semibold text-primary">Atelier</span>
                </Link>
                <div className="mt-1 text-[8px] tracking-[0.1em] text-secondary uppercase">
                  Admin Console
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-secondary p-1"
              >
                <IoClose size={22} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2">
              {adminLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/admin'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-3 rounded text-[11px] font-semibold tracking-wider uppercase transition-colors
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-secondary hover:text-ink hover:bg-surface-container-low'}
                  `}
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto border-t border-outline-variant pt-6">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src={user?.avatar} 
                  alt={user?.name} 
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <div className="truncate">
                  <p className="text-[10px] font-bold text-ink truncate">{user?.name}</p>
                  <p className="text-[9px] text-secondary truncate">{user?.email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-[10px] font-semibold tracking-wider uppercase text-secondary hover:text-ink"
                >
                  <IoPersonOutline size={16} />
                  My Profile
                </Link>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-[10px] font-semibold tracking-wider uppercase text-secondary hover:text-ink"
                >
                  <IoArrowBackOutline size={16} />
                  Return To Shop
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-2 text-[10px] font-semibold tracking-wider uppercase text-error w-full text-left"
                >
                  <IoLogOutOutline size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
