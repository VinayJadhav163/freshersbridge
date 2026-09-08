import { NextResponse } from 'next/server';
import { getATSAnalytics, recordATSScan } from '@/lib/atsAnalytics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const data = await getATSAnalytics();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const type = body?.type === 'tailor' ? 'tailor' : 'scan';
    const updated = await recordATSScan(type);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
