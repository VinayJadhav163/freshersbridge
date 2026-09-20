import Link from 'next/link';
import { Heart } from 'lucide-react';
import NewsletterForm from '@/components/NewsletterForm';
import { COMMUNITY_LINKS } from '@/lib/community';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card text-foreground mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 xl:gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="FreshersBridge - Handpicked Off-Campus Jobs & Internships"
                width={192}
                height={48}
                loading="lazy"
                decoding="async"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Connecting freshers and recent college graduates with handpicked off-campus opportunities, internships, and entry-level jobs.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a 
                href={COMMUNITY_LINKS.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 hover:scale-110 active:scale-95 transition-all p-1.5 shadow-xs cursor-pointer"
                title="Join FreshersBridge WhatsApp Group"
                aria-label="FreshersBridge WhatsApp Community"
              >
                <img
                  src="/whatsapp.png"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </a>

              <a 
                href="https://t.me/freshersbridge" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800/60 hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer text-sky-500"
                title="Join FreshersBridge Telegram Channel"
                aria-label="FreshersBridge Telegram Channel"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
              </a>

              <a 
                href={COMMUNITY_LINKS.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 dark:bg-[#0a66c2]/20 dark:hover:bg-[#0a66c2]/30 border border-[#0a66c2]/30 dark:border-[#0a66c2]/40 hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer text-[#0a66c2] dark:text-[#38bdf8]"
                title="Follow FreshersBridge on LinkedIn"
                aria-label="FreshersBridge LinkedIn Page"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Job Seekers & Tools */}
          <div>
            <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider mb-4">Job Seekers & Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  All Job Drives
                </Link>
              </li>
              <li>
                <Link href="/internships" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Tech Internships
                </Link>
              </li>
              <li>
                <Link href="/career-tools" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  ATS Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/career-tools" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  In-Hand Salary Calculator
                </Link>
              </li>
              <li>
                <Link href="/career-tools" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  12 HR Email Scripts
                </Link>
              </li>
            </ul>
          </div>

          {/* Placement Guides */}
          <div>
            <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider mb-4">Placement Guides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guides" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  All Career Guides
                </Link>
              </li>
              <li>
                <Link href="/guides/tcs-nqt-2026-complete-syllabus-exam-pattern-preparation-guide" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  TCS NQT Syllabus Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/accenture-recruitment-process-syllabus-coding-questions-freshers" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Accenture ASE Pattern
                </Link>
              </li>
              <li>
                <Link href="/guides/top-50-java-interview-questions-answers-freshers-2026" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Top 50 Java Questions
                </Link>
              </li>
              <li>
                <Link href="/guides/ats-friendly-resume-guide-tech-freshers-with-examples" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  ATS Resume Blueprint
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider mb-4">Info</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Terms of service
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: NEWSLETTER Listmonk Widget */}
          <div>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom copyright banner */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {currentYear} FreshersBridge.in. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500" />
            <span>for graduates in India.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
