import React from 'react';
import { Link } from 'react-router-dom';
import { IoSparklesOutline, IoRibbonOutline, IoLocationOutline, IoCalendarOutline } from 'react-icons/io5';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const About = () => {
  return (
    <div className="w-full overflow-hidden animate-fadeIn text-left">
      
      {/* 1. Header Hero section (Original) */}
      <section className="relative bg-surface-container py-24 border-b border-outline-variant/30 text-left">
        <div className="max-w-container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="font-heading font-semibold text-[10px] tracking-[0.25em] text-primary uppercase block">
              The Genesis of Stylee
            </span>
            <h1 className="font-heading font-light text-4xl md:text-5xl tracking-wide text-ink leading-tight">
              Quiet Luxury <br />
              <span className="font-semibold text-primary">Crafted for the Modernist</span>
            </h1>
            <p className="font-sans text-xs text-secondary leading-relaxed max-w-md">
              Established with a directive to create breathing space in contemporary wardrobes, Stylee Atelier focuses on unhurried coordinates. No noise, no overflows—only structured cashmere, Mulberry silk, and Belgian linen.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/shop">
                <Button variant="primary" className="px-8 py-3.5 text-[10px] tracking-widest font-semibold uppercase">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative aspect-[4/3] w-full bg-surface-container rounded-lg overflow-hidden border border-[#e6e0f0]">
            <img 
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80" 
              alt="Editorial Tailoring Shoot" 
              className="w-full h-full object-cover object-center"
              loading="eager"
              fetchpriority="high"
            />
          </div>
        </div>
      </section>

      {/* 2. Majestic Founder & Story Grid (Upgraded Redesign - Text Left, Image Right) */}
      <section className="max-w-container mx-auto px-6 lg:px-16 py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Founder Story Panel (Left Column - 7 Cols) */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <span className="font-heading font-semibold text-[10px] tracking-[0.3em] text-primary uppercase block">
              The Creative Mind
            </span>
            <h2 className="font-heading font-light text-3xl md:text-4xl tracking-wide text-ink">
              The Vision of <span className="font-semibold text-primary">Vikash Chauhan</span>
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary-accent rounded" />

            <div className="space-y-4 font-sans text-xs md:text-sm text-surface-on-variant font-light leading-relaxed">
              <p>
                Envisioned in the hearts of creative spaces, <strong className="font-semibold text-ink">Stylee Atelier</strong> was born as a counter-movement to mass-produced fast fashion. We started with a philosophy that coordinates should serve as custom architectural spaces for the human posture—blending comfort with high-end editorial aesthetics.
              </p>
              <p>
                Under Vikash's meticulous direction, every thread is sourced from long-staple organic cotton, pristine cashmere, and Mulberry silk. Each coordinate undergoes rigorous shape-engineering, ensuring they float seamlessly over your structure to let your inner confidence take center stage.
              </p>
            </div>

            {/* Quick Origin & Established Timeline Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-outline-variant/30">
              <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-outline-variant/20 hover:border-primary/30 transition-colors shadow-sm">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <IoCalendarOutline size={20} />
                </div>
                <div>
                  <p className="text-[9px] text-outline uppercase font-bold tracking-wider">Inception Date</p>
                  <p className="text-sm font-heading font-bold text-ink">May 4, 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-outline-variant/20 hover:border-primary/30 transition-colors shadow-sm">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <IoLocationOutline size={20} />
                </div>
                <div>
                  <p className="text-[9px] text-outline uppercase font-bold tracking-wider">Origin Location</p>
                  <p className="text-sm font-heading font-bold text-ink">Greater Noida, UP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Image Frame (Right Column - 5 Cols) */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="relative group w-full max-w-[420px]">
              
              {/* Elegant background decorative cards for high fashion look */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-primary-accent rounded-xl opacity-20 group-hover:opacity-30 blur-lg transition duration-700 pointer-events-none" />
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-primary-accent/40 rounded-tl-lg" />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-primary-accent/40 rounded-br-lg" />

              {/* Main Portrait Box */}
              <div className="relative bg-white p-4 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-outline-variant/40 overflow-hidden transition-transform duration-500 group-hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(106,81,136,0.15)]">
                <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#f0ecf4]">
                  <img 
                    src="/founder.jpeg" 
                    alt="Vikash Chauhan Portrait" 
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                </div>
                
                {/* Caption signature style */}
                <div className="mt-4 pt-3 text-center border-t border-[#f0ecf4]">
                  <h4 className="font-heading font-bold text-sm tracking-wide text-ink">Vikash Chauhan</h4>
                  <p className="text-[10px] text-primary-accent font-semibold tracking-widest uppercase mt-0.5">Founder & Creative Director</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Values Grid (Original) */}
      <section className="bg-surface-container py-20 border-y border-outline-variant/30 text-left">
        <div className="max-w-container mx-auto px-6 lg:px-16">
          <div className="flex flex-col gap-2 mb-12">
            <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase">Our Anchors</span>
            <h2 className="font-heading font-light text-2xl md:text-3xl tracking-wide text-ink">Three Atelier Commitments</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <Card padding="md" className="border border-outline-variant bg-surface-container-lowest flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <IoSparklesOutline size={20} />
              </div>
              <h3 className="font-heading font-semibold text-xs tracking-widest uppercase text-ink">100% Premium Sourcing</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed">
                We select only long-staple organic cotton, Mulberry silk, and pure Belgian flax. The tactile experience of our clothes is engineered to be therapeutic and premium.
              </p>
            </Card>

            <Card padding="md" className="border border-outline-variant bg-surface-container-lowest flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <IoRibbonOutline size={20} />
              </div>
              <h3 className="font-heading font-semibold text-xs tracking-widest uppercase text-ink">Architectural Tailoring</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed">
                No standard templates are utilized. Each dress, slip, and blazer is draped from scratch by hand under a meticulous design schema to frame clean posture margins.
              </p>
            </Card>

            <Card padding="md" className="border border-outline-variant bg-surface-container-lowest flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <IoLocationOutline size={20} />
              </div>
              <h3 className="font-heading font-semibold text-xs tracking-widest uppercase text-ink">Greater Noida Heritage</h3>
              <p className="font-sans text-xs text-secondary leading-relaxed">
                Based proudly in Greater Noida, UP, we coordinate localized tailoring studios, generating meaningful micro-employment and supporting regional master weavers.
              </p>
            </Card>

          </div>
        </div>
      </section>

      {/* 4. Quality Statement Grid (Original) */}
      <section className="max-w-container mx-auto px-6 lg:px-16 py-24 text-center flex flex-col items-center">
        <span className="text-3xl text-primary font-serif font-light mb-6">“</span>
        <blockquote className="font-heading font-light text-xl md:text-2xl text-ink leading-relaxed max-w-2xl tracking-wide">
          Atelier is not in the business of apparel. We are in the business of confidence, framing modern individuals with quiet coordinates that speak in silence.
        </blockquote>
        <div className="w-10 h-0.5 bg-outline-variant/60 my-6" />
        <p className="font-heading font-bold text-[10px] tracking-[0.2em] text-secondary uppercase">
          Stylee Design philosophy
        </p>
      </section>

    </div>
  );
};
