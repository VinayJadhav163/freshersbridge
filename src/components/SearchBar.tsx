'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  initialLocation?: string;
  buttonText?: string;
  targetPath?: string;
  placeholder?: string;
}

export default function SearchBar({
  initialQuery = '',
  initialLocation = '',
  buttonText = 'Search Jobs',
  targetPath = '/jobs',
  placeholder = 'Job title, skills, or company...',
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [isPending, startTransition] = useTransition();
  const queryInputRef = useRef<HTMLInputElement>(null);

  // Sync state if search params change
  useEffect(() => {
    setQuery(searchParams.get('q') || initialQuery);
    setLocation(searchParams.get('location') || initialLocation);
  }, [searchParams, initialQuery, initialLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = query.trim();
    const trimmedLocation = location.trim();

    // If both query and location are empty, focus the input instead of blank redirect
    if (!trimmedQuery && !trimmedLocation) {
      queryInputRef.current?.focus();
      return;
    }

    const params = new URLSearchParams();
    if (trimmedQuery) params.append('q', trimmedQuery);
    if (trimmedLocation) params.append('location', trimmedLocation);

    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `${targetPath}?${queryString}` : targetPath);
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-full overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs p-1.5 flex flex-col md:flex-row gap-1.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#275df5]/15 focus-within:border-[#275df5]"
    >
      {/* Title/Keyword Input */}
      <div className="flex-1 flex items-center gap-2 px-3 py-1.5 min-w-0">
        <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
        <input
          ref={queryInputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border-0 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium"
        />
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block w-px bg-slate-200 dark:bg-slate-800 my-1.5" />

      {/* Location Input */}
      <div className="flex-1 flex items-center gap-2 px-3 py-1.5 min-w-0">
        <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="City or 'Remote'..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-transparent border-0 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium"
        />
      </div>

      {/* Search Button with Interactive Loading Animation */}
      <button
        type="submit"
        disabled={isPending}
        className={`rounded-lg px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer ${
          isPending
            ? 'bg-[#1f4cd0] opacity-90 cursor-wait'
            : 'bg-[#275df5] hover:bg-[#1f4cd0] active:scale-[0.99]'
        } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#275df5]`}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            <span>Searching...</span>
          </>
        ) : (
          <>
            <Search className="h-4.5 w-4.5" />
            <span>{buttonText}</span>
          </>
        )}
      </button>
    </form>
  );
}
