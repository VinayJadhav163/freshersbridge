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
  Sparkles, 
  Rocket,
  GraduationCap,
  Calendar
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

import { fetchWithCache } from '@/lib/dataCache';

export default async function Home() {
  // Parallel fetch cached categories & pools of jobs/internships
  const [categories, allJobsPool, allInternshipsPool] = await Promise.all([
    fetchWithCache<Category[]>('home:categories', async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
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

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Hero Section with Minimal Modern Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-indigo-50/25 to-white dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 border-b border-slate-200/70 dark:border-slate-800 px-6 pt-12 pb-14 sm:pt-16 sm:pb-18 text-center sm:px-8 lg:px-12">
        {/* Minimal soft ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-[radial-gradient(ellipse_at_center,rgba(39,93,245,0.09),transparent_70%)] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 dark:border-blue-900/50 bg-white/90 dark:bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Verified Off-Campus Drives & Tech Hiring 2026</span>
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

            {/* Quick Action Shortcuts */}
            <div className="flex items-center gap-2 pt-1 flex-wrap justify-center text-xs font-semibold">
              <span className="text-slate-500">Popular:</span>
              <Link
                href="/jobs"
                className="text-slate-700 hover:text-[#275df5] underline underline-offset-4 decoration-slate-300"
              >
                Software Engineer
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/internships"
                className="text-slate-700 hover:text-[#275df5] underline underline-offset-4 decoration-slate-300"
              >
                Tech Internships
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/companies"
                className="text-slate-700 hover:text-[#275df5] underline underline-offset-4 decoration-slate-300"
              >
                TCS & Infosys
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/career-tools"
                className="text-slate-700 hover:text-[#275df5] underline underline-offset-4 decoration-slate-300"
              >
                ATS Resume Checker
              </Link>
            </div>

            {/* Subtle authentic trust line */}
            <div className="flex items-center justify-center gap-5 sm:gap-7 pt-2 text-[11px] font-medium text-slate-400 dark:text-slate-500 flex-wrap">
              <span>✓ 100% Free Applications</span>
              <span>•</span>
              <span>✓ Official Company Careers Links</span>
              <span>•</span>
              <span>✓ Verified Daily Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Explore Categories</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Find opportunities aligned with your technical interest area.</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.length > 0 ? (
            categories.slice(0, 12).map((category) => (
              <Link
                key={category.id}
                href={`/jobs?category=${category.slug}`}
                prefetch={true}
                className="group flex flex-col items-center justify-center text-center p-5 rounded-xl border border-border bg-card shadow-sm transition-all hover:border-indigo-500 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary group-hover:bg-indigo-600/10 group-hover:scale-110 transition-all">
                  {getCategoryIcon(category.slug)}
                </div>
                <h3 className="mt-3 text-xs sm:text-sm font-bold text-foreground line-clamp-1">
                  {category.name}
                </h3>
              </Link>
            ))
          ) : (
            ['Software Dev', 'Frontend', 'Backend', 'Data Analytics', 'QA Testing', 'DevOps'].map((name, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center text-center p-5 rounded-xl border border-dashed border-border bg-card/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <Sparkles className="h-6 w-6 text-muted" />
                </div>
                <h3 className="mt-3 text-xs sm:text-sm font-semibold text-muted-foreground">{name}</h3>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 3. Latest Full-Time Jobs Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 shrink-0" />
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
              <Sparkles className="h-10 w-10 text-indigo-500 mx-auto mb-4" />
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
