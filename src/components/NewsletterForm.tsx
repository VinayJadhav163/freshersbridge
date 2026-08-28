'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

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
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Newsletter submit error:', err);
      setIsSubmitting(false);
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="space-y-3.5 w-full">
      {/* Heading */}
      <div className="w-fit">
        <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
          NEWSLETTER
        </h3>
        <div className="mt-1.5 h-0.5 w-full bg-indigo-600 rounded-full" />
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
        Get the latest off-campus drives & internships delivered to your inbox every day.
      </p>

      {submitted ? (
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/70 dark:bg-indigo-950/40 p-3.5 text-center space-y-1.5 animate-in fade-in duration-300">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 mx-auto text-indigo-600 dark:text-indigo-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <p className="text-xs font-bold text-foreground">Subscribed Successfully!</p>
          <p className="text-[11px] text-muted-foreground">Check your inbox for job updates.</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setEmail('');
            }}
            className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-0.5 cursor-pointer"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 p-2 rounded-lg border border-rose-200 dark:border-rose-800">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2">
            <input
              type="email"
              required
              placeholder="your@email.com"
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

          <div className="text-xs text-muted-foreground/80 font-medium flex items-center gap-1 pt-0.5">
            <span>🔒</span>
            <span>No spam. Unsubscribe anytime.</span>
          </div>
        </form>
      )}
    </div>
  );
}
