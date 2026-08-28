'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PageNavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start smooth progress
  const startLoading = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setVisible(true);
    setProgress(25);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 85;
        }
        return prev + 12;
      });
    }, 150);
  };

  // Complete and hide progress
  const finishLoading = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);
    const timer = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(timer);
  };

  // When pathname or searchParams change, finish the loading bar
  useEffect(() => {
    finishLoading();
  }, [pathname, searchParams]);

  // Global click interceptor to start loading in 0ms on any internal navigation
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Ignore external, hash links, mailto, tel, or modifier keys (Ctrl/Cmd click)
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        targetAttr === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it's an internal link
      try {
        const url = new URL(href, window.location.href);
        if (url.origin === window.location.origin) {
          // If navigating to a different pathname or search query
          const currentFullUrl = window.location.pathname + window.location.search;
          const targetFullUrl = url.pathname + url.search;

          if (currentFullUrl !== targetFullUrl) {
            startLoading();
          }
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!visible && progress === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] h-1 w-full overflow-hidden bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-[#275df5] to-cyan-400 shadow-[0_0_12px_rgba(39,93,245,0.8)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
