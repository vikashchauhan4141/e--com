import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/shop?category=${category.name}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-lg border border-outline-variant bg-surface-container shadow-[0_10px_25px_rgba(26,26,26,0.02)]"
    >
      {/* Category Image */}
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Elegant Translucent Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent flex flex-col justify-end p-6 md:p-8 transition-opacity duration-300" />
      
      {/* Category Details */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col gap-1.5 z-10 text-white">
        <h3 className="font-heading font-light text-lg md:text-xl tracking-widest uppercase">
          {category.name}
        </h3>
        
        <p className="font-sans text-[11px] text-surface-container-low font-normal max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
        
        <span className="font-heading font-semibold text-[10px] tracking-widest uppercase text-primary-accent mt-2 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
          Discover Collection ──
        </span>
      </div>

    </Link>
  );
};
