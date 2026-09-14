import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function JobDetailSkeleton({ isInternship = false }: { isInternship?: boolean }) {
  return (
    <div className="min-h-screen bg-background py-6 sm:py-10">
      <div className="container mx-auto px-4 max-w-6xl space-y-6">
        
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-36 rounded-md" />
        </div>

        {/* 2-Column Grid: Job Header & Body vs Apply Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Job Header Hero Card */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-7 sm:h-8 w-48 sm:w-72 rounded-lg" />
                    <Skeleton className="h-4 w-32 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/70">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
              </div>
            </div>

            {/* Job Description & Requirements Card */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>

              <div className="space-y-3 pt-4 border-t border-border/70">
                <Skeleton className="h-6 w-40 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-11/12 rounded-md" />
                  <Skeleton className="h-4 w-4/5 rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/70">
                <Skeleton className="h-6 w-36 rounded-md" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-7 w-16 rounded-full" />
                  <Skeleton className="h-7 w-28 rounded-full" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-3.5 w-full rounded-md" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <Skeleton className="h-5 w-36 rounded-md" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}

export default JobDetailSkeleton;
