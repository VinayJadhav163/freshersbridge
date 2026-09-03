import { Metadata } from 'next';
import Link from 'next/link';
import { GUIDE_ARTICLES } from '@/lib/guidesData';
import { 
  BookOpen, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Code, 
  CheckCircle2, 
  Briefcase 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'IT Fresher Career Guides, Syllabus & Interview Prep | FreshersBridge',
  description:
    'Comprehensive preparation guides for TCS NQT, Accenture, Cognizant, Core Java, Python, SQL, and ATS resume strategies for 2026 batch freshers and graduates.',
  openGraph: {
    title: 'IT Fresher Career Guides & Interview Prep | FreshersBridge',
    description:
      'Master off-campus IT drives, syllabus breakdowns, interview questions, and placement roadmaps for freshers.',
    url: 'https://freshersbridge.in/guides',
  },
};

export default function GuidesPage() {
  const categories = [
    'All Guides',
    'Company Patterns',
    'Technical Prep',
    'Career Roadmaps',
    'HR & Soft Skills',
  ];

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Hero Section with Minimal Modern Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-indigo-50/25 to-white dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 border-b border-slate-200/70 dark:border-slate-800 px-6 pt-12 pb-14 sm:pt-16 sm:pb-18 text-center sm:px-8 lg:px-12">
        {/* Minimal soft ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-[radial-gradient(ellipse_at_center,rgba(39,93,245,0.09),transparent_70%)] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 dark:border-blue-900/50 bg-white/90 dark:bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>100% Free Placement & Technical Guides</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Off-Campus Drive Syllabus <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#275df5] via-[#4338ca] to-[#2563eb] bg-clip-text text-transparent">
              & Tech Interview Masterclasses
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            In-depth exam blueprints, coding patterns, and placement strategies curated by industry tech leads to help college freshers crack top IT roles.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1.5 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Company Exam Blueprints (TCS, Accenture, CTS)
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1.5 shadow-2xs">
              <Code className="h-4 w-4 text-[#275df5]" />
              Java, Python & SQL Interview Questions
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1.5 shadow-2xs">
              <GraduationCap className="h-4 w-4 text-[#4338ca]" />
              ATS Resume & Placement Blueprints
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Guides Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 w-full space-y-8">
        
        {/* Featured Top Guide Banner */}
        {GUIDE_ARTICLES[0] && (
          <div className="relative overflow-hidden rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/60 via-card to-card p-6 sm:p-8 shadow-sm">
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-bold text-white shadow-xs">
                  <Sparkles className="h-3 w-3" />
                  Featured Masterclass
                </span>
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {GUIDE_ARTICLES[0].readTime}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight">
                <Link href={`/guides/${GUIDE_ARTICLES[0].slug}`} prefetch={true} className="hover:text-indigo-600 transition-colors">
                  {GUIDE_ARTICLES[0].title}
                </Link>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {GUIDE_ARTICLES[0].subtitle}
              </p>

              <div className="flex items-center gap-2 flex-wrap pt-1">
                {GUIDE_ARTICLES[0].tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground border border-border">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href={`/guides/${GUIDE_ARTICLES[0].slug}`}
                  prefetch={true}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 text-center cursor-pointer"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* All Articles Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              All Placement & Career Guides ({GUIDE_ARTICLES.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDE_ARTICLES.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                prefetch={true}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-0.5 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60 font-bold">
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {guide.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                    {guide.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {guide.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>{guide.author.name}</span>
                  <span className="text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                    Read Guide →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
