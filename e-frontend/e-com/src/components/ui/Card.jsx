import React from 'react';
import clsx from 'clsx';

export const Card = ({
  children,
  className,
  hoverable = false,
  bordered = true,
  padding = 'md',
  ...props
}) => {
  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={clsx(
        "bg-surface-container-lowest transition-all duration-300 rounded-lg",
        bordered && "border border-outline-variant",
        // Diffused ambient shadows matching Stitch specs
        "shadow-[0_10px_30px_rgba(26,26,26,0.03)]",
        hoverable && "hover:shadow-[0_20px_45px_rgba(26,26,26,0.06)] hover:-translate-y-0.5",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
