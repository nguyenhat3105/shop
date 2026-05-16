import React from 'react';

/* ════════════════════════════════════════
   SKELETON LOADING — Pure Tailwind CSS
════════════════════════════════════════ */

export default function SkeletonCard() {
  return (
    <div className="card-base" aria-hidden="true">
      {/* Image skeleton */}
      <div className="skeleton w-full aspect-product" />
      
      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Category badge */}
        <div className="skeleton h-3 w-16 rounded-full" />
        
        {/* Title lines */}
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/5" />
        
        {/* Stars */}
        <div className="skeleton h-3 w-20 rounded-full" />
        
        {/* Footer: price + button */}
        <div className="flex items-center justify-between pt-1">
          <div className="skeleton h-5 w-24" />
          <div className="skeleton h-9 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonProductDetail() {
  return (
    <div className="py-8" aria-hidden="true">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        
        {/* Gallery column */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="skeleton w-full aspect-[4/5] rounded-xl" />
          
          {/* Thumbnails */}
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Info column */}
        <div className="space-y-4">
          {/* Category */}
          <div className="skeleton h-3 w-20 rounded-full" />
          
          {/* Title */}
          <div className="space-y-2">
            <div className="skeleton h-8 w-full" />
            <div className="skeleton h-8 w-2/3" />
          </div>
          
          {/* Rating */}
          <div className="skeleton h-4 w-32 rounded-full" />
          
          {/* Price */}
          <div className="skeleton h-10 w-36 rounded-lg" />
          
          {/* Divider */}
          <div className="h-px bg-gray-200" />
          
          {/* Description lines */}
          <div className="space-y-2">
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-4/5" />
          </div>
          
          {/* Actions */}
          <div className="skeleton h-12 w-full rounded-lg mt-6" />
        </div>
      </div>
    </div>
  );
}
