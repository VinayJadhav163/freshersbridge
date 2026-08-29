'use server';

import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { notifySubscribersNewJob } from '@/lib/emailNotifier';
import { getAdminAuthToken, verifyAdminKey } from '@/lib/adminAuth';
import { clearDataCache } from '@/lib/dataCache';

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
    clearDataCache();
    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/internships');
    revalidatePath('/nandini');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to delete job') };
  }
}

export async function deleteAllJobsAction(adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (error) throw error;

    clearDataCache();
    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/internships');
    revalidatePath('/nandini');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to delete all jobs') };
  }
}

export async function deleteSelectedJobsAction(jobIds: string[], adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  if (!Array.isArray(jobIds) || jobIds.length === 0) {
    return { success: false, error: 'No job IDs provided to delete.' };
  }

  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .in('id', jobIds);

    if (error) throw error;

    clearDataCache();
    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/internships');
    revalidatePath('/nandini');
    return { success: true, count: jobIds.length };
  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to delete selected jobs') };
  }
}

export async function deleteJobsByDateAction(
  options: { targetDate: string; mode: 'exact' | 'before'; jobType?: 'all' | 'job' | 'internship' },
  adminKey: string
) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  if (!options.targetDate) {
    return { success: false, error: 'Please specify a target date.' };
  }

  try {
    const startOfDay = new Date(`${options.targetDate}T00:00:00.000Z`).toISOString();
    const endOfDay = new Date(`${options.targetDate}T23:59:59.999Z`).toISOString();

    let query = supabase.from('jobs').delete();

    if (options.mode === 'exact') {
      query = query.gte('created_at', startOfDay).lte('created_at', endOfDay);
    } else {
      query = query.lte('created_at', endOfDay);
    }

    if (options.jobType === 'internship') {
      query = query.ilike('title', '%intern%');
    } else if (options.jobType === 'job') {
      query = query.not('title', 'ilike', '%intern%');
    }

    const { error } = await query;
    if (error) throw error;

    clearDataCache();
    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/internships');
    revalidatePath('/nandini');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to delete jobs by date') };
  }
}

export async function bulkUploadJobsAction(rawJobs: any[], adminKey: string) {
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: 'Unauthorized: Invalid Admin Access Key.' };
  }

  if (!Array.isArray(rawJobs) || rawJobs.length === 0) {
    return { success: false, error: 'No jobs found in uploaded CSV.' };
  }

  try {
    // 1. Fetch categories to map slugs
    const { data: categories } = await supabase.from('categories').select('id, slug');
    const catMap = new Map<string, string>();
    if (categories) {
      categories.forEach((c) => catMap.set(c.slug.toLowerCase(), c.id));
    }
    const defaultCatId = categories && categories.length > 0 ? categories[0].id : null;

    // 2. Fetch existing jobs to avoid duplicate insertions
    const { data: existingJobs } = await supabase.from('jobs').select('slug, title, company, apply_url');
    const existingSlugs = new Set<string>();
    const existingCompanyTitles = new Set<string>();
    const existingUrls = new Set<string>();

    if (existingJobs) {
      existingJobs.forEach((j) => {
        if (j.slug) existingSlugs.add(j.slug.toLowerCase());
        if (j.company && j.title) {
          const compClean = j.company.toLowerCase().replace(/[^a-z0-9]/g, '');
          const titleClean = j.title.toLowerCase().replace(/[^a-z0-9]/g, '');
          existingCompanyTitles.add(`${compClean}:${titleClean}`);
        }
        if (j.apply_url) {
          existingUrls.add(j.apply_url.trim().toLowerCase());
        }
      });
    }

    // 3. Prepare normalized & deduplicated job payloads
    const payloads: any[] = [];
    const usedSlugs = new Set<string>(existingSlugs);

    for (const item of rawJobs) {
      const title = (item.title || '').trim();
      const company = (item.company || '').trim();
      const location = (item.location || '').trim();
      const applyUrl = (item.apply_url || item.url || item.link || '').trim();

      if (!title || !company || !applyUrl) {
        continue;
      }

      // Check for duplicates against existing DB and current batch
      const compClean = company.toLowerCase().replace(/[^a-z0-9]/g, '');
      const titleClean = title.toLowerCase().replace(/[^a-z0-9]/g, '');
      const compTitleKey = `${compClean}:${titleClean}`;
      const urlClean = applyUrl.toLowerCase();

      if (existingCompanyTitles.has(compTitleKey) || existingUrls.has(urlClean)) {
        continue; // Skip duplicate listing
      }
      existingCompanyTitles.add(compTitleKey);
      existingUrls.add(urlClean);

      let baseSlug = slugify(`${title}-${company}`);
      let slug = baseSlug;
      let counter = 1;
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      usedSlugs.add(slug);

      let catId = defaultCatId;
      if (item.category_slug && catMap.has(item.category_slug.trim().toLowerCase())) {
        catId = catMap.get(item.category_slug.trim().toLowerCase())!;
      }

      const skillsArray = typeof item.skills === 'string'
        ? item.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        : Array.isArray(item.skills)
        ? item.skills
        : ['Freshers', 'Graduate'];

      payloads.push({
        title,
        slug,
        company,
        location: location || 'India / Remote',
        category_id: catId,
        salary: item.salary?.trim() || 'Best in Industry',
        eligibility: item.eligibility?.trim() || 'Any Graduate (2024, 2025, 2026 Batch)',
        skills: skillsArray.length > 0 ? skillsArray : ['Engineering', 'Fresher'],
        description: item.description?.trim() || `${title} opening at ${company}. Apply online.`,
        apply_url: applyUrl,
        source_name: item.source_name?.trim() || 'Campus Drive',
        source_url: item.source_url?.trim() || applyUrl,
        job_type: item.job_type || (title.toLowerCase().includes('intern') ? 'internship' : 'full-time'),
        featured_job: String(item.featured_job).toLowerCase() === 'true',
        views_count: 0,
      });
    }

    if (payloads.length === 0) {
      return { success: true, count: 0, message: 'All scraped jobs are already up-to-date in the database. 0 duplicates added.' };
    }

    // 3. Batch insert in chunks of 50
    const chunkSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < payloads.length; i += chunkSize) {
      const chunk = payloads.slice(i, i + chunkSize);
      const { data, error } = await supabase.from('jobs').insert(chunk).select('id');
      if (error) {
        // Retry without job_type if column doesn't exist in Supabase
        const sanitizedChunk = chunk.map(p => {
          const clone = { ...p };
          delete clone.job_type;
          return clone;
        });
        const retry = await supabase.from('jobs').insert(sanitizedChunk).select('id');
        if (retry.error) {
          console.error('Supabase chunk insert error:', retry.error);
        } else {
          insertedCount += retry.data?.length || 0;
        }
      } else {
        insertedCount += data?.length || 0;
      }
    }

    clearDataCache();
    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath('/internships');
    revalidatePath('/nandini');

    return { success: true, count: insertedCount, total: payloads.length };
  } catch (err: any) {
    return { success: false, error: handleActionError(err, 'Failed to bulk upload jobs') };
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





