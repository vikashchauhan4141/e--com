import React from 'react';
import { Link } from 'react-router-dom';
import { IoLogoInstagram, IoLogoPinterest, IoLogoFacebook } from 'react-icons/io5';

export const Footer = () => {
  return (
    <footer className="bg-ink-dark text-surface-container-low pt-20 pb-10 mt-stack-lg border-t border-ink-dark">
      <div className="max-w-container mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="font-heading font-light text-base tracking-[0.2em] uppercase text-white">
            Lavender <span className="font-semibold text-primary-accent">Luxe</span>
          </Link>
          <p className="text-xs text-secondary-container leading-relaxed font-sans max-w-xs mt-2">
            A digital atelier rooted in quiet luxury, modern minimalism, and breathing white space. Curated coordinates for a discerning audience.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-secondary-container hover:text-primary-accent transition-colors">
              <IoLogoInstagram size={18} />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="text-secondary-container hover:text-primary-accent transition-colors">
              <IoLogoPinterest size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-secondary-container hover:text-primary-accent transition-colors">
              <IoLogoFacebook size={18} />
            </a>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="font-heading font-semibold text-[10px] tracking-widest uppercase text-white mb-6">Collections</h4>
          <ul className="flex flex-col gap-3 text-xs font-sans">
            <li>
              <Link to="/shop?category=Dresses" className="text-secondary-container hover:text-white transition-colors">Dresses</Link>
            </li>
            <li>
              <Link to="/shop?category=T-Shirts" className="text-secondary-container hover:text-white transition-colors">T-Shirts</Link>
            </li>
            <li>
              <Link to="/shop?category=Outerwear" className="text-secondary-container hover:text-white transition-colors">Outerwear</Link>
            </li>
            <li>
              <Link to="/shop?category=Loungewear" className="text-secondary-container hover:text-white transition-colors">Loungewear</Link>
            </li>
          </ul>
        </div>

        {/* Brand values / links */}
        <div>
          <h4 className="font-heading font-semibold text-[10px] tracking-widest uppercase text-white mb-6">Boutique</h4>
          <ul className="flex flex-col gap-3 text-xs font-sans">
            <li>
              <Link to="/shop" className="text-secondary-container hover:text-white transition-colors">Our Atelier</Link>
            </li>
            <li>
              <span className="text-secondary-container hover:text-white transition-colors cursor-pointer">Craftsmanship</span>
            </li>
            <li>
              <span className="text-secondary-container hover:text-white transition-colors cursor-pointer">Sizing Guide</span>
            </li>
            <li>
              <span className="text-secondary-container hover:text-white transition-colors cursor-pointer">Sustainability</span>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-heading font-semibold text-[10px] tracking-widest uppercase text-white mb-6">Client Services</h4>
          <ul className="flex flex-col gap-3 text-xs font-sans text-secondary-container">
            <li>
              <span className="hover:text-white transition-colors cursor-pointer">Shipping & Delivery</span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-pointer">Exchange & Returns</span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-pointer">Contact Atelier</span>
            </li>
            <li className="text-[10px] text-primary-accent font-semibold tracking-wider uppercase mt-2">
              Free Shipping over ₹5,000
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-container mx-auto px-6 lg:px-16 border-t border-surface-on-variant/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-sans tracking-wide text-secondary-container">
        <p>© 2026 Lavender Luxe E-commerce Store. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="cursor-pointer hover:text-white">Privacy Policy</span>
          <span className="cursor-pointer hover:text-white">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};
