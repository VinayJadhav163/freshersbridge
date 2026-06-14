'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  initialLocation?: string;
}

export default function SearchBar({ initialQuery = '', initialLocation = '' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.append('q', query.trim());
    if (location.trim()) params.append('location', location.trim());

    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-lg p-2 flex flex-col md:flex-row gap-2"
    >
      {/* Title/Keyword Input */}
      <div className="flex-1 flex items-center gap-2 px-3 py-1.5 min-w-0">
        <Search className="h-5 w-5 text-indigo-500 shrink-0" />
        <input
          type="text"
          placeholder="Job title, skills, or company..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/75 text-sm"
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
          className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/75 text-sm"
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 shrink-0 flex items-center justify-center gap-2"
      >
        <Search className="h-4.5 w-4.5" />
        <span>Search Jobs</span>
      </button>
    </form>
  );
}
