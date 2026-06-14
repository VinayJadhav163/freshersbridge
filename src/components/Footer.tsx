import Link from 'next/link';
import { Briefcase, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card text-foreground mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                <Briefcase className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Freshers<span className="text-indigo-600">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Connecting BCA, MCA, BSc Computer Science, BE/BTech graduates and recent college passouts with off-campus opportunities, internships, and entry-level jobs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  All Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?eligibility=MCA" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  MCA Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?eligibility=BCA" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  BCA Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?eligibility=BTech" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  BE / BTech Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* About / Portal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  Post a Job (Admin)
                </Link>
              </li>
              <li>
                <Link href="/jobs?featured=true" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  Featured Openings
                </Link>
              </li>
              <li>
                <a 
                  href="https://supabase.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-muted-foreground hover:text-indigo-600 transition-colors"
                >
                  Powered by Supabase
                </a>
              </li>
            </ul>
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
