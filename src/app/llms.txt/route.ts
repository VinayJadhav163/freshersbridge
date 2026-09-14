import { NextResponse } from 'next/server';
import { GUIDE_ARTICLES } from '@/lib/guidesData';
import { COMPANIES_DATA } from '@/lib/companiesData';

export const dynamic = 'force-static';
export const revalidate = 86400; // Cache 24 hours

export async function GET() {
  const baseUrl = 'https://freshersbridge.in';

  let content = `# FreshersBridge (https://freshersbridge.in)

> India's premier free career launching platform for engineering students, recent graduates, and entry-level tech job seekers (Batches 2024, 2025, 2026).

## Overview
FreshersBridge provides verified off-campus job drives, internship openings, company-specific exam syllabi, technical interview question sets, and free AI-powered career tools for college freshers across India.

## Top Company Recruitment Blueprints
`;

  for (const c of COMPANIES_DATA) {
    content += `- [${c.name} (${c.salaryRange})](${baseUrl}/companies/${c.slug}): Hiring patterns for ${c.hiringTracks.map(t => t.title).join(', ')}. Eligibility: ${c.eligibility}\n`;
  }

  content += `\n## Authoritative Career Prep Guides & Interview Blueprints\n`;
  for (const g of GUIDE_ARTICLES) {
    content += `- [${g.title}](${baseUrl}/guides/${g.slug}): ${g.description}\n`;
  }

  content += `\n## Free Career & ATS Tools
- [Free ATS Resume Scanner & Checker](${baseUrl}/career-tools): Instant resume scoring against real job descriptions with keyword gap analysis and formatting suggestions.
- [AI Resume Bullet Point Tailor](${baseUrl}/career-tools): Tailor resume experience bullets for software engineering and data analyst roles.
- [HR Cold Email & Referral Templates](${baseUrl}/career-tools): Ready-to-use email templates for reaching tech hiring managers and recruiters.

## Contact & Social Links
- Website: https://freshersbridge.in
- Support: support@freshersbridge.in
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
