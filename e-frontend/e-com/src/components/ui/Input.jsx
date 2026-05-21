import React, { forwardRef } from 'react';
import clsx from 'clsx';

export const Input = forwardRef(({
  label,
  error,
  className,
  type = 'text',
  variant = 'outlined', // 'outlined' or 'bottom-border'
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="font-heading font-semibold text-[10px] tracking-widest uppercase text-surface-on-variant">
          {label}
        </label>
      )}
      
      <input
        type={type}
        ref={ref}
        className={clsx(
          "w-full px-4 py-3 bg-surface-container-lowest text-sm text-ink transition-colors font-sans focus:outline-none",
          
          // Border styles
          variant === 'outlined' 
            ? "border border-outline-variant rounded focus:border-primary" 
            : "border-b border-outline-variant focus:border-primary px-0 rounded-none bg-transparent",
          
          error && "border-error focus:border-error",
          className
        )}
        {...props}
      />
      
      {error && (
        <span className="text-[10px] text-error font-sans tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
