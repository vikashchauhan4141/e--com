import React from 'react';
import clsx from 'clsx';

export const Badge = ({
  children,
  variant = 'primary',
  className,
  ...props
}) => {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-sans font-semibold tracking-wider uppercase";
  
  const variants = {
    primary: "bg-primary-fixed text-primary-on-container",
    secondary: "bg-secondary-container text-secondary-on-container",
    accent: "bg-primary/10 text-primary border border-primary/20",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    danger: "bg-error/10 text-error border border-error/20",
    neutral: "bg-surface-container text-surface-on-variant",
  };

  return (
    <span
      className={clsx(baseStyle, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
