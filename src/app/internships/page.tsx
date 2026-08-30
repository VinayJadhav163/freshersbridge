import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { GraduationCap, Briefcase, X, RotateCcw, Sparkles, Filter } from 'lucide-react';
import { Metadata } from 'next';
import { Job, Category } from '@/types';
import { resolveCategory } from '@/lib/categoryResolver';
import { fetchWithCache } from '@/lib/dataCache';

export const metadata: Metadata = {
  title: 'Tech Internships for Freshers & Graduates | FreshersBridge',
  description:
    'Explore verified software engineering, web development, data science, and cloud internships for freshers and college graduates.',
};

interface SearchParams {
  q?: string;
  location?: string;
  category?: string;
  eligibility?: string;
  featured?: string;
  page?: string;
}

interface InternshipsPageProps {
  searchParams: Promise<SearchParams>;
}

export const revalidate = 60;

// Cached category lookup
const getCachedCategories = cache(async (): Promise<Category[]> => {
  return fetchWithCache<Category[]>('all_categories', async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    return (data || []) as Category[];
  }, 300);
});

export default async function InternshipsPage({ searchParams }: InternshipsPageProps) {
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

  // 2. Pagination parameters (10 internships per page)
  const itemsPerPage = 10;
  const currentPage = parseInt(page) || 1;
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // 3. High-performance cached internships query
  const cacheKey = `internships:${q}:${location}:${categoryId}:${eligibility}:${featured}:${page}`;
  const { internships, totalCount } = await fetchWithCache<{ internships: Job[]; totalCount: number }>(
    cacheKey,
    async () => {
      try {
        let queryBuilder = supabase
          .from('jobs')
          .select('id, title, slug, company, location, salary, eligibility, skills, created_at, category_id, featured_job, categories(id, name, slug)', { count: 'exact' });

        if (location) queryBuilder = queryBuilder.ilike('location', `%${location}%`);
        if (categoryId) queryBuilder = queryBuilder.eq('category_id', categoryId);
        if (eligibility) queryBuilder = queryBuilder.ilike('eligibility', `%${eligibility}%`);
        if (featured === 'true') queryBuilder = queryBuilder.eq('featured_job', true);

        // Internships are strictly defined by title (Intern, Internship, Apprentice, Fellowship)
        if (q) {
          queryBuilder = queryBuilder
            .or(`title.ilike.%${q}%,company.ilike.%${q}%,eligibility.ilike.%${q}%`)
            .or('title.ilike.%intern%,title.ilike.%internship%,title.ilike.%apprentice%,title.ilike.%fellowship%');
        } else {
          queryBuilder = queryBuilder.or(
            'title.ilike.%intern%,title.ilike.%internship%,title.ilike.%apprentice%,title.ilike.%fellowship%'
          );
        }

        const { data, count, error } = await queryBuilder
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;
        return {
          internships: (data || []) as unknown as Job[],
          totalCount: count || 0,
        };
      } catch (err: any) {
        console.error('Error fetching internships:', err);
        return { internships: [], totalCount: 0 };
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
    return `/internships?${params.toString()}`;
  };

  const getFilterRemoveUrl = (removeKey: 'q' | 'location' | 'category' | 'featured') => {
    const params = new URLSearchParams();
    if (removeKey !== 'q' && q) params.set('q', q);
    if (removeKey !== 'location' && location) params.set('location', location);
    if (removeKey !== 'category' && activeCat) params.set('category', activeCat.slug);
    if (removeKey !== 'featured' && featured) params.set('featured', featured);
    const queryString = params.toString();
    return queryString ? `/internships?${queryString}` : '/internships';
  };

  const hasActiveFilters = !!(q || location || activeCat || featured);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:py-5 sm:px-6 lg:px-8 w-full space-y-5">
      {/* Header & Search Bar Section */}
      <div className="flex flex-col gap-2 items-center md:items-start">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <GraduationCap className="h-3.5 w-3.5" />
          Freshers & Student Internship Opportunities
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Browse Developer & Tech Internships
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing {totalCount} verified software, web dev, and data internships for freshers.
        </p>
        <div className="w-full flex justify-start pt-1">
          <SearchBar 
            initialQuery={q} 
            initialLocation={location} 
            buttonText="Search Internships"
            targetPath="/internships"
            placeholder="Role, skills, or tech stack..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start h-fit space-y-4">
          <JobFilters categories={categories} />
        </aside>

        {/* Internships List Area */}
        <main className="lg:col-span-3 space-y-4">
          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-border bg-card shadow-2xs">
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 mr-1">
                <Filter className="h-3.5 w-3.5 text-emerald-500" />
                <span>Filters:</span>
              </span>

              {q && (
                <Link
                  href={getFilterRemoveUrl('q')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all group"
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
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all group"
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
                href="/internships"
                className="ml-auto text-[11px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline pl-2"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Clear All</span>
              </Link>
            </div>
          )}

          {internships.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {internships.map((internship) => (
                  <JobCard key={internship.id} job={internship} />
                ))}
              </div>

              {/* Smart Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                from={from}
                to={to}
                itemLabel="internships"
                baseUrl={getPaginationUrl}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-10 sm:p-12 text-center space-y-4 bg-card shadow-sm animate-in fade-in duration-200">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto">
                <Briefcase className="h-7 w-7" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg font-extrabold text-foreground">No internships match your specific search</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {q && activeCat ? (
                    <>
                      We couldn&apos;t find any internship openings containing <span className="font-semibold text-foreground">&quot;{q}&quot;</span> within <span className="font-semibold text-foreground">{activeCat.name}</span>.
                    </>
                  ) : activeCat ? (
                    <>
                      No current internship roles under <span className="font-semibold text-foreground">{activeCat.name}</span>. Try exploring full-time jobs or other domains.
                    </>
                  ) : q ? (
                    <>
                      No internships found matching <span className="font-semibold text-foreground">&quot;{q}&quot;</span>.
                    </>
                  ) : (
                    <>We couldn&apos;t find any internship openings matching your criteria.</>
                  )}
                </p>
              </div>

              {/* Intelligent 1-Click Recovery Actions */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                {q && activeCat && (
                  <>
                    <Link
                      href={`/internships?category=${activeCat.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>View all in {activeCat.name}</span>
                    </Link>
                    <Link
                      href={`/internships?q=${encodeURIComponent(q)}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2.5 text-xs font-bold transition-all"
                    >
                      <span>Search &quot;{q}&quot; across all categories</span>
                    </Link>
                  </>
                )}

                {activeCat && !q && (
                  <Link
                    href="/internships"
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm"
                  >
                    Explore all Internships
                  </Link>
                )}

                {q && !activeCat && (
                  <Link
                    href="/internships"
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm"
                  >
                    Clear Search
                  </Link>
                )}

                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground px-4 py-2.5 text-xs font-semibold transition-all"
                >
                  <span>Browse Full-Time Jobs</span>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
