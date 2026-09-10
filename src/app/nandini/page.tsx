import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminLoginGate from '@/components/admin/AdminLoginGate';
import { getAdminAuthToken } from '@/lib/adminAuth';
import { getATSAnalytics } from '@/lib/atsAnalytics';

export const revalidate = 0; // Ensure admin dashboard is never cached

export default async function NandiniAdminPage() {
  // Check server-side session cookie
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;
  const validToken = getAdminAuthToken();

  const isAuthenticated = sessionToken && sessionToken === validToken;

  // If not authenticated, render only the secure login screen (zero data leaked)
  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-slate-50/30 dark:bg-slate-950/10">
        <AdminLoginGate />
      </div>
    );
  }

  // Fetch all jobs across 1,000-row PostgREST pages to pass complete set to the admin client UI
  let jobs: any[] = [];
  try {
    const pageSize = 1000;
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, slug, company, location, category_id, salary, eligibility, skills, apply_url, source_name, source_url, featured_job, views_count, application_deadline, created_at, description, categories(*)')
        .order('created_at', { ascending: false })
        .range(from, from + pageSize - 1);

      if (error || !data || data.length === 0) {
        break;
      }
      jobs = jobs.concat(data);
      if (data.length < pageSize) {
        hasMore = false;
      } else {
        from += pageSize;
      }
    }
  } catch (err) {
    console.error('Error fetching jobs for admin:', err);
  }

  let categories = [];
  try {
    const { data } = await supabase.from('categories').select('*').order('name');
    categories = data || [];
  } catch (err) {
    console.error('Error fetching categories for admin:', err);
  }

  let subscribers = [];
  try {
    const { data } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    subscribers = data || [];
  } catch (err) {
    console.error('Error fetching subscribers for admin:', err);
  }

  // Fetch ATS Resume Scanner & AI Tailor analytics
  let atsAnalytics = null;
  try {
    atsAnalytics = await getATSAnalytics();
  } catch (err) {
    console.error('Error fetching ATS analytics for admin:', err);
  }

  return (
    <div className="flex-1 bg-slate-50/30 dark:bg-slate-950/10">
      <AdminDashboard
        initialJobs={jobs}
        initialCategories={categories}
        initialSubscribers={subscribers}
        initialAtsAnalytics={atsAnalytics}
      />
    </div>
  );
}
