import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { clearDataCache } from '@/lib/dataCache';

export async function POST(req: NextRequest) {
  try {
    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Missing jobId' }, { status: 400 });
    }

    // Increment views_count safely in Supabase
    const { data: job } = await supabase
      .from('jobs')
      .select('views_count')
      .eq('id', jobId)
      .single();

    if (job) {
      const nextViews = (job.views_count || 0) + 1;
      await supabase
        .from('jobs')
        .update({ views_count: nextViews })
        .eq('id', jobId);

      // Invalidate memory cache so SSR queries immediately reflect new view count
      clearDataCache('job:');
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
