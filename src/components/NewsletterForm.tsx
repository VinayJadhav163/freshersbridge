'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Lock } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider mb-1">
          Daily Job Alerts
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
          Get verified fresher job updates and off-campus drives directly in your inbox.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400 space-y-1 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold">You&apos;re subscribed!</span>
          </div>
          <p className="text-[11px] text-emerald-600/90 dark:text-emerald-400/90 font-normal pl-6">
            Check your inbox for fresh daily opportunities.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {errorMsg && (
            <div className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/30 p-2 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer select-none"
            >
              {isSubmitting ? (
                <span>Subscribing...</span>
              ) : (
                <span>Subscribe Free →</span>
              )}
            </button>
          </div>

          <div className="text-xs text-muted-foreground/80 font-medium flex items-center gap-1.5 pt-0.5">
            <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
            <span>No spam. Unsubscribe anytime.</span>
          </div>
        </form>
      )}
    </div>
  );
}
