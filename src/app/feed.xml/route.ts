import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Cache feed for 1 hour

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
    .map((job) => {
      const jobUrl = `${baseUrl}/jobs/${job.slug}`;
      const pubDate = new Date(job.created_at).toUTCString();
      const description = `Company: ${job.company} | Location: ${job.location} | Eligibility: ${job.eligibility} | Salary: ${job.salary || 'Not Disclosed'}

Required Skills: ${job.skills?.join(', ') || ''}

Description:
${job.description}`;

      return `    <item>
      <title><![CDATA[${job.title} at ${job.company}]]></title>
      <link>${jobUrl}</link>
      <guid isPermaLink="true">${jobUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${job.categories?.name || 'Job'}]]></category>
      <description><![CDATA[${description}]]></description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FreshersBridge | Off-Campus Jobs &amp; Internships for Freshers</title>
    <link>${baseUrl}</link>
    <description>Find your first tech job. FreshersBridge lists handpicked entry-level off-campus jobs, software developer internships, and fresher roles for college graduates.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${feedItemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
