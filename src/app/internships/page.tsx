import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { GraduationCap, Briefcase } from 'lucide-react';
import { Metadata } from 'next';
import { Job, Category } from '@/types';

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

import { fetchWithCache } from '@/lib/dataCache';

// Cached category lookup
const getCachedCategories = cache(async (): Promise<Category[]> => {
  return fetchWithCache<Category[]>('all_categories', async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    return (data || []) as Category[];
  }, 300);
});

export default async function InternshipsPage({ searchParams }: InternshipsPageProps) {
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
    if (categorySlug) params.set('category', categorySlug);
    if (eligibility) params.set('eligibility', eligibility);
    if (featured) params.set('featured', featured);
    params.set('page', pageNumber.toString());
    return `/internships?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:py-5 sm:px-6 lg:px-8 w-full space-y-5">
      {/* Header & Search Bar Section */}
      <div className="flex flex-col gap-2 items-center md:items-start">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
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
            placeholder="Internship title, skills, or company..."
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
            <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3 bg-card">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-bold text-foreground">No internships found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                We couldn't find any internship openings matching your criteria. Try adjusting your search filters or browse other categories.
              </p>
              <Link
                href="/internships"
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
