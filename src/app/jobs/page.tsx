import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { Job, Category } from '@/types';

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

export const revalidate = 60; // 60s background ISR cache for sub-100ms loading

import { fetchWithCache } from '@/lib/dataCache';

// Cached category lookup
const getCachedCategories = cache(async (): Promise<Category[]> => {
  return fetchWithCache<Category[]>('all_categories', async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    return (data || []) as Category[];
  }, 300);
});

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || '';
  const location = resolvedSearchParams.location || '';
  const categorySlug = resolvedSearchParams.category || '';
  const eligibility = resolvedSearchParams.eligibility || '';
  const featured = resolvedSearchParams.featured || '';
  const page = resolvedSearchParams.page || '1';

  // 1. Fetch cached categories
  const categories = await getCachedCategories();
  let categoryId = '';
  if (categorySlug) {
    const activeCat = categories.find((c) => c.slug === categorySlug);
    if (activeCat) categoryId = activeCat.id;
  }

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
    if (categorySlug) params.set('category', categorySlug);
    if (eligibility) params.set('eligibility', eligibility);
    if (featured) params.set('featured', featured);
    params.set('page', pageNumber.toString());
    return `/jobs?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:py-5 sm:px-6 lg:px-8 w-full space-y-5">
      {/* Search Bar Section */}
      <div className="flex flex-col gap-2 items-center md:items-start">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Browse Freshers Jobs
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing {totalCount} handpicked job drives and opportunities.
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
            <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3 bg-card">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-bold text-foreground">No jobs found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                We couldn't find any job openings matching your criteria. Try adjusting your search filters or browse other categories.
              </p>
              <Link
                href="/jobs"
                prefetch={true}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-all"
              >
                Reset Filters
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
