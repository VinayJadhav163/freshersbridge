import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { Briefcase, X, RotateCcw, Sparkles, Filter } from 'lucide-react';
import { Job, Category } from '@/types';
import { resolveCategory } from '@/lib/categoryResolver';
import { fetchWithCache } from '@/lib/dataCache';

interface SearchParams {
  q?: string;
  location?: string;
  category?: string;
  eligibility?: string;
  featured?: string;
  page?: string;
}

interface JobsPageProps {
  searchParams: Promise<SearchParams>;
}

export const revalidate = 60; // 60s background ISR cache

// Cached category lookup
const getCachedCategories = cache(async (): Promise<Category[]> => {
  return fetchWithCache<Category[]>('all_categories', async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    return (data || []) as Category[];
  }, 300);
});

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedSearchParams = await searchParams;
  const q = (resolvedSearchParams.q || '').trim();
  const location = (resolvedSearchParams.location || '').trim();
  const categorySlug = (resolvedSearchParams.category || '').trim();
  const eligibility = (resolvedSearchParams.eligibility || '').trim();
  const featured = (resolvedSearchParams.featured || '').trim();
  const page = resolvedSearchParams.page || '1';

  // 1. Fetch cached categories and resolve active category
  const categories = await getCachedCategories();
  const activeCat = resolveCategory(categories, categorySlug);
  const categoryId = activeCat?.id || '';

  // 2. Pagination indices (10 jobs per page)
  const itemsPerPage = 10;
  const currentPage = parseInt(page) || 1;
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // 3. High-speed cached query execution
  const cacheKey = `jobs:${q}:${location}:${categoryId}:${eligibility}:${featured}:${page}`;
  const { jobs, totalCount } = await fetchWithCache<{ jobs: Job[]; totalCount: number }>(
    cacheKey,
    async () => {
      let queryBuilder = supabase
        .from('jobs')
        .select('id, title, slug, company, location, salary, eligibility, skills, created_at, category_id, featured_job, categories(id, name, slug)', { count: 'exact' })
        .not('title', 'ilike', '%intern%')
        .not('title', 'ilike', '%internship%')
        .not('title', 'ilike', '%apprentice%')
        .not('title', 'ilike', '%fellowship%');

      if (q) {
        queryBuilder = queryBuilder.or(`title.ilike.%${q}%,company.ilike.%${q}%,eligibility.ilike.%${q}%`);
      }
      if (location) {
        queryBuilder = queryBuilder.ilike('location', `%${location}%`);
      }
      if (categoryId) {
        queryBuilder = queryBuilder.eq('category_id', categoryId);
      }
      if (eligibility) {
        queryBuilder = queryBuilder.ilike('eligibility', `%${eligibility}%`);
      }
      if (featured === 'true') {
        queryBuilder = queryBuilder.eq('featured_job', true);
      }

      try {
        const { data, count, error } = await queryBuilder
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;
        return {
          jobs: (data || []) as unknown as Job[],
          totalCount: count || 0,
        };
      } catch (err) {
        console.error('Error fetching jobs:', err);
        return { jobs: [], totalCount: 0 };
      }
    },
    120
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getPaginationUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (location) params.set('location', location);
    if (activeCat) params.set('category', activeCat.slug);
    if (eligibility) params.set('eligibility', eligibility);
    if (featured) params.set('featured', featured);
    params.set('page', pageNumber.toString());
    return `/jobs?${params.toString()}`;
  };

  // Construct URL builder for removing individual active filter pills
  const getFilterRemoveUrl = (removeKey: 'q' | 'location' | 'category' | 'featured') => {
    const params = new URLSearchParams();
    if (removeKey !== 'q' && q) params.set('q', q);
    if (removeKey !== 'location' && location) params.set('location', location);
    if (removeKey !== 'category' && activeCat) params.set('category', activeCat.slug);
    if (removeKey !== 'featured' && featured) params.set('featured', featured);
    const queryString = params.toString();
    return queryString ? `/jobs?${queryString}` : '/jobs';
  };

  const hasActiveFilters = !!(q || location || activeCat || featured);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:py-5 sm:px-6 lg:px-8 w-full space-y-5">
      {/* Search Bar Section */}
      <div className="flex flex-col gap-2 items-center md:items-start">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Browse Freshers Jobs
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing {totalCount} handpicked full-time job opportunities.
        </p>
        <div className="w-full flex justify-start pt-1">
          <SearchBar initialQuery={q} initialLocation={location} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar (Sticky on Scroll) */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start h-fit space-y-4">
          <JobFilters categories={categories} />
        </aside>

        {/* Jobs List Area */}
        <main className="lg:col-span-3 space-y-4">
          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-border bg-card shadow-2xs">
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 mr-1">
                <Filter className="h-3.5 w-3.5 text-indigo-500" />
                <span>Filters:</span>
              </span>

              {q && (
                <Link
                  href={getFilterRemoveUrl('q')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all group"
                  title="Remove search filter"
                >
                  <span>Search: &quot;{q}&quot;</span>
                  <X className="h-3 w-3 group-hover:scale-125 transition-transform" />
                </Link>
              )}

              {activeCat && (
                <Link
                  href={getFilterRemoveUrl('category')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-all group"
                  title="Remove category filter"
                >
                  <span>Category: {activeCat.name}</span>
                  <X className="h-3 w-3 group-hover:scale-125 transition-transform" />
                </Link>
              )}

              {location && (
                <Link
                  href={getFilterRemoveUrl('location')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all group"
                  title="Remove location filter"
                >
                  <span>Location: &quot;{location}&quot;</span>
                  <X className="h-3 w-3 group-hover:scale-125 transition-transform" />
                </Link>
              )}

              {featured === 'true' && (
                <Link
                  href={getFilterRemoveUrl('featured')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-all group"
                  title="Remove featured filter"
                >
                  <span>Featured Only</span>
                  <X className="h-3 w-3 group-hover:scale-125 transition-transform" />
                </Link>
              )}

              <Link
                href="/jobs"
                className="ml-auto text-[11px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline pl-2"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Clear All</span>
              </Link>
            </div>
          )}

          {jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Smart Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                from={from}
                to={to}
                itemLabel="jobs"
                baseUrl={getPaginationUrl}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-10 sm:p-12 text-center space-y-4 bg-card shadow-sm animate-in fade-in duration-200">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto">
                <Briefcase className="h-7 w-7" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg font-extrabold text-foreground">No jobs match your specific search</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {q && activeCat ? (
                    <>
                      We couldn&apos;t find any openings containing <span className="font-semibold text-foreground">&quot;{q}&quot;</span> within <span className="font-semibold text-foreground">{activeCat.name}</span>.
                    </>
                  ) : activeCat ? (
                    <>
                      No current open roles under <span className="font-semibold text-foreground">{activeCat.name}</span>. Try exploring other technical domains.
                    </>
                  ) : q ? (
                    <>
                      No job listings found matching <span className="font-semibold text-foreground">&quot;{q}&quot;</span>.
                    </>
                  ) : (
                    <>We couldn&apos;t find any job openings matching your criteria.</>
                  )}
                </p>
              </div>

              {/* Intelligent 1-Click Recovery Actions */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                {q && activeCat && (
                  <>
                    <Link
                      href={`/jobs?category=${activeCat.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>View all in {activeCat.name}</span>
                    </Link>
                    <Link
                      href={`/jobs?q=${encodeURIComponent(q)}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2.5 text-xs font-bold transition-all"
                    >
                      <span>Search &quot;{q}&quot; across all categories</span>
                    </Link>
                  </>
                )}

                {activeCat && !q && (
                  <Link
                    href="/jobs"
                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm"
                  >
                    Explore all Freshers Jobs
                  </Link>
                )}

                {q && !activeCat && (
                  <Link
                    href="/jobs"
                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm"
                  >
                    Clear Search
                  </Link>
                )}

                <Link
                  href="/internships"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground px-4 py-2.5 text-xs font-semibold transition-all"
                >
                  <span>Browse Internships</span>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
