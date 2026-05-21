import React from 'react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Generate page numbers array with dots for large range
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Number of pages to show around current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1.5 py-8 animate-fadeIn select-none">
      
      {/* Prev Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center border border-outline-variant hover:border-ink disabled:hover:border-outline-variant disabled:opacity-30 rounded px-3 py-1.5 text-[9px] font-bold tracking-wider uppercase text-secondary hover:text-ink disabled:text-secondary disabled:cursor-not-allowed transition-all duration-200"
      >
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, idx) => {
          if (page === '...') {
            return (
              <span 
                key={`dots-${idx}`} 
                className="w-8 h-8 flex items-center justify-center text-xs text-secondary font-mono"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded text-xs transition-all duration-300 font-mono ${
                isActive
                  ? 'bg-primary text-white border border-primary shadow-sm font-semibold'
                  : 'bg-transparent text-secondary border border-transparent hover:border-outline hover:text-ink'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center border border-outline-variant hover:border-ink disabled:hover:border-outline-variant disabled:opacity-30 rounded px-3 py-1.5 text-[9px] font-bold tracking-wider uppercase text-secondary hover:text-ink disabled:text-secondary disabled:cursor-not-allowed transition-all duration-200"
      >
        Next
      </button>

    </div>
  );
};
