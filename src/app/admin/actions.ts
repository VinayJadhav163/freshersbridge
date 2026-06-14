'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Helper to verify the admin key
function verifyAdminKey(key: string): boolean {
  const serverKey = process.env.ADMIN_ACCESS_KEY || 'freshersbridgeadmin2026';
  return key === serverKey;
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
    revalidatePath('/admin');
    return { success: true, category: data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create category' };
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
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete category' };
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
    featured_job: !!jobData.featured_job,
    application_deadline: jobData.application_deadline || null,
  };

  try {
    let result;
    if (isEditing) {
      result = await supabase.from('jobs').update(payload).eq('id', jobData.id).select().single();
    } else {
      result = await supabase.from('jobs').insert([payload]).select().single();
    }

    if (result.error) throw result.error;

    revalidatePath('/');
    revalidatePath('/jobs');
    revalidatePath(`/jobs/${finalSlug}`);
    revalidatePath('/admin');
    return { success: true, job: result.data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save job' };
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
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete job' };
  }
}
