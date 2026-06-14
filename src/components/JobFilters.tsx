'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types';
import { Check, RotateCcw } from 'lucide-react';

interface JobFiltersProps {
  categories: Category[];
}

const ELIGIBILITY_OPTIONS = [
  { label: 'MCA', value: 'MCA' },
  { label: 'BCA', value: 'BCA' },
  { label: 'BSc Computer Science', value: 'BSc CS' },
  { label: 'BE / BTech', value: 'BTech' },
  { label: 'Recent Graduates', value: 'Graduate' },
];

export default function JobFilters({ categories }: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') || '';
  const activeEligibility = searchParams.get('eligibility') || '';
  const activeFeatured = searchParams.get('featured') === 'true';

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset page when changing filters
    params.delete('page');
    router.push(`/jobs?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/jobs');
  };

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Filters</h3>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All
        </button>
      </div>

      <hr className="border-border" />

      {/* Featured Jobs Filter */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={activeFeatured}
            onChange={(e) => updateFilters('featured', e.target.checked ? 'true' : null)}
            className="sr-only"
          />
          <div
            className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
              activeFeatured
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-border bg-transparent group-hover:border-muted'
            }`}
          >
            {activeFeatured && <Check className="h-3.5 w-3.5" />}
          </div>
          <span className="text-sm font-medium text-foreground">🔥 Featured Jobs Only</span>
        </label>
      </div>

      <hr className="border-border" />

      {/* Eligibility Filter */}
      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Eligibility</h4>
        <div className="space-y-2.5">
          {ELIGIBILITY_OPTIONS.map((option) => {
            const isChecked = activeEligibility === option.value;
            return (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => updateFilters('eligibility', isChecked ? null : option.value)}
                  className="sr-only"
                />
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                    isChecked
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-border bg-transparent group-hover:border-muted'
                  }`}
                >
                  {isChecked && <Check className="h-3.5 w-3.5" />}
                </div>
                <span className="text-sm text-foreground/90">{option.label}</span>
              </label>
            );
          })}
        </div>
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
                onClick={() => updateFilters('category', isSelected ? null : category.slug)}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-all flex items-center justify-between ${
                  isSelected
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
}
