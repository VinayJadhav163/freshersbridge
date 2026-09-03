import Link from 'next/link';
import { Heart } from 'lucide-react';
import NewsletterForm from '@/components/NewsletterForm';

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
                alt="FreshersBridge Logo"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Connecting freshers and recent college graduates with handpicked off-campus opportunities, internships, and entry-level jobs.
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <a 
                href="https://chat.whatsapp.com/JmP90QfUMs7Jj7gYALUj75?s=cl&p=a&ilr=1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 text-xs sm:text-[13px] font-bold hover:underline transition-all inline-flex items-center gap-2 group cursor-pointer whitespace-nowrap"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 group-hover:scale-110 transition-transform overflow-hidden p-0.5">
                  <img src="/whatsapp.png" alt="WhatsApp" className="h-full w-full object-contain" />
                </div>
                <span>Join WhatsApp Group →</span>
              </a>

              <a 
                href="https://t.me/freshersbridge" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sky-600 dark:text-sky-400 hover:text-sky-500 text-xs sm:text-[13px] font-bold hover:underline transition-all inline-flex items-center gap-2 group cursor-pointer whitespace-nowrap"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 group-hover:scale-110 transition-transform">
                  <svg className="h-3.5 w-3.5 shrink-0 fill-current text-sky-500" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                </div>
                <span>Join Telegram Channel →</span>
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
                  ATS Resume Scanner
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
