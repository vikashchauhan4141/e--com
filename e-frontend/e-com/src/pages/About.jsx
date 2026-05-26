import React from 'react';
import { Link } from 'react-router-dom';
import { IoSparklesOutline, IoRibbonOutline, IoLocationOutline, IoCalendarOutline } from 'react-icons/io5';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const About = () => {
  return (
    <div className="w-full overflow-hidden animate-fadeIn">
      
      {/* 1. Header Hero section */}
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
              src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80" 
              alt="Editorial Tailoring Shoot" 
              className="w-full h-full object-cover object-center"
              loading="eager"
              fetchpriority="high"
            />
          </div>
        </div>
      </section>

      {/* 2. Timeline and Founder Highlight Card */}
      <section className="max-w-container mx-auto px-6 lg:px-16 py-20 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
          
          {/* Founder Panel */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-heading font-semibold text-[10px] tracking-widest text-primary uppercase">
                The Architect
              </span>
              <h2 className="font-heading font-light text-2xl md:text-3xl tracking-wide text-ink">
                Founded by <span className="font-semibold text-primary-accent">Vikash Chauhan</span>
              </h2>
              <div className="w-12 h-0.5 bg-primary-accent rounded" />
              <p className="font-sans text-xs text-surface-on-variant leading-relaxed max-w-xl pt-2">
                Stylee was envisioned by visionary designer **Vikash Chauhan** as a response to the hyper-consumerism of fast fashion. Born out of a deep respect for organic textiles and architectural tailoring, the brand serves as a bridge between absolute comfort and high-end editorial aesthetics. 
              </p>
              <p className="font-sans text-xs text-surface-on-variant leading-relaxed max-w-xl">
                Every coordinate designed under Vikash's direction undergoes rigorous pattern engineering, ensuring it recedes beautifully to let your posture and inner elegance make the statement.
              </p>
            </div>
            
            {/* Meta badges row */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-outline-variant/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary-accent">
                  <IoCalendarOutline size={18} />
                </div>
                <div>
                  <p className="text-[9px] text-outline uppercase font-semibold">Established</p>
                  <p className="text-xs font-heading font-bold text-ink">May 4, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary-accent">
                  <IoLocationOutline size={18} />
                </div>
                <div>
                  <p className="text-[9px] text-outline uppercase font-semibold">Origin Coordinate</p>
                  <p className="text-xs font-heading font-bold text-ink">Greater Noida, UP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Side imagery frame */}
          <div className="relative aspect-[3/4] w-full bg-surface-container rounded-lg overflow-hidden border border-[#e6e0f0] lg:col-span-1 shadow-lg">
            <img 
              src="/founder.jpeg" 
              alt="Vikash Chauhan Portrait" 
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>

        </div>
      </section>

      {/* 3. Core Values Grid */}
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

      {/* 4. Quality Statement Grid (Large Quote Block) */}
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
