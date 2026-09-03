import { Metadata } from 'next';
import Link from 'next/link';
import { COMPANIES_DATA } from '@/lib/companiesData';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  GraduationCap, 
  ArrowRight, 
  Briefcase,
  Sparkles,
  Search
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Top Companies Hiring Freshers 2026 | Off-Campus Drives & Eligibility | FreshersBridge',
  description:
    'Explore entry-level hiring drives, salaries, eligibility, and recruitment patterns for top IT and product companies including TCS, Infosys, Accenture, Wipro, and Cognizant.',
  alternates: {
    canonical: 'https://freshersbridge.in/companies',
  },
  openGraph: {
    title: 'Top Companies Hiring Freshers 2026 | FreshersBridge',
    description:
      'Find entry-level tech jobs, packages, and hiring blueprints for top recruiters in India.',
    url: 'https://freshersbridge.in/companies',
    type: 'website',
  },
};

export default function CompaniesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-10">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 dark:border-blue-900/50 bg-white/90 dark:bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs backdrop-blur-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>MNC Off-Campus Hiring Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
          Top Companies Hiring{' '}
          <span className="bg-gradient-to-r from-[#275df5] via-[#4338ca] to-[#2563eb] bg-clip-text text-transparent">
            Freshers & Graduates 2026
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Comprehensive hiring guides, packages, eligibility, and active off-campus job drives for India&apos;s leading tech employers.
        </p>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMPANIES_DATA.map((company) => (
          <div
            key={company.slug}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all space-y-5"
          >
            <div className="space-y-4">
              {/* Header Badge with Original Logo */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {company.logo ? (
                    <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 dark:border-slate-800 p-1.5 shadow-2xs flex items-center justify-center shrink-0">
                      <img
                        src={company.logo}
                        alt={`${company.name} Logo`}
                        className="h-full w-full object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-black text-lg shrink-0">
                      {company.shortName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground group-hover:text-[#275df5] transition-colors">
                      {company.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">{company.category}</p>
                  </div>
                </div>
              </div>

              {/* Stats & Quick Badges */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/60 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px] font-medium">Salary Range</span>
                  <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                    <IndianRupee className="h-3.5 w-3.5 text-[#275df5]" />
                    {company.salaryRange.split('-')[0].trim()} - {company.salaryRange.split('-')[1]?.trim() || ''}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px] font-medium">HQ Location</span>
                  <span className="font-medium text-foreground flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="h-3.5 w-3.5 text-[#275df5] shrink-0" />
                    {company.headquarters.split(',')[0]}
                  </span>
                </div>
              </div>

              {/* Key Hiring Tracks */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Fresher Hiring Tracks
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {company.hiringTracks.map((track, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {track.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <Link
                href={`/companies/${company.slug}`}
                prefetch={true}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#275df5] text-white font-bold text-xs hover:bg-[#1f4cd0] transition-all shadow-xs group-hover:gap-2"
              >
                <span>View {company.shortName} Jobs & Syllabus</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
