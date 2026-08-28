import { NextRequest, NextResponse } from 'next/server';
import { saveJob } from '@/app/admin/actions';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('x-admin-key');
    const body = await req.json();
    const adminKey = authHeader || body.admin_key;

    const serverKey = process.env.ADMIN_ACCESS_KEY;
    if (!serverKey || adminKey !== serverKey) {
      return NextResponse.json({ success: false, error: 'Unauthorized API Access Key.' }, { status: 401 });
    }

    const jobs = body.jobs;
    if (!Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json({ success: false, error: 'No jobs array provided.' }, { status: 400 });
    }

    // Fetch existing categories from Supabase to resolve category_slug to category_id
    const { data: categories } = await supabase.from('categories').select('id, slug');
    const catMap = new Map<string, string>();
    if (categories) {
      categories.forEach((cat) => {
        catMap.set(cat.slug.toLowerCase(), cat.id);
      });
    }

    let insertedCount = 0;
    let failedCount = 0;

    for (const job of jobs) {
      if (!job.title || !job.company || !job.location || !job.apply_url) {
        failedCount++;
        continue;
      }

      let categoryId = '';
      if (job.category_slug && catMap.has(job.category_slug.toLowerCase())) {
        categoryId = catMap.get(job.category_slug.toLowerCase())!;
      } else if (categories && categories.length > 0) {
        categoryId = categories[0].id;
      }

      const res = await saveJob(
        {
          title: job.title,
          company: job.company,
          location: job.location,
          category_id: categoryId,
          salary: job.salary || 'Not Disclosed',
          eligibility: job.eligibility || 'Any Graduate / Freshers',
          skills: job.skills || 'Software Engineering',
          description: job.description || `${job.title} position at ${job.company}`,
          apply_url: job.apply_url,
          source_name: job.source_name || 'Automated Scraper',
          source_url: job.source_url || job.apply_url,
          job_type: job.title.toLowerCase().includes('intern') ? 'internship' : 'full-time',
          featured_job: false,
        },
        adminKey
      );

      if (res.success) {
        insertedCount++;
      } else {
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Ingested ${insertedCount} jobs successfully. Failed: ${failedCount}`,
      insertedCount,
      failedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
