import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/products';

const GenderSelector = ({ selected, onChange }) => (
  <div className="flex gap-0 border border-[#E0E0E0] p-1 w-fit">
    {['Women', 'Men'].map((g) => (
      <button
        key={g}
        onClick={() => onChange(g)}
        className={`px-8 py-2.5 text-xs tracking-[2px] uppercase font-inter font-medium transition-all duration-300 ${
          selected === g
            ? 'bg-[#0A0A0A] text-white'
            : 'bg-transparent text-[#6B6B6B] hover:text-[#0A0A0A]'
        }`}
      >
        {g}
      </button>
    ))}
  </div>
);

const CategorySection = () => {
  const [selectedGender, setSelectedGender] = useState('Women');

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-subtitle">Shop by Category</span>
            <div className="divider" />
            <h2 className="section-title">Curated for<br /><em className="text-[#9B7EC8]">Every Style</em></h2>
          </div>
          <GenderSelector selected={selectedGender} onChange={setSelectedGender} />
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <Link
                to={`/products?category=${cat.id}&gender=${selectedGender}`}
                className="category-card block relative group"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#F5F5F5]">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] text-[#C4B0D8] tracking-[3px] uppercase font-inter mb-1">
                    {cat.description}
                  </p>
                  <h3 className="font-playfair text-2xl font-semibold text-white mb-1">{cat.label}</h3>
                  <p className="text-white/50 text-xs font-inter">{cat.count}+ styles</p>

                  <motion.div
                    className="flex items-center gap-2 text-[#C4B0D8] text-xs tracking-[2px] uppercase font-inter mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Explore Now <ArrowRight size={12} />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
