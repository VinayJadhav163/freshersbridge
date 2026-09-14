import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageSkeleton } from '@/components/skeletons/PageSkeleton';

export interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Modern minimal inline spinner for buttons and interactive controls
 */
export function ClassicLoader({ className = '', size = 'md' }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }[size];

  return (
    <Loader2
      className={cn('animate-spin text-indigo-600 dark:text-indigo-400', sizeClasses, className)}
    />
  );
}

/**
 * Concentric spinner loader alias
 */
export function ConcentricLoader(props: LoaderProps) {
  return <ClassicLoader {...props} />;
}

/**
 * Modern PageLoader fallback rendering polished Skeleton screens
 */
export function PageLoader() {
  return <PageSkeleton />;
}

export default PageLoader;
