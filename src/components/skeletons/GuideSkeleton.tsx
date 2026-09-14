import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function GuideCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
      <Skeleton className="h-6 w-5/6 rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border/70">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-3.5 w-24 rounded-md" />
        </div>
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
    </div>
  );
}

export function GuideListSkeleton() {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="space-y-3 max-w-2xl">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-8 sm:h-10 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-md" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Skeleton className="h-8 w-20 rounded-full shrink-0" />
          <Skeleton className="h-8 w-28 rounded-full shrink-0" />
          <Skeleton className="h-8 w-24 rounded-full shrink-0" />
          <Skeleton className="h-8 w-32 rounded-full shrink-0" />
          <Skeleton className="h-8 w-24 rounded-full shrink-0" />
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <GuideCardSkeleton key={idx} />
          ))}
        </div>

      </div>
    </div>
  );
}

export function GuideArticleSkeleton() {
  return (
    <div className="min-h-screen bg-background py-6 sm:py-10">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-40 rounded-md" />
        </div>

        {/* 2-Column Article Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header */}
            <div className="space-y-4 border-b border-border pb-8">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
              <Skeleton className="h-8 sm:h-12 w-full rounded-xl" />
              <Skeleton className="h-5 w-4/5 rounded-md" />
              
              {/* Author Byline */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>

            {/* Quick Answer Banner */}
            <Skeleton className="h-28 w-full rounded-2xl" />

            {/* Table of Contents */}
            <Skeleton className="h-36 w-full rounded-2xl" />

            {/* Article Content Paragraphs */}
            <div className="space-y-4">
              <Skeleton className="h-7 w-2/5 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-11/12 rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>

          </div>

          {/* Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <Skeleton className="h-5 w-32 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}

export default GuideListSkeleton;
