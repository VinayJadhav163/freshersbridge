'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

interface TableOfContentsProps {
  items: { id: string; title: string }[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  if (!items || items.length === 0) return null;

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Smooth scroll to the element
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Replace URL state without adding a new entry to the browser back-button history stack
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/30 p-6 space-y-3">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span>Table of Contents</span>
      </h3>
      <ul className="space-y-2 text-xs sm:text-sm font-medium text-muted-foreground">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleScrollTo(e, item.id)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 group cursor-pointer"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform shrink-0" />
              <span className="group-hover:underline underline-offset-2">{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
