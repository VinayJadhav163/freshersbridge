import React from 'react';
import { Smartphone } from 'lucide-react';

export interface JobAlertsBannerProps {
  whatsappUrl?: string;
  telegramUrl?: string;
}

export default function JobAlertsBanner({
  whatsappUrl = 'https://chat.whatsapp.com/JmP90QfUMs7Jj7gYALUj75?s=cl&p=a&ilr=1',
  telegramUrl = 'https://t.me/freshersbridge',
}: JobAlertsBannerProps) {
  return (
    <section className="w-full bg-[#0b132b] text-white py-12 sm:py-16 border-t border-slate-800/80 relative overflow-hidden">
      {/* Glow Effect Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-4 sm:space-y-6">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-3 drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]">
          <Smartphone className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-indigo-400 shrink-0 inline-block" />
          <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            Get Instant Job Alerts
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-indigo-100/90 font-medium max-w-2xl mx-auto leading-relaxed">
          Join freshers getting daily off-campus drives, internships &amp; Remote jobs
        </p>

        {/* Action Buttons */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-3.5 text-base font-extrabold text-[#061812] shadow-lg shadow-emerald-950/30 transition-all hover:bg-[#20bd5a] hover:scale-105 active:scale-95"
          >
            <img
              src="/whatsapp.png"
              alt="WhatsApp"
              className="h-6 w-6 shrink-0 object-contain"
            />
            <span>Join WhatsApp</span>
          </a>

          {/* Telegram Button */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full border border-indigo-500/40 bg-[#162038] px-8 py-3.5 text-base font-extrabold text-slate-100 shadow-md transition-all hover:bg-[#1d2b4b] hover:border-indigo-400 hover:scale-105 active:scale-95"
          >
            <svg
              className="h-6 w-6 shrink-0 fill-current text-indigo-400"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
            <span>Join Telegram</span>
          </a>
        </div>
      </div>
    </section>
  );
}
