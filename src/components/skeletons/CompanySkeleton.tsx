import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function CompanyCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>
      </div>
      <div className="space-y-2 pt-2 border-t border-border/70">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function CompanyListSkeleton() {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        <div className="space-y-3 max-w-2xl">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-8 sm:h-10 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <CompanyCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CompanyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background py-6 sm:py-10">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>

        {/* Hero Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-5">
            <Skeleton className="h-20 w-20 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-56 rounded-lg" />
              <Skeleton className="h-4 w-36 rounded-md" />
              <div className="flex items-center gap-2 pt-1">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Tracks & Syllabus vs Aside */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main 2 Cols */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hiring Tracks Section */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <Skeleton className="h-6 w-48 rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
              </div>
            </div>

            {/* Selection Process */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <Skeleton className="h-6 w-52 rounded-md" />
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>

            {/* FAQ Skeleton */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <Skeleton className="h-6 w-60 rounded-md" />
              <div className="space-y-3">
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            </div>

          </div>

          {/* Right Aside */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <Skeleton className="h-5 w-32 rounded-full" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}

export default CompanyListSkeleton;
