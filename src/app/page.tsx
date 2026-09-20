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
  Calendar,
  Check
} from 'lucide-react';
import { Job, Category } from '@/types';
import { sortCategories } from '@/lib/categoryResolver';
import { fetchWithCache } from '@/lib/dataCache';
import { COMMUNITY_LINKS } from '@/lib/community';

// High-performance edge caching (revalidates every 10 minutes, sub-20ms TTFB globally)
export const revalidate = 600;

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

export default async function Home() {
  // Parallel fetch categories & real-time fresh pools of jobs and internships
  const [categories, allJobsPool, allInternshipsPool] = await Promise.all([
    fetchWithCache<Category[]>('home:categories', async () => {
      const { data } = await supabase.from('categories').select('*');
      return (data || []) as Category[];
    }, 300),
    (async () => {
      const { data } = await supabase
        .from('jobs')
        .select('id, title, slug, company, location, salary, eligibility, skills, created_at, category_id, featured_job, apply_url, source_url, categories(id, name, slug)')
        .not('title', 'ilike', '%intern%')
        .not('title', 'ilike', '%internship%')
        .not('title', 'ilike', '%apprentice%')
        .not('title', 'ilike', '%fellowship%')
        .not('apply_url', 'ilike', '%/internship/%')
        .order('created_at', { ascending: false })
        .limit(30);
      return (data || []) as unknown as Job[];
    })(),
    (async () => {
      const { data } = await supabase
        .from('jobs')
        .select('id, title, slug, company, location, salary, eligibility, skills, created_at, category_id, featured_job, apply_url, source_url, categories(id, name, slug)')
        .or('title.ilike.%intern%,title.ilike.%internship%,title.ilike.%apprentice%,title.ilike.%fellowship%,apply_url.ilike.%/internship/%')
        .order('created_at', { ascending: false })
        .limit(20);
      return (data || []) as unknown as Job[];
    })(),
  ]);

  // Deterministic latest listings (featured first, then most recent, strictly excluding internships)
  const filteredJobsPool = allJobsPool.filter((j) => {
    const t = (j.title || '').toLowerCase();
    const u = (j.apply_url || '').toLowerCase();
    const su = (j.source_url || '').toLowerCase();
    const el = (j.eligibility || '').toLowerCase();
    const sal = (j.salary || '').toLowerCase();
    const isIntern =
      /\b(intern|internship|interns|apprentice|fellowship)\b/i.test(t) ||
      u.includes('/internship/') ||
      su.includes('/internship/') ||
      el.includes('intern') ||
      sal.includes('/ month') ||
      sal.includes('/month') ||
      sal.includes('stipend');
    return !isIntern;
  });

  const featuredJobs = filteredJobsPool.filter((j) => j.featured_job);
  const regularJobs = filteredJobsPool.filter((j) => !j.featured_job);
  const displayJobs = [
    ...featuredJobs.slice(0, 2),
    ...regularJobs,
  ].slice(0, 6);

  const displayInternships = allInternshipsPool.slice(0, 3);

  // Strictly sort categories according to requested sequence:
  // 1. Software Development, 2. Web Development, 3. Data Science & Analytics,
  // 4. QA & Testing, 5. DevOps & Cloud, 6. Database Administration
  const sortedCategories = sortCategories(categories);

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
        'logo': 'https://freshersbridge.in/linkedin_logo_ultra_hd.png',
        'sameAs': [
          COMMUNITY_LINKS.telegram,
          COMMUNITY_LINKS.whatsapp,
          COMMUNITY_LINKS.linkedin,
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-16 sm:pb-24">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />

      {/* 1. Hero Section: Direct, clean, and optimized */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-indigo-50/25 to-white dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 border-b border-slate-200/70 dark:border-slate-800 px-4 sm:px-8 lg:px-12 pt-8 pb-6 sm:pt-12 sm:pb-8 text-center">
        {/* Minimal soft ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-[radial-gradient(ellipse_at_center,rgba(39,93,245,0.09),transparent_70%)] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 dark:border-blue-900/60 bg-white dark:bg-slate-900 px-3.5 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs max-w-[95%] truncate">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="truncate">Verified Off-Campus Drives &amp; Tech Hiring 2026</span>
          </div>

          <h1 className="text-[27px] min-[390px]:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.2] sm:leading-tight">
            Your Bridge from College <br />
            to your{' '}
            <span className="bg-gradient-to-r from-[#275df5] via-[#4338ca] to-[#2563eb] bg-clip-text text-transparent inline-block sm:inline whitespace-nowrap">
              First Tech Job
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed px-2">
            Handpicked off-campus job drives, entry-level software roles, and developer internships for{' '}
            <span className="text-[#275df5] font-bold">all freshers &amp; college graduates</span>.
          </p>

          {/* Search Bar Container */}
          <div className="pt-2 flex flex-col items-center gap-2.5 w-full">
            <SearchBar />

            {/* Quick Action Shortcuts as Modern Interactive Chips */}
            <div className="w-full max-w-2xl mx-auto pt-0.5">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 px-1 justify-start sm:justify-center text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-0.5">Popular:</span>
                <Link
                  href="/jobs"
                  className="rounded-full bg-white/90 dark:bg-slate-800/90 px-3 py-1 font-medium text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/90 hover:border-[#275df5] hover:text-[#275df5] dark:hover:border-[#275df5] dark:hover:text-[#275df5] transition-all shadow-2xs hover:shadow-xs whitespace-nowrap shrink-0"
                >
                  Software Engineer
                </Link>
                <Link
                  href="/internships"
                  className="rounded-full bg-white/90 dark:bg-slate-800/90 px-3 py-1 font-medium text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/90 hover:border-[#275df5] hover:text-[#275df5] dark:hover:border-[#275df5] dark:hover:text-[#275df5] transition-all shadow-2xs hover:shadow-xs whitespace-nowrap shrink-0"
                >
                  Tech Internships
                </Link>
                <Link
                  href="/companies"
                  className="rounded-full bg-white/90 dark:bg-slate-800/90 px-3 py-1 font-medium text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/90 hover:border-[#275df5] hover:text-[#275df5] dark:hover:border-[#275df5] dark:hover:text-[#275df5] transition-all shadow-2xs hover:shadow-xs whitespace-nowrap shrink-0"
                >
                  TCS &amp; Infosys
                </Link>
                <Link
                  href="/career-tools"
                  className="rounded-full bg-white/90 dark:bg-slate-800/90 px-3 py-1 font-medium text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/90 hover:border-[#275df5] hover:text-[#275df5] dark:hover:border-[#275df5] dark:hover:text-[#275df5] transition-all shadow-2xs hover:shadow-xs whitespace-nowrap shrink-0"
                >
                  ATS Resume Checker
                </Link>
              </div>
            </div>

            {/* Sleek, ultra-compact single trust line (clean spacing, no redundant bullets) */}
            <div className="pt-1 flex items-center justify-center text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 gap-3.5 sm:gap-6 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>100% Free</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Official Careers Links</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Verified Daily</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Section: Strictly ordered with full non-truncated titles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-5 sm:mt-8 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">Explore Categories</h2>
          <Link
            href="/jobs"
            className="text-xs font-bold text-[#275df5] hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="mt-3 sm:mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-[#275df5] shrink-0 translate-y-[1.5px]" />
            <span>Featured & Latest Job Openings</span>
          </h2>
          <Link
            href="/jobs"
            prefetch={true}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-500 w-fit"
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
              🎓 Developer & Tech Internships
            </h2>
            <Link
              href="/internships"
              prefetch={true}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 w-fit"
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
