import React from 'react';
import { InfinityLoop } from '@/components/ui/infinity';
import { cn } from '@/lib/utils';

export interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Classic single ring spinner loader component
 */
export function ClassicLoader({ className = '', size = 'md' }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-5 w-8',
    md: 'h-8 w-14',
    lg: 'h-12 w-20',
  }[size];

  return <InfinityLoop className={cn(sizeClasses, 'text-indigo-600 dark:text-indigo-400', className)} />;
}

/**
 * Concentric dual-ring spinner loader component (Powered by InfinityLoop)
 */
export function ConcentricLoader({ className = '', size = 'md' }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-6 w-10',
    md: 'h-10 w-16',
    lg: 'h-14 w-24',
  }[size];

  return (
    <div className={cn("flex w-full items-center justify-center", className)} role="status">
      <InfinityLoop className={cn(sizeClasses, "text-indigo-600 dark:text-indigo-400")} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Full page or full container loader with brand electric indigo Infinity Loop (No logo inside)
 */
export function PageLoader({ text = 'Loading FreshersBridge...' }: { text?: string }) {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4 p-8">
      <div className="flex items-center justify-center p-2">
        <InfinityLoop className="h-12 w-20 text-indigo-600 dark:text-indigo-400 drop-shadow-sm" />
      </div>
      {text && (
        <p className="text-xs font-bold text-muted-foreground/80 animate-pulse tracking-wider uppercase font-sans">
          {text}
        </p>
      )}
    </div>
  );
}

export default PageLoader;
