import React from 'react';
import { COMMUNITY_LINKS } from '@/lib/community';

export interface JobAlertsBannerProps {
  whatsappUrl?: string;
  telegramUrl?: string;
}

export default function JobAlertsBanner({
  whatsappUrl = COMMUNITY_LINKS.whatsapp,
  telegramUrl = COMMUNITY_LINKS.telegram,
}: JobAlertsBannerProps) {
  return (
    <section className="w-full py-8 sm:py-14 px-3 sm:px-6 relative overflow-hidden bg-background">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl sm:rounded-3xl border border-indigo-900/40 bg-gradient-to-b from-[#0c1430] via-[#080d22] to-[#040816] p-6 sm:p-10 md:p-12 text-center text-white shadow-2xl shadow-indigo-950/50">
        {/* Subtle ambient radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-500/15 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative space-y-3.5 sm:space-y-5">
          {/* Live Indicator Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-950/80 px-3.5 py-1 text-[11px] sm:text-xs font-semibold shadow-inner" style={{ color: '#c7d2fe' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span style={{ color: '#c7d2fe' }}>Daily Off-Campus Hiring Broadcasts</span>
          </div>

          {/* Heading - Force bright white text to override any global :where styles */}
          <h2
            className="text-2xl sm:text-4xl font-black tracking-tight leading-tight !text-white"
            style={{ color: '#ffffff' }}
          >
            Get Instant Job Alerts on Your Phone
          </h2>

          {/* Subtitle */}
          <p
            className="text-xs sm:text-base font-medium max-w-xl mx-auto leading-relaxed !text-slate-200"
            style={{ color: '#e2e8f0' }}
          >
            Join freshers getting daily off-campus drives, direct apply links &amp; remote internship updates.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto w-full">
            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl sm:rounded-full bg-[#25D366] px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-extrabold text-slate-950 shadow-lg shadow-emerald-950/40 transition-all hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-95"
            >
              <img
                src="/whatsapp.png"
                alt="WhatsApp"
                width={20}
                height={20}
                className="h-5 w-5 shrink-0 object-contain"
              />
              <span>Join WhatsApp Channel</span>
            </a>

            {/* Telegram Button */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl sm:rounded-full bg-[#229ED9] px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-extrabold text-white shadow-lg shadow-sky-950/40 transition-all hover:bg-[#1d8cc2] hover:scale-[1.02] active:scale-95"
            >
              <svg
                className="h-5 w-5 shrink-0 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              <span>Join Telegram Channel</span>
            </a>
          </div>

          {/* Micro Trust Guarantee */}
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium pt-1">
            100% Free · No spam · Instant direct-apply links only
          </p>
        </div>
      </div>
    </section>
  );
}
