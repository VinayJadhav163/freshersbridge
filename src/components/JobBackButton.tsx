'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface JobBackButtonProps {
  defaultHref: string;
  defaultLabel: string;
  companyName?: string;
  companySlug?: string;
}

export default function JobBackButton({
  defaultHref,
  defaultLabel,
  companyName,
  companySlug,
}: JobBackButtonProps) {
  const router = useRouter();
  const [backTarget, setBackTarget] = useState<{
    href: string;
    label: string;
    isHistoryBack?: boolean;
  }>({
    href: defaultHref,
    label: defaultLabel,
    isHistoryBack: false,
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;

      const referrer = document.referrer;
      if (referrer && referrer.startsWith(window.location.origin)) {
        const referrerUrl = new URL(referrer);
        const path = referrerUrl.pathname;

        // If the user arrived from a company page (e.g. /companies/infosys or /companies)
        if (path.startsWith('/companies')) {
          const pathSegments = path.split('/').filter(Boolean);
          const isSpecificCompany = pathSegments.length >= 2;
          const label = isSpecificCompany && companyName
            ? `Back to ${companyName}`
            : 'Back to Company';

          setBackTarget({
            href: path + referrerUrl.search,
            label,
            isHistoryBack: true,
          });
        }
      }
    } catch {
      // Fallback to defaultHref
    }
  }, [defaultHref, defaultLabel, companyName]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (backTarget.isHistoryBack && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      href={backTarget.href}
      onClick={handleClick}
      prefetch={true}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer group"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      <span>{backTarget.label}</span>
    </Link>
  );
}
