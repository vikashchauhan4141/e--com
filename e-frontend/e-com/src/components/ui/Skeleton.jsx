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

export const CategoryCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-full aspect-[4/5] rounded-none" />
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
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

export const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-container mx-auto px-6 lg:px-16 mt-6 min-h-screen text-left animate-fadeIn">
      {/* Back button placeholder */}
      <Skeleton className="h-4 w-16 mb-8" />

      {/* Main split grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 border-b border-outline-variant pb-16">
        {/* Left Side: Premium Image View Placeholder */}
        <Skeleton className="aspect-[3/4] w-full rounded-lg" />

        {/* Right Side: Details Placeholder */}
        <div className="flex flex-col items-start gap-6 w-full">
          {/* Header */}
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center gap-4 mt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Pricing */}
          <Skeleton className="h-10 w-1/3 py-2 border-y border-outline-variant/40" />

          {/* Colors Selector */}
          <div className="flex flex-col gap-2.5 w-full">
            <Skeleton className="h-3 w-24" />
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-16 rounded" />
              ))}
            </div>
          </div>

          {/* Sizes Selector */}
          <div className="flex flex-col gap-2.5 w-full">
            <Skeleton className="h-3 w-20" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-9 rounded" />
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full">
            <Skeleton className="h-[46px] w-full sm:w-32 rounded" />
            <Skeleton className="h-[46px] flex-grow w-full rounded" />
            <Skeleton className="h-[46px] w-[46px] rounded" />
          </div>

          {/* Footer warning */}
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
};
