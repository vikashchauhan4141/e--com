import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaTwitter, FaPinterest, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const FOOTER_LINKS = {
  Shop: [
    { label: 'New Arrivals', to: '/products?filter=new' },
    { label: 'Women', to: '/products?gender=Women' },
    { label: 'Men', to: '/products?gender=Men' },
    { label: 'T-Shirts', to: '/products?category=T-Shirts' },
    { label: 'Watches', to: '/products?category=Watches' },
    { label: 'Shoes', to: '/products?category=Shoes' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Our Story', to: '/about#story' },
    { label: 'Careers', to: '/about' },
    { label: 'Press', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  Support: [
    { label: 'FAQ', to: '/contact' },
    { label: 'Shipping Policy', to: '/contact' },
    { label: 'Returns & Exchanges', to: '/contact' },
    { label: 'Size Guide', to: '/products' },
    { label: 'Track Order', to: '/contact' },
  ],
};

const SOCIAL_LINKS = [
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaPinterest, label: 'Pinterest', href: '#' },
  { icon: FaTwitter, label: 'Twitter/X', href: '#' },
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
  { icon: FaYoutube, label: 'YouTube', href: '#' },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('You\'re on the list! Welcome to COCO.', { icon: '✨' });
    setEmail('');
  };

  return (
    <footer className="bg-[#0A0A0A] text-white">
      {/* Newsletter Strip */}
      <div className="border-b border-white/10 overflow-x-hidden">
        <div className="container-fluid max-w-[1440px] py-10 md:py-14">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
            <div>
              <span className="section-subtitle text-[#9B7EC8]">Stay in the loop</span>
              <h3 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-semibold text-white mt-3 leading-tight">
                Get Early Access to<br />
                <em className="text-[#C4B0D8]">New Collections</em>
              </h3>
              <p className="text-white/50 text-sm mt-3 font-inter leading-relaxed">
                Join the COCO inner circle. Be first to know about new arrivals, exclusive offers, and curated edits.
              </p>
            </div>

            <form onSubmit={handleNewsletter} className="flex gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 min-w-0 bg-white/5 border border-white/20 border-r-0 px-4 md:px-5 py-3 md:py-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#9B7EC8] transition-colors font-inter"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#9B7EC8] hover:bg-[#8A6DB7] text-white px-4 md:px-7 py-3 md:py-4 text-xs tracking-[2px] uppercase font-medium transition-colors flex items-center gap-2 shrink-0"
              >
                Subscribe <ArrowRight size={14} className="hidden sm:block" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-fluid max-w-[1440px] py-12 md:py-16 overflow-x-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="inline-flex flex-col mb-4 md:mb-6">
              <span className="font-playfair text-2xl md:text-3xl font-bold tracking-[6px] md:tracking-[8px] text-white">COCO</span>
              <span className="text-[9px] tracking-[3px] md:tracking-[4px] text-[#9B7EC8] font-medium mt-1">FASHION</span>
            </Link>
            <p className="text-white/40 text-xs md:text-sm leading-relaxed font-inter max-w-xs">
              Where minimalism meets luxury. Crafting timeless pieces for the modern wardrobe since 2018.
            </p>

            {/* Contact Info */}
            <div className="mt-4 md:mt-6 flex flex-col gap-2 md:gap-3">
              {[
                { icon: MdEmail, text: 'hello@cocofashion.in' },
                { icon: MdPhone, text: '+91 98765 43210' },
                { icon: MdLocationOn, text: 'Mumbai, Maharashtra, India' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 md:gap-3 text-white/40 text-[11px] md:text-xs">
                  <Icon size={14} className="text-[#9B7EC8] shrink-0" />
                  <span className="font-inter break-words">{text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-4 md:mt-6 flex items-center gap-2 md:gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, color: '#9B7EC8' }}
                  className="w-8 md:w-9 h-8 md:h-9 border border-white/20 flex items-center justify-center text-white/50 hover:border-[#9B7EC8] hover:text-[#9B7EC8] transition-colors duration-300 shrink-0"
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Link Groups */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="min-w-0">
              <h4 className="text-[10px] md:text-xs font-semibold tracking-[2px] md:tracking-[3px] uppercase text-white mb-3 md:mb-5 font-inter">
                {category}
              </h4>
              <ul className="flex flex-col gap-2 md:gap-3">
                {links.map((link) => (
                  <li key={link.label} className="min-w-0">
                    <Link
                      to={link.to}
                      className="text-white/40 text-[11px] md:text-sm font-inter hover:text-[#C4B0D8] transition-colors duration-200 break-words"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 overflow-x-hidden">
        <div className="container-fluid max-w-[1440px] py-4 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
          <p className="text-white/30 text-[10px] md:text-xs font-inter tracking-wide text-center sm:text-left">
            © {new Date().getFullYear()} COCO Fashion. All rights reserved.
          </p>
          <div className="flex items-center gap-3 md:gap-6 flex-wrap justify-center sm:justify-end">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} to="/" className="text-white/30 text-[10px] md:text-xs font-inter hover:text-white/60 transition-colors whitespace-nowrap">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
