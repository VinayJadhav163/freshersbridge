import { supabase } from '@/lib/supabase';

export const revalidate = 43200; // Cache feed for 12 hours (avoids Vercel free-tier write limits)

export async function GET() {
  const baseUrl = 'https://freshersbridge.in';

  let jobs = [];
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*, categories(*)')
      .order('created_at', { ascending: false })
      .limit(50);
    jobs = data || [];
  } catch (err) {
    console.error('Error fetching jobs for RSS feed:', err);
  }

  const feedItemsXml = jobs
    .map((job: any) => {
      const title = job.title || 'Job Opening';
      const company = job.company || 'Company';
      const link = `${baseUrl}/jobs/${job.slug}`;
      const description = job.description || `${title} at ${company}. Apply now on FreshersBridge.`;
      const pubDate = new Date(job.created_at || Date.now()).toUTCString();

      return `    <item>
      <title><![CDATA[${title} at ${company}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FreshersBridge - Latest Fresher Jobs &amp; Internships</title>
    <link>${baseUrl}</link>
    <description>Daily verified fresher jobs, IT off-campus recruitment drives, and internships for 2024, 2025, and 2026 batch graduates.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${feedItemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=3600',
    },
  });
}
