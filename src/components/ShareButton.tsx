'use client';

import { useState } from 'react';
import { Share2, Check, Copy, X } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  company?: string;
  slug: string;
  type?: 'job' | 'guide';
  label?: string;
  className?: string;
}

export default function ShareButton({
  title,
  company = 'FreshersBridge',
  slug,
  type = 'job',
  label,
  className,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = slug.startsWith('http')
    ? slug
    : `https://freshersbridge.in/${slug.startsWith('guides/') || slug.startsWith('jobs/') ? slug : type === 'guide' ? `guides/${slug}` : `jobs/${slug}`}`;

  const shareText =
    type === 'guide'
      ? `Check out this complete placement guide: "${title}" on FreshersBridge.in!\n\nRead here:`
      : `Check out this job opportunity: ${title} at ${company} on FreshersBridge.in!\n\nApply here:`;

  const fullSharePayload = `${shareText} ${shareUrl}`;
  const buttonLabel = label || (type === 'guide' ? 'Share Guide' : 'Share Job Drive');

  const copyToClipboard = () => {
    let success = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        navigator.clipboard.writeText(shareUrl);
        success = true;
      } catch {}
    }

    if (!success && typeof document !== 'undefined') {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        success = true;
      } catch {}
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      color: 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/20',
      icon: (
        <img src="/whatsapp.png" alt="WhatsApp" className="h-5 w-5 object-contain" />
      ),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(fullSharePayload)}`,
    },
    {
      name: 'Telegram',
      color: 'bg-[#0088cc]/10 text-[#0088cc] border-[#0088cc]/30 hover:bg-[#0088cc]/20',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'LinkedIn',
      color: 'bg-[#0077b5]/10 text-[#0077b5] border-[#0077b5]/30 hover:bg-[#0077b5]/20',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'X (Twitter)',
      color: 'bg-black/10 dark:bg-white/10 text-foreground border-border hover:bg-secondary',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  const defaultClasses =
    'w-full inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-50/70 dark:bg-indigo-950/20 px-4 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 shadow-xs transition-all hover:bg-indigo-100/70 dark:hover:bg-indigo-900/30 active:scale-[0.99] cursor-pointer';

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className || defaultClasses}
        title={type === 'guide' ? 'Share this placement guide' : 'Share job opportunity'}
        aria-label={buttonLabel}
      >
        <Share2 className="h-4 w-4 shrink-0" />
        <span>{buttonLabel}</span>
      </button>

      {/* Share Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 z-10 mx-auto my-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 shrink-0">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground leading-tight">
                    Share this Opportunity
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Help your friends and batchmates apply
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Social Share Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {shareOptions.map((opt) => (
                <a
                  key={opt.name}
                  href={opt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-3.5 text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${opt.color}`}
                >
                  {opt.icon}
                  <span>{opt.name}</span>
                </a>
              ))}
            </div>

            {/* Copy Link Input Section */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Or copy page link
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-1.5 pr-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full bg-transparent px-2 text-xs text-foreground font-mono truncate focus:outline-none"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
