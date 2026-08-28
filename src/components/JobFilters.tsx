'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Category } from '@/types';
import { Check, RotateCcw, X, SlidersHorizontal, Loader2 } from 'lucide-react';

interface JobFiltersProps {
  categories: Category[];
}

export default function JobFilters({ categories }: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const activeCategory = searchParams.get('category') || '';
  const activeFeatured = searchParams.get('featured') === 'true';

  const activeFiltersCount =
    (activeCategory ? 1 : 0) +
    (activeFeatured ? 1 : 0);

  const targetBasePath = pathname.startsWith('/internships') ? '/internships' : '/jobs';

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    startTransition(() => {
      router.push(`${targetBasePath}?${params.toString()}`);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push(targetBasePath);
    });
  };

  const renderFilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Filters</h3>
        <button
          onClick={() => {
            handleReset();
            setIsMobileOpen(false);
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All
        </button>
      </div>

      <hr className="border-border" />

      {/* Categories Filter */}
      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Category</h4>
        <div className="space-y-2.5">
          {categories.map((category) => {
            const isSelected = activeCategory === category.slug;
            return (
              <button
                key={category.id}
                onClick={() => {
                  updateFilters('category', isSelected ? null : category.slug);
                  // Auto close drawer on category select for mobile
                  setIsMobileOpen(false);
                }}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-all flex items-center justify-between ${isSelected
                  ? 'bg-indigo-600/10 text-indigo-600 font-semibold'
                  : 'text-foreground/90 hover:bg-secondary'
                  }`}
              >
                <span>{category.name}</span>
                {isSelected && <Check className="h-4 w-4" />}
              </button>
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
