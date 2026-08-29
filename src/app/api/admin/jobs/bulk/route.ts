import { NextRequest, NextResponse } from 'next/server';
import { bulkUploadJobsAction } from '@/app/admin/actions';

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

    // Call fast chunked bulk ingestion action with duplicate prevention
    const res = await bulkUploadJobsAction(jobs, adminKey);

    if (res.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully ingested and published ${res.count} jobs directly into database!`,
        insertedCount: res.count,
        total: res.total,
      });
    } else {
      return NextResponse.json({ success: false, error: res.error }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
