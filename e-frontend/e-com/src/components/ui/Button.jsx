import React from 'react';
import clsx from 'clsx';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-heading font-semibold text-xs tracking-widest uppercase transition-all duration-300 rounded focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-ink text-white hover:bg-primary border border-ink hover:border-primary shadow-sm active:scale-[0.98]",
    secondary: "bg-transparent text-ink border border-ink hover:bg-surface-container active:scale-[0.98]",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary/10 active:scale-[0.98]",
    ghost: "bg-transparent text-secondary hover:text-ink hover:bg-surface-container-low",
    danger: "bg-error text-white border border-error hover:bg-error-container hover:text-error-on-container",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(baseStyle, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
