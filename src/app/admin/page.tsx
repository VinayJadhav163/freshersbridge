import { supabase } from '@/lib/supabase';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const revalidate = 0; // Ensure admin dashboard is never cached

export default async function AdminPage() {
  // Fetch all jobs and categories to pass to the admin client UI
  let jobs = [];
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*, categories(*)')
      .order('created_at', { ascending: false });
    jobs = data || [];
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

  return (
    <div className="flex-1 bg-slate-50/30 dark:bg-slate-950/10">
      <AdminDashboard initialJobs={jobs} initialCategories={categories} />
    </div>
  );
}
