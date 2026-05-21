import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  IoArrowBackOutline, 
  IoHomeOutline, 
  IoBagHandleOutline, 
  IoCompassOutline 
} from 'react-icons/io5';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-6 py-12 select-none">
      <div className="max-w-md w-full text-center space-y-8 animate-fadeIn">
        
        {/* Abstract Premium Visual Element */}
        <div className="relative flex justify-center">
          {/* Subtle background glow */}
          <div className="absolute w-44 h-44 bg-primary/10 rounded-full blur-3xl -top-6 animate-pulse"></div>
          
          {/* Main 404 Text with custom aesthetic */}
          <h1 className="relative font-heading font-light text-9xl tracking-tighter text-primary select-none filter drop-shadow-sm">
            4<span className="font-semibold text-ink inline-block transform hover:rotate-12 transition-transform duration-300">0</span>4
          </h1>
          
          {/* Floating mini icon */}
          <div className="absolute -right-4 top-2 text-primary/40 animate-bounce duration-1000">
            <IoCompassOutline size={28} className="animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h2 className="font-heading font-semibold text-xs tracking-[0.25em] text-secondary uppercase">
            Coordinates Lost
          </h2>
          <h3 className="font-heading font-light text-xl text-ink leading-snug">
            This piece of the atelier does not exist.
          </h3>
          <p className="text-xs text-secondary max-w-sm mx-auto leading-relaxed">
            The collection segment you are trying to view might have been archived, renamed, or moved to another section of the gallery.
          </p>
        </div>

        {/* Action Hub */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-outline hover:border-ink rounded px-6 py-2.5 text-[10px] font-bold tracking-wider uppercase text-secondary hover:text-ink transition-colors duration-200"
          >
            <IoArrowBackOutline size={14} />
            Go Back
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded px-6 py-2.5 text-[10px] font-bold tracking-wider uppercase transition-colors shadow-sm"
          >
            <IoHomeOutline size={14} />
            Home Gallery
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-ink rounded px-6 py-2.5 text-[10px] font-bold tracking-wider uppercase transition-colors"
          >
            <IoBagHandleOutline size={14} />
            Shop Atelier
          </Link>
        </div>

      </div>
    </div>
  );
};
