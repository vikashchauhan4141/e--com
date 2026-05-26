import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ConfirmProvider } from './context/ConfirmContext';

// Layout components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Admin Core & Layout
import { AdminRoute } from './components/layout/AdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';

// Lazy Loaded Pages (Code Splitting)
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Shop = React.lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Cart = React.lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Wishlist = React.lazy(() => import('./pages/Wishlist').then(m => ({ default: m.Wishlist })));
const Checkout = React.lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const Login = React.lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = React.lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Profile = React.lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Contact = React.lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const About = React.lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const NotFound = React.lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));

// Lazy Loaded Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminCategories = React.lazy(() => import('./pages/admin/AdminCategories').then(m => ({ default: m.AdminCategories })));

// Premium Glassmorphic Fallback Loader for dynamic suspense transitions
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-[8px] tracking-[0.25em] text-secondary uppercase animate-pulse">Entering Atelier...</span>
    </div>
  </div>
);

// Scroll Restoration Utility - high-fidelity user touch
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-background text-onBackground font-sans">
      
      {/* Global Navigation Header */}
      {!isAdminPath && <Navbar />}

      {/* Dynamic Pages Area */}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* Secure Admin Workspace Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global Brand Footer */}
      {!isAdminPath && <Footer />}

    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ConfirmProvider>
          <CartProvider>
            <WishlistProvider>
              
              {/* Scroll reset utility */}
              <ScrollToTop />
              
              {/* Toast Notifications */}
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#1a1c1c',
                    color: '#ffffff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '12px 20px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#967bb6',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ba1a1a',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />

              <AppContent />

            </WishlistProvider>
          </CartProvider>
        </ConfirmProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
