import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import { 
  ArrowRight, 
  Code, 
  Database, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  BarChart4, 
  Briefcase, 
  Rocket,
  GraduationCap,
  Calendar,
  Check
} from 'lucide-react';
import { Job, Category } from '@/types';

// Fast dynamic server-side rendering so each visitor gets fresh rotated listings
export const dynamic = 'force-dynamic';

// Assign dynamic icons based on category slug
function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'software-development':
    case 'software-engineering':
      return <Code className="h-6 w-6 text-[#275df5]" />;
    case 'web-development':
    case 'frontend-backend':
      return <Layers className="h-6 w-6 text-[#275df5]" />;
    case 'data-science-analytics':
    case 'data-analytics':
      return <BarChart4 className="h-6 w-6 text-[#275df5]" />;
    case 'database-administration':
      return <Database className="h-6 w-6 text-[#275df5]" />;
    case 'devops-cloud':
      return <Cpu className="h-6 w-6 text-[#275df5]" />;
    case 'qa-testing':
      return <ShieldCheck className="h-6 w-6 text-[#275df5]" />;
    default:
      return <Code className="h-6 w-6 text-[#275df5]" />;
  }
}

// Strictly ordered category sequence:
// 1. Software Development, 2. Web Development, 3. Data Science & Analytics,
// 4. QA & Testing, 5. DevOps & Cloud, 6. Database Administration
function getCategorySortOrder(cat: Category): number {
  const slug = (cat.slug || '').toLowerCase();
  const name = (cat.name || '').toLowerCase();

  if (slug.includes('software') || name.includes('software')) return 1;
  if (slug.includes('web') || name.includes('web') || slug.includes('frontend') || name.includes('frontend')) return 2;
  if (slug.includes('data') || name.includes('data') || slug.includes('analytics') || name.includes('analytics')) return 3;
  if (slug.includes('qa') || slug.includes('test') || name.includes('qa') || name.includes('test')) return 4;
  if (slug.includes('devops') || slug.includes('cloud') || name.includes('devops') || name.includes('cloud')) return 5;
  if (slug.includes('database') || slug.includes('dba') || name.includes('database') || name.includes('admin')) return 6;
  return 99;
}

import { fetchWithCache } from '@/lib/dataCache';

export default async function Home() {
  // Parallel fetch cached categories & pools of jobs/internships
  const [categories, allJobsPool, allInternshipsPool] = await Promise.all([
    fetchWithCache<Category[]>('home:categories', async () => {
      const { data } = await supabase.from('categories').select('*');
      return (data || []) as Category[];
    }, 180),
    fetchWithCache<Job[]>('home:jobsPool', async () => {
      const { data } = await supabase
        .from('jobs')
        .select('id, title, slug, company, location, salary, eligibility, skills, created_at, category_id, featured_job, categories(id, name, slug)')
        .not('title', 'ilike', '%intern%')
        .not('title', 'ilike', '%internship%')
        .not('title', 'ilike', '%apprentice%')
        .not('title', 'ilike', '%fellowship%')
        .order('created_at', { ascending: false })
        .limit(30);
      return (data || []) as unknown as Job[];
    }, 60),
    fetchWithCache<Job[]>('home:internshipsPool', async () => {
      const { data } = await supabase
        .from('jobs')
        .select('id, title, slug, company, location, salary, eligibility, skills, created_at, category_id, featured_job, categories(id, name, slug)')
        .or('title.ilike.%intern%,title.ilike.%internship%,title.ilike.%apprentice%,title.ilike.%fellowship%')
        .order('created_at', { ascending: false })
        .limit(20);
      return (data || []) as unknown as Job[];
    }, 60),
  ]);

  // Deterministic latest listings (featured first, then most recent)
  const featuredJobs = allJobsPool.filter((j) => j.featured_job);
  const regularJobs = allJobsPool.filter((j) => !j.featured_job);
  const displayJobs = [
    ...featuredJobs.slice(0, 2),
    ...regularJobs,
  ].slice(0, 6);

  const displayInternships = allInternshipsPool.slice(0, 3);

  // Strictly sort categories according to requested sequence:
  // 1. Software Development, 2. Web Development, 3. Data Science & Analytics,
  // 4. QA & Testing, 5. DevOps & Cloud, 6. Database Administration
  const sortedCategories = [...categories].sort((a, b) => {
    const diff = getCategorySortOrder(a) - getCategorySortOrder(b);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name);
  });

  // Structured Data for Google Sitelinks Searchbox & Organization
  const homepageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://freshersbridge.in/#website',
        'url': 'https://freshersbridge.in',
        'name': 'FreshersBridge',
        'description': 'Handpicked off-campus job drives, software engineering roles, and developer internships for freshers and college graduates.',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': 'https://freshersbridge.in/jobs?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://freshersbridge.in/#organization',
        'name': 'FreshersBridge',
        'url': 'https://freshersbridge.in',
        'logo': 'https://freshersbridge.in/icon.png',
        'sameAs': [
          'https://t.me/freshersbridge',
          'https://chat.whatsapp.com/G5yqV0rZqJm8'
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />

      {/* 1. Hero Section: Direct, clean, and optimized */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-indigo-50/25 to-white dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 border-b border-slate-200/70 dark:border-slate-800 px-6 pt-12 pb-14 sm:pt-16 sm:pb-18 text-center sm:px-8 lg:px-12">
        {/* Minimal soft ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-[radial-gradient(ellipse_at_center,rgba(39,93,245,0.09),transparent_70%)] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 dark:border-blue-900/60 bg-white dark:bg-slate-900 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Verified Off-Campus Drives &amp; Tech Hiring 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Your Bridge from College <br />
            To Your{' '}
            <span className="bg-gradient-to-r from-[#275df5] via-[#4338ca] to-[#2563eb] bg-clip-text text-transparent">
              First Tech Job
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Handpicked off-campus job drives, entry-level software roles, and developer internships for{' '}
            <span className="text-[#275df5] font-bold">all freshers & college graduates</span>.
          </p>

          {/* Search Bar Container */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <SearchBar />

            {/* Quick Action Shortcuts as Modern Interactive Chips */}
            <div className="flex items-center gap-2 pt-2 flex-wrap justify-center text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400 mr-0.5">Popular:</span>
              <Link
                href="/jobs"
                className="rounded-full bg-white/90 dark:bg-slate-800/90 px-3 py-1 font-medium text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/90 hover:border-[#275df5] hover:text-[#275df5] dark:hover:border-[#275df5] dark:hover:text-[#275df5] transition-all shadow-2xs hover:shadow-xs"
              >
                Software Engineer
              </Link>
              <Link
                href="/internships"
                className="rounded-full bg-white/90 dark:bg-slate-800/90 px-3 py-1 font-medium text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/90 hover:border-[#275df5] hover:text-[#275df5] dark:hover:border-[#275df5] dark:hover:text-[#275df5] transition-all shadow-2xs hover:shadow-xs"
              >
                Tech Internships
              </Link>
              <Link
                href="/companies"
                className="rounded-full bg-white/90 dark:bg-slate-800/90 px-3 py-1 font-medium text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/90 hover:border-[#275df5] hover:text-[#275df5] dark:hover:border-[#275df5] dark:hover:text-[#275df5] transition-all shadow-2xs hover:shadow-xs"
              >
                TCS &amp; Infosys
              </Link>
              <Link
                href="/career-tools"
                className="rounded-full bg-white/90 dark:bg-slate-800/90 px-3 py-1 font-medium text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/90 hover:border-[#275df5] hover:text-[#275df5] dark:hover:border-[#275df5] dark:hover:text-[#275df5] transition-all shadow-2xs hover:shadow-xs"
              >
                ATS Resume Checker
              </Link>
            </div>

            {/* Subtle authentic trust line with crisp icons */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>100% Free Applications</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Official Company Careers Links</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Verified Daily Updates</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Section: Strictly ordered with full non-truncated titles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Explore Categories</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Find opportunities aligned with your technical interest area.</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sortedCategories.length > 0 ? (
            sortedCategories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/jobs?category=${category.slug}`}
                prefetch={true}
                className="group flex flex-col items-center justify-center text-center px-3 py-5 rounded-xl border border-border bg-card shadow-xs transition-all hover:border-[#275df5] hover:shadow-md min-h-[148px]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary group-hover:bg-[#275df5]/10 group-hover:scale-105 transition-all">
                  {getCategoryIcon(category.slug)}
                </div>
                <h3 className="mt-3 text-xs sm:text-sm font-bold text-foreground text-center leading-snug px-1 flex items-center justify-center min-h-[2.5rem]">
                  {category.name}
                </h3>
              </Link>
            ))
          ) : (
            [
              { name: 'Software Development', slug: 'software-development' },
              { name: 'Web Development', slug: 'web-development' },
              { name: 'Data Science & Analytics', slug: 'data-science-analytics' },
              { name: 'QA & Testing', slug: 'qa-testing' },
              { name: 'DevOps & Cloud', slug: 'devops-cloud' },
              { name: 'Database Administration', slug: 'database-administration' },
            ].map((cat, i) => (
              <Link
                key={i}
                href={`/jobs?category=${cat.slug}`}
                className="flex flex-col items-center justify-center text-center px-3 py-5 rounded-xl border border-border bg-card/50 shadow-xs min-h-[148px]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  {getCategoryIcon(cat.slug)}
                </div>
                <h3 className="mt-3 text-xs sm:text-sm font-bold text-foreground text-center leading-snug px-1 flex items-center justify-center min-h-[2.5rem]">
                  {cat.name}
                </h3>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* 3. Latest Full-Time Jobs Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-[#275df5] shrink-0 translate-y-[1.5px]" />
              <span>Featured & Latest Job Openings</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Discover fresh off-campus drives updated continuously.
            </p>
          </div>
          <Link
            href="/jobs"
            prefetch={true}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-500 w-fit pt-0.5 sm:pt-0"
          >
            <span>Browse All Full-Time Jobs</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayJobs.length > 0 ? (
            displayJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="col-span-full border-2 border-dashed border-border rounded-xl p-12 text-center">
              <Briefcase className="h-10 w-10 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-1">No Jobs Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                We are refreshing recent listings. Browse all handpicked freshers jobs.
              </p>
              <Link
                href="/jobs"
                prefetch={true}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Browse All Jobs
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. Top Student Internships Section */}
      {displayInternships.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                <GraduationCap className="h-3.5 w-3.5" />
                Student & Fresh Graduate Opportunities
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
                🎓 Developer & Tech Internships
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                Explore summer/winter internships and apprenticeship roles.
              </p>
            </div>
            <Link
              href="/internships"
              prefetch={true}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 w-fit pt-0.5 sm:pt-0"
            >
              <span>Browse All Internships</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayInternships.map((internship) => (
              <JobCard key={internship.id} job={internship} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
