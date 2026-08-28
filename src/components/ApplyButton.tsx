'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

interface ApplyButtonProps {
  applyUrl: string;
  company?: string;
  title?: string;
  className?: string;
}

export default function ApplyButton({
  applyUrl,
  company,
  title,
  className,
}: ApplyButtonProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const safeUrl = applyUrl && applyUrl.trim() && applyUrl.trim() !== '#' ? applyUrl.trim() : '#';

  const handleClick = (e: React.MouseEvent) => {
    if (safeUrl === '#') {
      alert('Application link is currently not available for this posting.');
      return;
    }

    // If already counting down and clicked again, open immediately
    if (countdown !== null) {
      window.open(safeUrl, '_blank', 'noopener,noreferrer');
      setCountdown(null);
      return;
    }

    // Start 5-second countdown on the button
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Open the URL
      if (typeof window !== 'undefined' && safeUrl !== '#') {
        window.open(safeUrl, '_blank', 'noopener,noreferrer');
      }
      setCountdown(null);
    }
  }, [countdown, safeUrl]);

  const defaultClasses =
    'w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-500 hover:shadow-indigo-600/20 active:scale-[0.99] cursor-pointer';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || defaultClasses}
      title={`Apply for ${title || 'Job'} at ${company || 'Company'}`}
    >
      {countdown !== null ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin shrink-0 text-white/90" />
          <span>Redirecting in {countdown}s... (Click to skip)</span>
        </>
      ) : (
        <>
          <span>Apply Now</span>
          <ExternalLink className="h-4 w-4 shrink-0" />
        </>
      )}
    </button>
  );
}
