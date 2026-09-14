import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function PageSkeleton({
  title = true,
  cardsCount = 3,
}: {
  title?: boolean;
  cardsCount?: number;
}) {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        
        {/* Header Skeleton */}
        {title && (
          <div className="space-y-3 max-w-2xl mx-auto text-center">
            <div className="flex justify-center">
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <Skeleton className="h-8 sm:h-10 w-3/4 mx-auto rounded-lg" />
            <Skeleton className="h-4 w-full max-w-md mx-auto rounded-md" />
          </div>
        )}

        {/* Generic Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {Array.from({ length: cardsCount }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl pt-2" />
            </div>
          ))}
        </div>

        {/* Bottom Banner Skeleton */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        </div>

      </div>
    </div>
  );
}

export default PageSkeleton;
