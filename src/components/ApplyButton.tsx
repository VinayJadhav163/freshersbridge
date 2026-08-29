'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, CheckCircle2, ArrowRight, X, Clock } from 'lucide-react';

interface ApplyButtonProps {
  applyUrl: string;
  company?: string;
  title?: string;
  className?: string;
}

export default function ApplyButton({
  applyUrl,
  company = 'the Company',
  title = 'this Opportunity',
  className,
}: ApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const safeUrl = applyUrl && applyUrl.trim() && applyUrl.trim() !== '#' ? applyUrl.trim() : '#';

  const handleOpenModal = () => {
    if (safeUrl === '#') {
      alert('Application link is currently not available for this posting.');
      return;
    }
    setCountdown(5);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Try opening in new window or redirect
      try {
        window.open(safeUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.warn('Auto window.open was blocked, user can click the button.');
      }
    }
  }, [isOpen, countdown, safeUrl]);

  const defaultClasses =
    'w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-500 hover:shadow-indigo-600/25 active:scale-[0.99] cursor-pointer';

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
        className={className || defaultClasses}
        title={`Apply for ${title} at ${company}`}
      >
        <span>Apply Now</span>
        <ExternalLink className="h-4 w-4 shrink-0" />
      </button>

      {/* 5-Second Countdown Pop-Up Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 z-10 mx-auto my-auto text-center">
            {/* Close 'X' button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Cancel"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Pulsing Animated Circular Timer */}
            <div className="mx-auto flex flex-col items-center justify-center pt-2">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/80 border-4 border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                <span className="text-3xl font-black tabular-nums animate-pulse">
                  {countdown > 0 ? countdown : '✓'}
                </span>
              </div>
              <p className="mt-2.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {countdown > 0 ? `Redirecting in ${countdown} seconds...` : 'Link Ready! Opening application...'}
              </p>
            </div>

            {/* Target Job Title & Company */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-1">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground">
                Taking you to the official career portal for <span className="font-semibold text-foreground">{company}</span>
              </p>
            </div>

            {/* Visual Animated Progress Bar */}
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>

            {/* Application Prep Tips Card */}
            <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Quick Application Checklist</span>
              </div>
              <ul className="text-[11px] text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Resume updated in clean PDF format</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Matching skills highlighted according to job requirements</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>{countdown > 0 ? 'Proceed to Apply Now' : '🚀 Open Application Portal'}</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1 block w-full"
              >
                Cancel & stay on FreshersBridge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
