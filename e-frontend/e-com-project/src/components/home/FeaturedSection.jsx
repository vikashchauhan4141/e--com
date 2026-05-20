import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../data/products';

import 'swiper/css';

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={13}
        className={s <= rating ? 'text-[#9B7EC8] fill-[#9B7EC8]' : 'text-gray-200 fill-gray-200'}
      />
    ))}
  </div>
);

const FeaturedSection = () => {
  return (
    <>
      {/* Featured Banner */}
      <section className="py-20 lg:py-28 bg-[#0A0A0A] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="section-subtitle text-[#9B7EC8]">Featured</span>
              <div className="w-10 h-0.5 bg-[#9B7EC8] my-3" />
              <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                The <em className="text-[#C4B0D8]">Signature</em><br />Collection 2025
              </h2>
              <p className="text-white/50 font-inter text-sm leading-relaxed mb-8 max-w-sm">
                Our most celebrated pieces, refined and reimagined for the new season. Each item is handpicked
                for its exceptional craftsmanship and timeless appeal.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { num: '200+', label: 'Premium Styles' },
                  { num: '50K+', label: 'Happy Clients' },
                  { num: '7', label: 'Years of Luxury' },
                ].map(({ num, label }) => (
                  <div key={label}>
                    <p className="font-playfair text-3xl font-bold text-white">{num}</p>
                    <p className="text-white/40 text-xs font-inter mt-1 tracking-wide">{label}</p>
                  </div>
                ))}
              </div>
              <a href="/products" className="btn-lavender inline-flex">
                Explore Featured
              </a>
            </motion.div>

            {/* Right — Image Collage */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex flex-col gap-4">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&auto=format&fit=crop"
                    alt="Collection 1"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&auto=format&fit=crop"
                    alt="Collection 2"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-8">
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&auto=format&fit=crop"
                    alt="Collection 3"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1612903573285-1b0b17f1b0bf?w=400&auto=format&fit=crop"
                    alt="Collection 4"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-24 bg-[#F9F6FC]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <span className="section-subtitle">Testimonials</span>
            <div className="divider mx-auto" />
            <h2 className="section-title">What Our <em className="text-[#9B7EC8]">Clients Say</em></h2>
          </div>

          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            slidesPerView={1}
            spaceBetween={24}
            loop
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="bg-white p-8 h-full border border-[#E8E0F0] hover:border-[#C4B0D8] transition-colors duration-300">
                  <Quote size={28} className="text-[#C4B0D8] mb-4 rotate-180" />
                  <p className="text-[#0A0A0A] text-sm font-inter leading-relaxed mb-6 italic">
                    "{t.comment}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#C4B0D8]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#0A0A0A] font-inter">{t.name}</p>
                        <p className="text-[10px] text-[#6B6B6B] font-inter">{t.location}</p>
                      </div>
                    </div>
                    <StarRow rating={t.rating} />
                  </div>
                  <p className="text-[10px] text-[#9B7EC8] mt-3 tracking-wide font-inter">
                    Purchased: {t.product}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default FeaturedSection;
