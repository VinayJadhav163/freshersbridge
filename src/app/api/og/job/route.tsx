import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

// We initialize a separate light client for Edge runtime if needed,
// using the environment variables directly to ensure compatibility.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    let title = 'Find Your First Tech Job';
    let company = 'FreshersBridge.in';
    let location = 'India';
    let eligibility = 'BCA, MCA, BTech, BSc CS';
    let salary = 'Best in Industry';

    if (slug) {
      const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (job) {
        title = job.title;
        company = job.company;
        location = job.location;
        eligibility = job.eligibility;
        salary = job.salary || 'Not Disclosed';
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#090d16',
            backgroundImage: 'radial-gradient(circle at 75% 20%, #4f46e522 0%, transparent 50%), radial-gradient(circle at 10% 80%, #ec489911 0%, transparent 40%)',
            padding: '80px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Top Brand Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                height: '40px',
                width: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              F
            </div>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#ffffff',
                letterSpacing: '-0.5px',
              }}
            >
              Freshers<span style={{ color: '#6366f1' }}>Bridge</span>
            </span>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginTop: '40px',
              marginBottom: '40px',
            }}
          >
            <span
              style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#6366f1',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {company}
            </span>
            <span
              style={{
                fontSize: '56px',
                fontWeight: '800',
                color: '#ffffff',
                lineHeight: 1.2,
                maxWidth: '900px',
              }}
            >
              {title}
            </span>
          </div>

          {/* Badges Footer */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                padding: '12px 20px',
                color: '#94a3b8',
                fontSize: '18px',
                fontWeight: '600',
                border: '1px solid #374151',
              }}
            >
              📍 {location}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                padding: '12px 20px',
                color: '#94a3b8',
                fontSize: '18px',
                fontWeight: '600',
                border: '1px solid #374151',
              }}
            >
              🎓 {eligibility}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '12px',
                padding: '12px 20px',
                color: '#a5b4fc',
                fontSize: '18px',
                fontWeight: '600',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              💰 {salary}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('Failed to generate OG image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
