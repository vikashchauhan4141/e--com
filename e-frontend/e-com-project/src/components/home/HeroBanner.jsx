import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { heroBanners } from '../../data/products';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: 'easeOut' },
  }),
};

const HeroBanner = () => {
  return (
    <section className="relative h-screen min-h-[600px]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true, bulletClass: 'swiper-bullet', bulletActiveClass: 'swiper-bullet-active' }}
        loop
        className="h-full w-full hero-swiper"
      >
        {heroBanners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div
                className={`relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full flex ${
                  banner.align === 'right'
                    ? 'justify-end'
                    : banner.align === 'center'
                    ? 'justify-center text-center'
                    : 'justify-start'
                }`}
              >
                <div className={`max-w-xl ${banner.align === 'center' ? 'text-center' : ''}`}>
                  <motion.span
                    custom={0}
                    variants={textVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                    className="inline-block text-[#C4B0D8] text-[11px] tracking-[5px] uppercase font-inter font-medium mb-4"
                  >
                    {banner.subtitle}
                  </motion.span>

                  <motion.h1
                    custom={1}
                    variants={textVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                    className="font-playfair text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-5"
                  >
                    {banner.title.split(' ').map((word, i) => (
                      <span key={i} className={i === banner.title.split(' ').length - 1 ? 'italic text-[#E8E0F0]' : ''}>
                        {word}{' '}
                      </span>
                    ))}
                  </motion.h1>

                  <motion.p
                    custom={2}
                    variants={textVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                    className="text-white/70 text-base font-inter font-light leading-relaxed mb-8 max-w-md"
                  >
                    {banner.description}
                  </motion.p>

                  <motion.div
                    custom={3}
                    variants={textVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                    className={`flex gap-4 ${banner.align === 'center' ? 'justify-center' : ''}`}
                  >
                    <Link to="/products" className="btn-primary bg-white text-[#0A0A0A] border-white hover:bg-transparent hover:text-white">
                      {banner.cta} <ArrowRight size={14} />
                    </Link>
                    <Link to="/products" className="btn-secondary border-white/50 text-white hover:bg-white hover:text-[#0A0A0A]">
                      {banner.ctaSecondary}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-white/40 text-[9px] tracking-[3px] uppercase font-inter">Scroll</span>
        <ChevronDown size={18} className="text-white/40" />
      </motion.div>

      <style>{`
        .hero-swiper .swiper-pagination {
          bottom: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .swiper-bullet {
          width: 20px;
          height: 2px;
          background: rgba(255,255,255,0.35);
          border-radius: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .swiper-bullet-active {
          width: 40px;
          background: #C4B0D8;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;
