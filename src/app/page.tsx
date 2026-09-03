import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import { 
  ArrowRight, 
  Briefcase,
  Layers, 
  Cpu, 
  Code,
  ShieldCheck, 
  BarChart4, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Job, Category } from '@/types';
import { fetchWithCache } from '@/lib/dataCache';

// Fast dynamic server-side rendering so each visitor gets fresh rotated listings
export const dynamic = 'force-dynamic';

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

  // Latest listings (featured first, then most recent)
  const featuredJobs = allJobsPool.filter((j) => j.featured_job);
  const regularJobs = allJobsPool.filter((j) => !j.featured_job);
  const displayJobs = [
    ...featuredJobs.slice(0, 2),
    ...regularJobs,
  ].slice(0, 6);

  const displayInternships = allInternshipsPool.slice(0, 3);

  return (
    <div className="flex flex-col w-full pb-16 bg-[#fcfcfd] dark:bg-slate-950">
      {/* 1. Authoritative Job Portal Hero (Zero AI orbs/meshes) */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 pt-10 pb-14 sm:pt-14 sm:pb-16 text-center sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-5">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
            <span>Verified Off-Campus Drives • Batch 2024, 2025 & 2026</span>
          </div>

          {/* High-Impact Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.18]">
            Find Off-Campus Drives & <br className="hidden sm:inline" />
            <span className="text-[#275df5]">Fresher Tech Jobs in India</span>
          </h1>

          {/* Clear, Utility-First Subtitle */}
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Direct application links for entry-level Software Engineers, Web Developers, QA Testers, and Interns across top MNCs and technology startups.
          </p>

          {/* Search Bar Container */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <SearchBar />

            {/* Quick Filter Tags */}
            <div className="flex items-center gap-2 pt-1 flex-wrap justify-center text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Trending Searches:</span>
              <Link
                href="/jobs"
                className="hover:text-[#275df5] hover:underline"
              >
                Software Engineer
              </Link>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Link
                href="/internships"
                className="hover:text-[#275df5] hover:underline"
              >
                Paid Internships
              </Link>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Link
                href="/companies"
                className="hover:text-[#275df5] hover:underline"
              >
                TCS & Infosys Drives
              </Link>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Link
                href="/career-tools"
                className="hover:text-[#275df5] hover:underline"
              >
                ATS Resume Checker
              </Link>
            </div>

            {/* Live Operational Proof */}
            <div className="flex items-center justify-center gap-5 sm:gap-8 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11.5px] font-medium text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>100% Free Applications</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Official Careers Portal Links</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Refreshed Daily</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Compact Domain Explorer (Utilitarian & Clean) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 w-full">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Browse Opportunities by Domain
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filter off-campus drives by your technical field
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-xs font-bold text-[#275df5] hover:underline"
          >
            All Roles →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {categories.slice(0, 12).map((category) => (
            <Link
              key={category.id}
              href={`/jobs?category=${category.slug}`}
              prefetch={true}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#275df5] hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all group shadow-2xs"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-[#275df5]/10 group-hover:text-[#275df5] transition-colors">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#275df5] truncate">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Latest Full-Time Jobs Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 mb-5">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Featured & Recent Off-Campus Drives</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified graduate hiring programs updated throughout the day.
            </p>
          </div>
          <Link
            href="/jobs"
            prefetch={true}
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#275df5] hover:text-[#1f4cd0] w-fit"
          >
            <span>View All {allJobsPool.length > 0 ? `${allJobsPool.length}+ Jobs` : 'Jobs'}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {displayJobs.length > 0 ? (
            displayJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="col-span-full border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-10 text-center bg-white dark:bg-slate-900">
              <Briefcase className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Refreshing Openings</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-3">
                New drives are being indexed. Browse all active jobs right now.
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1 rounded-lg bg-[#275df5] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
              >
                Browse All Jobs
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. Student & Internships Section */}
      {displayInternships.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 mb-5">
            <div className="space-y-0.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Developer Internships & Apprentice Roles
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stipend-supported internships for 2025, 2026 and pre-final year students.
              </p>
            </div>
            <Link
              href="/internships"
              prefetch={true}
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#275df5] hover:text-[#1f4cd0] w-fit"
            >
              <span>View All Internships</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {displayInternships.map((internship) => (
              <JobCard key={internship.id} job={internship} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
