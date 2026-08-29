'use client';

import { useState, useEffect, useRef } from 'react';
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
  const targetWindowRef = useRef<Window | null>(null);
  const safeUrl = applyUrl && applyUrl.trim() && applyUrl.trim() !== '#' ? applyUrl.trim() : '#';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (safeUrl === '#') {
      alert('Application link is currently not available for this posting.');
      return;
    }

    // If already counting down and clicked again, skip timer and redirect immediately
    if (countdown !== null) {
      if (targetWindowRef.current && !targetWindowRef.current.closed) {
        targetWindowRef.current.location.href = safeUrl;
      } else {
        window.open(safeUrl, '_blank', 'noopener,noreferrer');
      }
      setCountdown(null);
      return;
    }

    // Pre-open the new tab immediately in the user gesture callstack (100% immune to popup blockers)
    try {
      const newWin = window.open('', '_blank');
      if (newWin) {
        newWin.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Redirecting to ${company || 'Official Application'}...</title>
              <style>
                body {
                  margin: 0;
                  background-color: #0f172a;
                  color: #f8fafc;
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  text-align: center;
                  padding: 20px;
                }
                .card {
                  background: #1e293b;
                  border: 1px solid #334155;
                  border-radius: 20px;
                  padding: 32px 24px;
                  max-width: 420px;
                  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
                }
                .spinner {
                  width: 44px;
                  height: 44px;
                  border: 4px solid #334155;
                  border-top-color: #6366f1;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                  margin: 0 auto 20px;
                }
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
                h2 { font-size: 18px; margin: 0 0 8px; color: #fff; }
                p { font-size: 13px; color: #94a3b8; margin: 0 0 16px; line-height: 1.5; }
                .link { color: #818cf8; font-weight: bold; font-size: 13px; text-decoration: underline; cursor: pointer; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="spinner"></div>
                <h2>Taking you to Official Portal...</h2>
                <p>Redirecting to apply for <strong>${title || 'this role'}</strong> at <strong>${company || 'the company'}</strong> in 5 seconds...</p>
                <a class="link" href="${safeUrl}">Click here if not redirected automatically</a>
              </div>
            </body>
          </html>
        `);
        newWin.document.close();
        targetWindowRef.current = newWin;
      }
    } catch (err) {
      console.warn('Could not pre-open window:', err);
    }

    // Start 5-second countdown
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
      // Countdown reached 0: Redirect opened tab to actual application link
      if (targetWindowRef.current && !targetWindowRef.current.closed) {
        targetWindowRef.current.location.href = safeUrl;
      } else {
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
