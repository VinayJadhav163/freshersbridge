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
      className="w-full max-w-full overflow-hidden rounded-xl border border-border bg-card shadow-md p-2 flex flex-col md:flex-row gap-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50"
    >
      {/* Title/Keyword Input */}
      <div className="flex-1 flex items-center gap-2 px-3 py-1.5 min-w-0">
        <Search className="h-5 w-5 text-indigo-500 shrink-0" />
        <input
          ref={queryInputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/75 text-sm font-medium"
        />
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block w-px bg-border my-2" />

      {/* Location Input */}
      <div className="flex-1 flex items-center gap-2 px-3 py-1.5 min-w-0">
        <MapPin className="h-5 w-5 text-indigo-500 shrink-0" />
        <input
          type="text"
          placeholder="City or 'Remote'..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/75 text-sm font-medium"
        />
      </div>

      {/* Search Button with Interactive Loading Animation */}
      <button
        type="submit"
        disabled={isPending}
        className={`rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 shrink-0 flex items-center justify-center gap-2 cursor-pointer ${
          isPending
            ? 'bg-indigo-700 opacity-90 cursor-wait'
            : 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98]'
        } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
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
