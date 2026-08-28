import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminLoginGate from '@/components/admin/AdminLoginGate';
import { getAdminAuthToken } from '@/lib/adminAuth';

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

  return (
    <div className="flex-1 bg-slate-50/30 dark:bg-slate-950/10">
      <AdminDashboard
        initialJobs={jobs}
        initialCategories={categories}
        initialSubscribers={subscribers}
      />
    </div>
  );
}
