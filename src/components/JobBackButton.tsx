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

  // If this job belongs to a registered company profile, default to that company's jobs page
  const initialHref = companySlug ? `/companies/${companySlug}` : defaultHref;
  const initialLabel = companySlug
    ? `Back to ${companyName || 'Company'} Jobs`
    : defaultLabel;

  const [backTarget, setBackTarget] = useState<{
    href: string;
    label: string;
    isHistoryBack?: boolean;
  }>({
    href: initialHref,
    label: initialLabel,
    isHistoryBack: false,
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;

      // 1. Check URL query params: e.g. /jobs/xyz?from=/companies/tcs
      const urlParams = new URLSearchParams(window.location.search);
      const fromParam = urlParams.get('from');
      if (fromParam && fromParam.startsWith('/companies')) {
        const isSpecific = fromParam.split('/').filter(Boolean).length >= 2;
        const label = isSpecific && companyName
          ? `Back to ${companyName}`
          : 'Back to Company';
        setBackTarget({
          href: fromParam,
          label,
          isHistoryBack: true,
        });
        return;
      }

      // 2. Check session storage for recently browsed company page
      const stored = sessionStorage.getItem('last_company_page');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.href && parsed.href.startsWith('/companies')) {
            // Match if user previously visited this specific company or came from any company page
            if (!companySlug || parsed.href.includes(companySlug) || parsed.name === companyName) {
              setBackTarget({
                href: parsed.href,
                label: `Back to ${parsed.name || companyName || 'Company'}`,
                isHistoryBack: true,
              });
              return;
            }
          }
        } catch {
          // Ignore parsing error
        }
      }

      // 3. Fallback to document.referrer if available
      const referrer = document.referrer;
      if (referrer && referrer.startsWith(window.location.origin)) {
        const referrerUrl = new URL(referrer);
        const path = referrerUrl.pathname;

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
          return;
        }
      }

      // 4. If this job belongs to a registered company (e.g. TCS, Infosys, etc.)
      if (companySlug) {
        setBackTarget({
          href: `/companies/${companySlug}`,
          label: `Back to ${companyName || 'Company'} Jobs`,
          isHistoryBack: window.history.length > 1,
        });
      }
    } catch {
      // Fallback
    }
  }, [defaultHref, defaultLabel, companyName, companySlug]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (backTarget.isHistoryBack && typeof window !== 'undefined' && window.history.length > 1) {
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
