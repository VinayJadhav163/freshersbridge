import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function JobCardSkeleton() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-[16px] border border-[#e7e7f1] dark:border-slate-800 bg-card p-4 sm:p-5 max-w-xl w-full shadow-xs space-y-4">
      {/* Top Row: Title, Company & Logo Placeholder */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton className="h-5 w-4/5 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-1/3 rounded-md" />
            <Skeleton className="h-3.5 w-12 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
      </div>

      {/* Meta Pills: Location, Job Type, Experience */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>

      {/* Salary & Batches Row */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>

      {/* Bottom Row: View Details Action */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <Skeleton className="h-3.5 w-20 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function JobListSkeleton({
  title = 'Off-Campus Tech Drives & Internships',
  isInternship = false,
  count = 6,
}: {
  title?: string;
  isInternship?: boolean;
  count?: number;
}) {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        
        {/* Header Skeleton */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-8 sm:h-10 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-md" />
        </div>

        {/* Search & Filter Bar Skeleton */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <Skeleton className="sm:col-span-6 h-11 rounded-xl" />
            <Skeleton className="sm:col-span-3 h-11 rounded-xl" />
            <Skeleton className="sm:col-span-3 h-11 rounded-xl" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pt-1">
            <Skeleton className="h-7 w-20 rounded-full shrink-0" />
            <Skeleton className="h-7 w-24 rounded-full shrink-0" />
            <Skeleton className="h-7 w-20 rounded-full shrink-0" />
            <Skeleton className="h-7 w-28 rounded-full shrink-0" />
            <Skeleton className="h-7 w-16 rounded-full shrink-0" />
          </div>
        </div>

        {/* 2-Column Grid: Job Cards vs Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column (8 cols): Job Cards */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: count }).map((_, idx) => (
                <JobCardSkeleton key={idx} />
              ))}
            </div>
          </div>

          {/* Sidebar Column (4 cols): Quick Career Tools & Community Cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <Skeleton className="h-5 w-32 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default JobListSkeleton;
