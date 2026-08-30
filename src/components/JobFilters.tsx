'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Category } from '@/types';
import { Check, RotateCcw, X, SlidersHorizontal } from 'lucide-react';

interface JobFiltersProps {
  categories: Category[];
}

export default function JobFilters({ categories }: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeCategory = searchParams.get('category') || '';
  const activeFeatured = searchParams.get('featured') === 'true';

  const activeFiltersCount =
    (activeCategory ? 1 : 0) +
    (activeFeatured ? 1 : 0);

  const targetBasePath = pathname.startsWith('/internships') ? '/internships' : '/jobs';

  // 🚀 Pre-warm Next.js browser router cache for all category filters on load for 0ms instant shifts
  useEffect(() => {
    categories.forEach((cat) => {
      router.prefetch(`${targetBasePath}?category=${cat.slug}`);
    });
    router.prefetch(targetBasePath);
  }, [categories, targetBasePath, router]);

  const getCategoryUrl = (categorySlug: string) => {
    const isCurrentlySelected = activeCategory === categorySlug;
    const params = new URLSearchParams();

    if (!isCurrentlySelected) {
      params.set('category', categorySlug);
    }

    const location = searchParams.get('location');
    if (location) params.set('location', location);
    const featured = searchParams.get('featured');
    if (featured) params.set('featured', featured);

    const queryString = params.toString();
    return queryString ? `${targetBasePath}?${queryString}` : targetBasePath;
  };

  const renderFilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Filters</h3>
        <Link
          href={targetBasePath}
          prefetch={true}
          onClick={() => setIsMobileOpen(false)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All
        </Link>
      </div>

      <hr className="border-border" />

      {/* Categories Filter with Instant Prefetching */}
      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Category</h4>
        <div className="space-y-1.5">
          {categories.map((category) => {
            const isSelected = activeCategory === category.slug;
            const href = getCategoryUrl(category.slug);

            return (
              <Link
                key={category.id}
                href={href}
                prefetch={true}
                onClick={() => setIsMobileOpen(false)}
                className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/10 text-indigo-600 font-bold'
                    : 'text-foreground/90 hover:bg-secondary'
                }`}
              >
                <span>{category.name}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0" />}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Inline Filters */}
      <div className="hidden lg:block space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        {renderFilterContent()}
      </div>

      {/* Mobile Drawer Trigger Button */}
      <div className="lg:hidden w-full">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-full flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-secondary transition-all"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
            <span>Filter Opportunities</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white leading-none">
                {activeFiltersCount}
              </span>
            )}
          </span>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Modify</span>
        </button>
      </div>

      {/* Mobile Drawer Slide-out Container */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-card p-6 shadow-2xl border-l border-border animate-in slide-in-from-right duration-300">
            {/* Drawer Close Trigger */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">Filters</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {renderFilterContent()}
          </div>
        </div>
      )}
    </>
  );
}
