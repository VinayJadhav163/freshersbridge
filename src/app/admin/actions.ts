'use server';

import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { notifySubscribersNewJob } from '@/lib/emailNotifier';
import { getAdminAuthToken, verifyAdminKey } from '@/lib/adminAuth';

export async function loginAdminAction(password: string) {
  const serverKey = process.env.ADMIN_ACCESS_KEY;
  if (!serverKey) {
    return { success: false, error: 'ADMIN_ACCESS_KEY not configured on server.' };
  }

  if (password.trim() !== serverKey.trim()) {
    return { success: false, error: 'Invalid Admin Password. Access Denied.' };
  }

  const token = getAdminAuthToken();
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  revalidatePath('/nandini');
  return { success: true, token };
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  revalidatePath('/nandini');
  return { success: true };
}

// Helper to slugify text
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

function handleActionError(err: any, fallbackMessage: string): string {
  if (err?.message?.includes('fetch failed') || err?.code === 'ENOTFOUND' || err?.cause?.code === 'ENOTFOUND') {
    return 'Database connection failed. Please check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.';
  }
  return err?.message || fallbackMessage;
}


/* Category Actions */

export async function addCategory(name: string, slug: string, adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  const finalSlug = slug.trim() ? slugify(slug) : slugify(name);

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: name.trim(), slug: finalSlug }])
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/nandini');
    return { success: true, category: data };
  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to create category') };
  }
}

export async function deleteCategory(id: string, adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/nandini');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to delete category') };
  }
}

/* Job Actions */

export async function saveJob(
  jobData: {
    id?: string;
    title: string;
    slug?: string;
    company: string;
    location: string;
    category_id: string;
    salary?: string;
    eligibility: string;
    skills: string; // comma-separated
    description: string;
    apply_url: string;
    source_name?: string;
    source_url?: string;
    company_logo?: string;
    job_type?: string;
    featured_job?: boolean;
    application_deadline?: string;
  },
  adminKey: string
) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  const isEditing = !!jobData.id;
  const skillsArray = jobData.skills
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const finalSlug = jobData.slug?.trim() ? slugify(jobData.slug) : slugify(`${jobData.title}-${jobData.company}`);

  const payload: any = {
    title: jobData.title.trim(),
    slug: finalSlug,
    company: jobData.company.trim(),
    location: jobData.location.trim(),
    category_id: jobData.category_id || null,
    salary: jobData.salary?.trim() || null,
    eligibility: jobData.eligibility.trim(),
    skills: skillsArray,
    description: jobData.description.trim(),
    apply_url: jobData.apply_url.trim(),
    source_name: jobData.source_name?.trim() || 'Company Website',
    source_url: jobData.source_url?.trim() || null,
    company_logo: jobData.company_logo?.trim() || null,
    job_type: jobData.job_type || 'full-time',
    featured_job: !!jobData.featured_job,
    application_deadline: jobData.application_deadline || null,
  };

  if (!payload.company_logo) {
    delete payload.company_logo;
  }

  try {
    let result;
    if (isEditing) {
      result = await supabase.from('jobs').update(payload).eq('id', jobData.id).select().single();
    } else {
      result = await supabase.from('jobs').insert([payload]).select().single();
    }

    // Fallback if company_logo or job_type column is missing in Supabase schema
    if (
      result.error &&
      (result.error.message?.includes('company_logo') ||
        result.error.message?.includes('job_type') ||
        result.error.code === 'PGRST204')
    ) {
      if (result.error.message?.includes('company_logo')) delete payload.company_logo;
      if (result.error.message?.includes('job_type')) {
        delete payload.job_type;
        // Ensure internship tag is preserved in eligibility if job_type column is absent in DB
        if (jobData.job_type === 'internship' && !payload.eligibility.toLowerCase().includes('intern')) {
          payload.eligibility = `${payload.eligibility} (Internship)`;
        }
      }

      if (isEditing) {
        result = await supabase.from('jobs').update(payload).eq('id', jobData.id).select().single();
      } else {
        result = await supabase.from('jobs').insert([payload]).select().single();
      }
    }

    if (result.error) throw result.error;

    // Trigger automated email alert to active subscribers for NEW job/internship postings
    if (!isEditing && result.data) {
      notifySubscribersNewJob(result.data).catch((err) => {
        console.error('Subscriber notification background trigger error:', err);
      });
    }

    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/internships');
    revalidatePath(`/jobs/${finalSlug}`);
    revalidatePath('/nandini');
    return { success: true, job: result.data };

  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to save job') };
  }
}

export async function deleteJob(id: string, adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  try {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/internships');
    revalidatePath('/nandini');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to delete job') };
  }
}

/* Subscriber Actions */

export async function addSubscriberAdmin(email: string, name: string, adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name ? name.trim() : '';

  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email: trimmedEmail, name: trimmedName, source: 'admin_manual', status: 'active' }])
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/nandini');
    return { success: true, subscriber: data };
  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to add subscriber') };
  }
}

export async function deleteSubscriberAdmin(id: string, adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  try {
    const { error } = await supabase.from('subscribers').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/nandini');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to delete subscriber') };
  }
}

export async function fetchSubscribersAdmin(adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, subscribers: data || [] };
  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to fetch subscribers') };
  }
}

export async function sendDigestBroadcastAction(jobIds: string[], customSubject: string, adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, count: 0, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  try {
    let query = supabase.from('jobs').select('*');
    if (jobIds && jobIds.length > 0) {
      query = query.in('id', jobIds);
    } else {
      query = query.order('created_at', { ascending: false }).limit(10);
    }

    const { data: jobs, error } = await query;
    if (error) throw error;
    if (!jobs || jobs.length === 0) {
      return { success: false, count: 0, error: 'No jobs found to include in the broadcast.' };
    }

    const { sendMultipleJobsDigest } = await import('@/lib/emailNotifier');
    const result = await sendMultipleJobsDigest(jobs, customSubject);
    return result;
  } catch (err: any) {
    return { success: false, count: 0, error: handleActionError(err, 'Failed to send digest broadcast') };
  }
}

export async function resetAllJobViewsAction(adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  try {
    const { error } = await supabase
      .from('jobs')
      .update({ views_count: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // update all

    if (error) throw error;

    revalidatePath('/nandini');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to reset view counts') };
  }
}





