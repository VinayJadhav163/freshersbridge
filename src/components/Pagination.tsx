import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  from: number;
  to: number;
  itemLabel?: string;
  baseUrl: (pageNum: number) => string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  from,
  to,
  itemLabel = 'jobs',
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate smart windowed page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80 pt-6 mt-8">
      {/* Item Counter */}
      <div className="text-xs sm:text-sm text-muted-foreground font-medium">
        Showing <span className="font-bold text-foreground">{from + 1}</span> to{' '}
        <span className="font-bold text-foreground">{Math.min(to + 1, totalCount)}</span> of{' '}
        <span className="font-bold text-foreground">{totalCount}</span> {itemLabel}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={baseUrl(currentPage - 1)}
            prefetch={true}
            className="inline-flex h-9 items-center gap-1 rounded-xl border border-border bg-card px-3 text-xs font-bold text-foreground transition-all hover:bg-secondary hover:border-border/80 shadow-2xs"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden xs:inline">Prev</span>
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex h-9 items-center gap-1 rounded-xl border border-border/40 bg-secondary/40 px-3 text-xs font-bold text-muted-foreground/50 cursor-not-allowed"
            aria-label="Previous page disabled"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden xs:inline">Prev</span>
          </button>
        )}

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-9 w-8 items-center justify-center text-xs font-bold text-muted-foreground"
                >
                  •••
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <Link
                key={pageNum}
                href={baseUrl(pageNum)}
                prefetch={true}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all shadow-2xs ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-extrabold scale-105'
                    : 'border border-border bg-card text-foreground hover:bg-secondary hover:border-indigo-500/30'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={baseUrl(currentPage + 1)}
            prefetch={true}
            className="inline-flex h-9 items-center gap-1 rounded-xl border border-border bg-card px-3 text-xs font-bold text-foreground transition-all hover:bg-secondary hover:border-border/80 shadow-2xs"
            aria-label="Next page"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex h-9 items-center gap-1 rounded-xl border border-border/40 bg-secondary/40 px-3 text-xs font-bold text-muted-foreground/50 cursor-not-allowed"
            aria-label="Next page disabled"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
