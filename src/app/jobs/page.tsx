import { supabase } from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { Sparkles, Briefcase } from 'lucide-react';

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

export const revalidate = 0; // Disable caching for search results to ensure freshness

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || '';
  const location = resolvedSearchParams.location || '';
  const categorySlug = resolvedSearchParams.category || '';
  const eligibility = resolvedSearchParams.eligibility || '';
  const featured = resolvedSearchParams.featured || '';
  const page = resolvedSearchParams.page || '1';

  // 1. Fetch categories for filters sidebar
  let categories = [];
  try {
    const { data } = await supabase.from('categories').select('*').order('name');
    categories = data || [];
  } catch (err) {
    console.error('Error fetching categories:', err);
  }

  // 2. Resolve Category Slug to ID
  let categoryId = '';
  if (categorySlug) {
    const activeCat = categories.find((c) => c.slug === categorySlug);
    if (activeCat) categoryId = activeCat.id;
  }

  // 3. Build Jobs Query
  let queryBuilder = supabase.from('jobs').select('*, categories(*)', { count: 'exact' });

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

  // Pagination logic
  const itemsPerPage = 9;
  const currentPage = parseInt(page) || 1;
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let jobs = [];
  let totalCount = 0;

  try {
    const { data, count, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    jobs = data || [];
    totalCount = count || 0;
  } catch (err) {
    console.error('Error fetching jobs:', err);
  }

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8">
      {/* Search Bar Section */}
      <div className="flex flex-col gap-4 items-center md:items-start">
        <h1 className="text-3xl font-extrabold text-foreground">
          Browse Freshers Jobs
        </h1>
        <p className="text-sm text-muted-foreground -mt-3">
          Showing {totalCount} handpicked job drives and internships.
        </p>
        <div className="w-full flex justify-start">
          <SearchBar initialQuery={q} initialLocation={location} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <JobFilters categories={categories} />
        </aside>

        {/* Jobs List Area */}
        <main className="lg:col-span-3 space-y-6">
          {jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6 border-t border-border">
                  <Link
                    href={getPaginationUrl(currentPage - 1)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold border border-border bg-card shadow-sm transition-all hover:bg-secondary ${
                      currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    Previous
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Link
                    href={getPaginationUrl(currentPage + 1)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold border border-border bg-card shadow-sm transition-all hover:bg-secondary ${
                      currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    Next
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="border-2 border-dashed border-border rounded-xl p-16 text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 mx-auto text-indigo-600">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No matches found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We couldn&apos;t find any job openings matching your search criteria. Try modifying your filters or search keywords.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
