import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowForwardOutline, IoShieldCheckmarkOutline, IoGitMergeOutline, IoSparklesOutline } from 'react-icons/io5';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { CategoryCard } from '../components/shared/CategoryCard';
import { ProductCard } from '../components/shared/ProductCard';
import { Button } from '../components/ui/Button';

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
    title: "Quiet Luxury",
    subtitle: "Aura Collection",
    description: "Bias-cut silk slips and structured cashmere silhouettes engineered for timeless composure."
  },
  {
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1600&q=80",
    title: "Modern Minimalism",
    subtitle: "Everyday Coordinates",
    description: "Ribbed organic knits and oversized cotton tees crafted for an unhurried lifestyle."
  }
];

export const Home = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const trendingProducts = products
    .filter(p => p.rating >= 4.8)
    .slice(0, 4);

  return (
    <div className="w-full overflow-hidden">
      
      {/* 1. Hero Slideshow - Editorial Luxury */}
      <section className="relative w-full h-[75vh] md:h-[85vh] bg-surface-container overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Slide Image */}
            <div className="absolute inset-0 bg-ink/20 z-10" />
            <img
              src={HERO_SLIDES[currentSlide].image}
              alt={HERO_SLIDES[currentSlide].title}
              className="w-full h-full object-cover object-center"
            />

            {/* Slide Details Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-container mx-auto w-full px-6 lg:px-16 flex flex-col items-start gap-4">
                
                <motion.span 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-heading font-semibold text-[10px] tracking-[0.3em] uppercase text-white/90"
                >
                  {HERO_SLIDES[currentSlide].subtitle}
                </motion.span>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="font-heading font-light text-4xl md:text-6xl tracking-wide text-white leading-tight max-w-xl"
                >
                  {HERO_SLIDES[currentSlide].title}
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="font-sans text-white/80 text-sm leading-relaxed max-w-md mt-2"
                >
                  {HERO_SLIDES[currentSlide].description}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mt-6"
                >
                  <Link to="/shop">
                    <Button variant="primary" className="bg-white text-ink border-white hover:bg-primary-accent hover:text-white hover:border-primary-accent py-3.5 px-8">
                      Explore Atelier
                    </Button>
                  </Link>
                </motion.div>
                
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-12 h-1 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white w-16' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Scrolling Marquee Strip */}
      <section className="bg-ink py-4 overflow-hidden border-y border-ink-dark">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 text-white">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="inline-flex items-center gap-16 font-heading font-semibold text-[9px] tracking-[0.25em] uppercase text-surface-container-low/95">
              <span>Free Domestic Shipping over ₹5,000</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-accent" />
              <span>100% Belgian Flax Linen & Mulberry Silk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-accent" />
              <span>Use Code LAVENDER10 for 10% Off</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-accent" />
              <span>Quiet Luxury Crafted in Limited Runs</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-accent" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Categories - Grid */}
      <section className="max-w-container mx-auto px-6 lg:px-16 mt-stack-lg">
        <div className="flex flex-col gap-2 mb-10 text-left">
          <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase">Curated Coordinates</span>
          <h2 className="font-heading font-light text-2xl md:text-3xl tracking-wide text-ink">Shop by Category</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.slice(0, 4).map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 4. Trending Products Section */}
      <section className="max-w-container mx-auto px-6 lg:px-16 mt-stack-lg">
        <div className="flex items-end justify-between mb-10">
          <div className="flex flex-col gap-2 text-left">
            <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase">Discerning Selection</span>
            <h2 className="font-heading font-light text-2xl md:text-3xl tracking-wide text-ink">Trending Pieces</h2>
          </div>
          <Link to="/shop" className="group font-heading font-semibold text-[10px] tracking-widest uppercase text-ink flex items-center gap-2 hover:text-primary transition-colors">
            View All Coordinates <IoArrowForwardOutline className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {trendingProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. Brand Promise Narrative Section */}
      <section className="bg-surface-container py-20 mt-stack-lg border-y border-outline-variant/30">
        <div className="max-w-container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="flex flex-col gap-3 text-left">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-[0_8px_20px_rgba(106,81,136,0.08)]">
              <IoSparklesOutline size={20} />
            </div>
            <h3 className="font-heading font-semibold text-sm tracking-widest uppercase text-ink mt-2">Quiet Luxury Philosophy</h3>
            <p className="font-sans text-xs text-surface-on-variant leading-relaxed">
              We design coordinates that recede to let your posture and confidence speak. Breathing white space, soft colors, and tailored margins define our standard.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-left">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-[0_8px_20px_rgba(106,81,136,0.08)]">
              <IoGitMergeOutline size={20} />
            </div>
            <h3 className="font-heading font-semibold text-sm tracking-widest uppercase text-ink mt-2">Crafted in Small Batches</h3>
            <p className="font-sans text-xs text-surface-on-variant leading-relaxed">
              To honor sustainability and exclusivity, our pieces are tailored in micro runs. No stock overflows; only rare garments for a mindful closet.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-left">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-[0_8px_20px_rgba(106,81,136,0.08)]">
              <IoShieldCheckmarkOutline size={20} />
            </div>
            <h3 className="font-heading font-semibold text-sm tracking-widest uppercase text-ink mt-2">Ethical Fabric Sourcing</h3>
            <p className="font-sans text-xs text-surface-on-variant leading-relaxed">
              From Belgian flax fields to low-impact organic spinneries, we verify that our raw materials honor farmers, artisans, and tailors equally.
            </p>
          </div>

        </div>
      </section>

      {/* 6. Newsletter Subscription */}
      <section className="max-w-container mx-auto px-6 lg:px-16 mt-stack-lg">
        <div className="relative rounded-xl overflow-hidden bg-ink py-20 px-8 text-center text-white border border-ink-dark shadow-[0_20px_45px_rgba(26,26,26,0.15)] flex flex-col items-center justify-center">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(150,123,182,0.15),transparent)] pointer-events-none" />
          
          <span className="font-heading font-semibold text-[10px] tracking-[0.25em] text-primary-accent uppercase mb-3 z-10">
            Exclusive Communications
          </span>
          
          <h2 className="font-heading font-light text-2xl md:text-4xl tracking-wide max-w-lg mb-4 z-10 leading-tight">
            Subscribe to the Atelier Notebook
          </h2>
          
          <p className="font-sans text-white/60 text-xs max-w-sm mb-8 z-10 leading-relaxed">
            Gain early access to exclusive collection previews, limited editions, and notebook releases from our master designer.
          </p>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert("Joined newsletter successfully!");
            }} 
            className="w-full max-w-md flex flex-col sm:flex-row gap-3 z-10"
          >
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              required
              className="flex-grow px-5 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded font-sans text-xs tracking-wider uppercase text-white placeholder-white/40 focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent"
            />
            <Button 
              type="submit" 
              variant="primary" 
              className="bg-white text-ink hover:bg-primary-accent hover:text-white border-white hover:border-primary-accent py-3.5"
            >
              Subscribe
            </Button>
          </form>

        </div>
      </section>

    </div>
  );
};
