import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind class names dynamically
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert date strings to friendly relative format or absolute dates
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMins = Math.floor(diffTime / (1000 * 60));
        return diffMins <= 1 ? 'Just now' : `${diffMins} mins ago`;
      }
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    
    if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    return 'Recently';
  }
}

// Convert deadline date to standard display format
export function formatDeadline(dateString: string | null): string {
  if (!dateString) return 'No Deadline';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
}
