'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X, ShieldCheck } from 'lucide-react';

const CONSENT_KEY = 'freshersbridge_cookie_consent';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (!savedConsent) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(CONSENT_KEY, 'all');
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(CONSENT_KEY, 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-lg rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-6 duration-400"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 shadow-xs">
          <Cookie className="h-5 w-5" />
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              <span>Cookie & Privacy Choices</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </h3>
            <button
              onClick={handleEssentialOnly}
              aria-label="Dismiss cookie notice"
              className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            We use cookies to personalize job recommendations, remember your search preferences, and analyze portal traffic in accordance with our{' '}
            <Link
              href="/privacy-policy"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Privacy Policy
            </Link>.
          </p>

          <div className="pt-1.5 flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={handleAcceptAll}
              className="w-full sm:w-auto flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-center select-none"
            >
              Accept All
            </button>
            <button
              onClick={handleEssentialOnly}
              className="w-full sm:w-auto rounded-xl border border-border bg-secondary/80 hover:bg-secondary px-3.5 py-2 text-xs font-bold text-foreground transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-center select-none"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
