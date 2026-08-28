'use client';

import { ExternalLink } from 'lucide-react';

interface ApplyButtonProps {
  applyUrl: string;
  company?: string;
  title?: string;
}

export default function ApplyButton({ applyUrl, company, title }: ApplyButtonProps) {
  const safeUrl = applyUrl && applyUrl.trim() ? applyUrl.trim() : '#';

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-500 hover:shadow-indigo-600/20 active:scale-[0.99] cursor-pointer"
      title={`Apply for ${title || 'Job'} at ${company || 'Company'}`}
    >
      <span>Apply Now</span>
      <ExternalLink className="h-4 w-4 shrink-0" />
    </a>
  );
}
