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
  Rocket
} from 'lucide-react';

// Assign dynamic icons based on category slug
function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'software-development':
    case 'software-engineering':
      return <Code className="h-6 w-6 text-indigo-500" />;
    case 'web-development':
    case 'frontend-backend':
      return <Layers className="h-6 w-6 text-pink-500" />;
    case 'data-science-analytics':
    case 'data-analytics':
      return <BarChart4 className="h-6 w-6 text-emerald-500" />;
    case 'database-administration':
      return <Database className="h-6 w-6 text-amber-500" />;
    case 'devops-cloud':
      return <Cpu className="h-6 w-6 text-cyan-500" />;
    case 'qa-testing':
      return <ShieldCheck className="h-6 w-6 text-purple-500" />;
    default:
      return <Sparkles className="h-6 w-6 text-indigo-500" />;
  }
}

export const revalidate = 60; // Revalidate page every 60 seconds

export default async function Home() {
  // Safe fetch for categories
  let categories = [];
  try {
    const { data } = await supabase.from('categories').select('*').order('name');
    categories = data || [];
  } catch (err) {
    console.error('Error fetching categories:', err);
  }

  // Safe fetch for featured jobs
  let featuredJobs = [];
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*, categories(*)')
      .eq('featured_job', true)
      .order('created_at', { ascending: false })
      .limit(3);
    featuredJobs = data || [];
  } catch (err) {
    console.error('Error fetching featured jobs:', err);
  }

  // Safe fetch for latest jobs
  let latestJobs = [];
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*, categories(*)')
      .order('created_at', { ascending: false })
      .limit(6);
    latestJobs = data || [];
  } catch (err) {
    console.error('Error fetching latest jobs:', err);
  }

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 px-6 pt-20 pb-28 text-center sm:px-8 lg:px-12">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />

        {/* Glow blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400">
            <Rocket className="h-3.5 w-3.5" />
            Empowering Computer Science & Engineering Freshers
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your Bridge from College <br />
            To Your <span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">First Tech Job</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 font-medium">
            Handpicked off-campus job drives, entry-level software roles, and developer internships for{' '}
            <span className="text-white font-semibold">MCA, BCA, BSc CS & BE/BTech</span> freshers.
          </p>

          {/* Search Bar Container */}
          <div className="pt-4 flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* 2. Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Explore Categories</h2>
            <p className="text-sm text-muted-foreground mt-1">Find opportunities aligned with your technical interest area.</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.length > 0 ? (
            categories.slice(0, 12).map((category) => (
              <Link
                key={category.id}
                href={`/jobs?category=${category.slug}`}
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
            // Mock categories if db is not seeded
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

      {/* 3. Featured Jobs Section */}
      {featuredJobs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 w-full">
          <div className="flex items-center gap-2 mb-6">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-ping" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">🔥 Featured Openings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Latest Jobs Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">📅 Latest Job Openings</h2>
            <p className="text-sm text-muted-foreground mt-1">Direct off-campus drives updated recently.</p>
          </div>
          <Link
            href="/jobs"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-500"
          >
            <span>Browse All Jobs</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestJobs.length > 0 ? (
            latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="col-span-full border-2 border-dashed border-border rounded-xl p-12 text-center">
              <Sparkles className="h-10 w-10 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-1">No Jobs Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                We are setting up the portal. Admin users can access the Admin Dashboard to post the first jobs!
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Go to Admin Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. Call To Action (CTA) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20 w-full">
        <div className="relative overflow-hidden rounded-2xl bg-indigo-600 px-6 py-12 text-center shadow-xl sm:px-12 sm:py-16">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl" />

          <div className="relative mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Are you hiring tech freshers?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base">
              Post your jobs, internships, and entry-level off-campus drives on FreshersBridge to connect directly with thousands of computer science graduates.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <Link
                href="/admin"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50"
              >
                Post a Job (Free)
              </Link>
              <Link
                href="/jobs"
                className="rounded-lg border border-indigo-400 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
              >
                Explore Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
