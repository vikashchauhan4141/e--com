import React from 'react';
import clsx from 'clsx';

export const Skeleton = ({
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "animate-pulse bg-surface-container rounded",
        className
      )}
      {...props}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Image box */}
      <Skeleton className="aspect-[3/4] w-full" />
      {/* Title */}
      <Skeleton className="h-4 w-3/4 mt-1" />
      {/* Price */}
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
};
