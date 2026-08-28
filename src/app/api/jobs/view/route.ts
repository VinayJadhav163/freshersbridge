import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Missing jobId' }, { status: 400 });
    }

    // Increment views_count safely using RPC or fetch+update
    const { data: job } = await supabase
      .from('jobs')
      .select('views_count')
      .eq('id', jobId)
      .single();

    if (job) {
      await supabase
        .from('jobs')
        .update({ views_count: (job.views_count || 0) + 1 })
        .eq('id', jobId);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
