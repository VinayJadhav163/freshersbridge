'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle2, Check, ArrowRight, X, Clock } from 'lucide-react';

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
  const [hasApplied, setHasApplied] = useState(false);

  const safeUrl = applyUrl && applyUrl.trim() && applyUrl.trim() !== '#' ? applyUrl.trim() : '#';

  const handleOpenModal = () => {
    if (safeUrl === '#') {
      alert('Application link is currently not available for this posting.');
      return;
    }
    // If the countdown already finished previously, open the application portal directly!
    if (hasApplied) {
      if (typeof window !== 'undefined') {
        window.open(safeUrl, '_blank', 'noopener,noreferrer');
      }
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
      setHasApplied(true);
      // Attempt safe pop-up / window open once countdown finishes without blocking the user
      if (typeof window !== 'undefined' && safeUrl !== '#') {
        try {
          window.open(safeUrl, '_blank', 'noopener,noreferrer');
        } catch (e) {
          console.warn('Popup blocked or direct tab open fallback:', e);
        }
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
        <span>{hasApplied ? 'Open Application Link' : 'Apply Now'}</span>
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
              <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug break-words">
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
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 p-4 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span>Application Checklist</span>
                </div>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  Direct Portal
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span className="leading-snug">
                    Keep your <strong className="font-semibold text-slate-800 dark:text-slate-100">updated PDF resume</strong> ready to upload.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span className="leading-snug">
                    Verify graduation batch (<strong className="font-semibold text-slate-800 dark:text-slate-100">2024 / 2025 / 2026</strong>) matches criteria.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span className="leading-snug">
                    Applying directly on the <strong className="font-semibold text-slate-800 dark:text-slate-100">official career portal</strong> &bull; 100% free.
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {countdown > 0 ? (
                <button
                  type="button"
                  disabled
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-sm font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-not-allowed select-none opacity-80"
                >
                  <Clock className="h-4 w-4 animate-spin text-indigo-500 shrink-0" />
                  <span>Unlocking Application Link in {countdown}s...</span>
                </button>
              ) : (
                <a
                  href={safeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setHasApplied(true);
                    setIsOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-5 text-sm font-bold text-white shadow-md transition-all active:scale-[0.99] cursor-pointer bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-400/50"
                >
                  <span className="tracking-wide">Open Application Portal</span>
                  <span className="text-emerald-100/90 font-medium text-xs tracking-normal ml-0.5">(Click to Apply)</span>
                  <ArrowRight className="h-4 w-4 ml-1 shrink-0" />
                </a>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1 block w-full"
              >
                Cancel &amp; stay on FreshersBridge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
