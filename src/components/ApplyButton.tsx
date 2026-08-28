'use client';

import { useState } from 'react';
import { ExternalLink, Check } from 'lucide-react';

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
  const [clicked, setClicked] = useState(false);
  const safeUrl = applyUrl && applyUrl.trim() && applyUrl.trim() !== '#' ? applyUrl.trim() : '#';

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 3000);
  };

  const defaultClasses =
    'w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-500 hover:shadow-indigo-600/20 active:scale-[0.99] cursor-pointer';

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className || defaultClasses}
      title={`Apply for ${title || 'Job'} at ${company || 'Company'}`}
    >
      {clicked ? (
        <>
          <Check className="h-4 w-4 shrink-0 text-emerald-300" />
          <span>Opening Application...</span>
        </>
      ) : (
        <>
          <span>Apply Now</span>
          <ExternalLink className="h-4 w-4 shrink-0" />
        </>
      )}
    </a>
  );
}
