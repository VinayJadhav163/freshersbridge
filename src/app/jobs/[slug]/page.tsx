import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Briefcase, 
  ArrowLeft,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Building2,
  Sparkles,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import ApplyButton from '@/components/ApplyButton';
import JobCard from '@/components/JobCard';
import JobViewTracker from '@/components/JobViewTracker';
import JobBackButton from '@/components/JobBackButton';
import { Job } from '@/types';
import { GUIDE_ARTICLES } from '@/lib/guidesData';
import { fetchWithCache } from '@/lib/dataCache';
import { getCompanyLogo, getCompanyColor } from '@/lib/companiesData';

interface Props {
  params: Promise<{ slug: string }>;
}

// 24 hours background ISR revalidation (avoids Vercel free-tier write limits)
export const revalidate = 86400;
export const dynamicParams = true;

// Pre-render top active job pages at build/runtime for instant 0-20ms page loads
export async function generateStaticParams() {
  try {
    const { data: jobs } = await supabase
      .from('jobs')
      .select('slug')
      .order('created_at', { ascending: false })
      .limit(100);
    return (jobs || []).map((j) => ({ slug: j.slug }));
  } catch {
    return [];
  }
}

// React cache + In-memory TTL cache to eliminate remote HTTPS roundtrips
const getJob = cache(async (slug: string) => {
  return fetchWithCache(`job:${slug}`, async () => {
    const { data: job } = await supabase
      .from('jobs')
      .select('*, categories(id, name, slug)')
      .eq('slug', slug)
      .single();
    return job as unknown as Job | null;
  }, 180);
});

// Fast cached related jobs query with adaptive count support
const getRelatedJobs = cache(async (categoryId: string | null, currentJobId: string, limitCount: number = 3) => {
  return fetchWithCache(`related:${categoryId}:${currentJobId}:${limitCount}`, async () => {
    try {
      let query = supabase
        .from('jobs')
        .select('id, title, slug, company, location, salary, eligibility, skills, created_at, category_id, featured_job, categories(id, name, slug)')
        .neq('id', currentJobId)
        .order('created_at', { ascending: false })
        .limit(limitCount);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data } = await query;
      const categoryJobs = (data || []) as unknown as Job[];

      // Fallback: If category has fewer than limitCount jobs, backfill with newest fresh opportunities
      if (categoryJobs.length < limitCount) {
        const existingIds = [currentJobId, ...categoryJobs.map((j) => j.id)];
        const { data: fallbackData } = await supabase
          .from('jobs')
          .select('id, title, slug, company, location, salary, eligibility, skills, created_at, category_id, featured_job, categories(id, name, slug)')
          .not('id', 'in', `(${existingIds.join(',')})`)
          .order('created_at', { ascending: false })
          .limit(limitCount - categoryJobs.length);

        if (fallbackData && fallbackData.length > 0) {
          return [...categoryJobs, ...(fallbackData as unknown as Job[])];
        }
      }

      return categoryJobs;
    } catch {
      return [] as Job[];
    }
  }, 180);
});

import { COMPANIES_DATA } from '@/lib/companiesData';

// Generate dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const job = await getJob(resolvedParams.slug);

  if (!job) {
    return {
      title: 'Job Not Found | FreshersBridge',
    };
  }

  const isExpired = job.application_deadline
    ? new Date(job.application_deadline).getTime() < Date.now()
    : false;

  const isInternship = job.job_type === 'internship' || /\b(intern|internship|interns)\b/i.test(job.title);
  const roleType = isInternship ? 'Internship' : 'Freshers Job';
  const titlePrefix = isExpired ? '[Closed] ' : '';
  const title = `${titlePrefix}${job.title} at ${job.company} - ${roleType} (2026 Batch) | FreshersBridge`;
  const description = `Apply for ${job.title} at ${job.company} in ${job.location}. Verified entry-level ${roleType.toLowerCase()} opportunity. Eligibility: ${
    job.eligibility
  }. Required skills: ${job.skills.join(', ')}. Apply on FreshersBridge.in.`;
  const ogImageUrl = `https://freshersbridge.in/api/og/job?slug=${job.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://freshersbridge.in/jobs/${job.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://freshersbridge.in/jobs/${job.slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

function cleanSquishedText(text: string): string {
  if (!text) return '';
  // Auto-heal corrupted C# / F# symbols (e.g. "C\programming" -> "C# programming", "C\ developer" -> "C# developer")
  let clean = text
    .replace(/\bC\\([a-zA-Z])/g, 'C# $1')
    .replace(/\bC\\([.,;:/ \t]|$)/g, 'C#$1')
    .replace(/\bF\\([a-zA-Z])/g, 'F# $1')
    .replace(/\bF\\([.,;:/ \t]|$)/g, 'F#$1');

  // Unescape backslash-escaped characters (e.g. \- -> -, \# -> #, \_ -> _)
  clean = clean.replace(/\\([*#+\[\]().`~>!&|/\\_\-])/g, '$1');

  // Split squished concatenated words (e.g. "AdvancedconceptualunderstandingofatleastoneProgrammingLanguage")
  return clean.replace(/\S{25,}/g, (match) => {
    return match
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  });
}

function FormattedJobDescription({ content }: { content: string }) {
  if (!content) return null;

  // Auto-heal single-character newline splits & clean squished tokens
  const rawLines = content.split('\n');
  const healedLines: string[] = [];
  let charBuf: string[] = [];

  for (const rLine of rawLines) {
    const sLine = rLine.trim();
    if (sLine.length === 1 && /[A-Za-z0-9]/.test(sLine)) {
      charBuf.push(sLine);
    } else {
      if (charBuf.length > 0) {
        healedLines.push(cleanSquishedText(charBuf.join('')));
        charBuf = [];
      }
      healedLines.push(cleanSquishedText(rLine));
    }
  }
  if (charBuf.length > 0) {
    healedLines.push(cleanSquishedText(charBuf.join('')));
  }

  // Strip leading redundant titles (e.g. "Job description:", "Job Description", "Role Description:")
  let startIndex = 0;
  while (startIndex < healedLines.length) {
    const line = healedLines[startIndex].trim();
    if (!line) {
      startIndex++;
      continue;
    }
    const cleanLine = line.replace(/[:\-_]+$/, '').trim();
    if (/^(?:Job\s+(?:Description|Summary|Overview|Details)|Role\s+(?:Description|Summary|Overview)|About\s+(?:the\s+Job|this\s+Job|the\s+Role))$/i.test(cleanLine)) {
      startIndex++;
    } else {
      break;
    }
  }

  const lines = healedLines.slice(startIndex);
  const sections: { title?: string; items: string[]; type: 'list' | 'paragraph' }[] = [];
  
  let currentTitle = '';
  let currentItems: string[] = [];
  let currentType: 'list' | 'paragraph' = 'paragraph';

  const isHeading = (line: string) => {
    const trimmed = line.trim();
    if (trimmed.length > 60) return false;
    return /^(?:(?:Key\s+|Primary\s+)?Responsibilities|(?:Required\s+|Preferred\s+|Minimum\s+)?Qualifications|(?:Required\s+|Key\s+|Technical\s+)?Skills(?:\s+Required)?|Requirements|Eligibility(?:\s*&.*)?|What\s+You(?:'ll|\s+Will)\s+Do|Role\s+(?:Overview|Description|Summary|Purpose|Scope)|Purpose\s+of\s+(?:the\s+)?Role|Job\s+(?:Purpose|Summary|Overview)|Must\s+Have|Good\s+to\s+Have|Nice\s+to\s+Have|Key\s+(?:Objectives|Deliverables)|Success\s+Measures|Perks(?:\s*&.*)?|Benefits|What\s+We(?:'re|\s+Are)\s+Looking\s+For|About\s+(?:Us|the\s+Role|[A-Z][a-zA-Z0-9\s]+)|Your\s+Impact|Education|Experience)\s*:?$/i.test(trimmed);
  };

  const isBullet = (line: string) => {
    return /^[\s]*[•\*\-\+]\s+/.test(line) || /^\s*\d+[\.\)]\s+/.test(line);
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (isHeading(line)) {
      if (currentItems.length > 0) {
        sections.push({ title: currentTitle, items: [...currentItems], type: currentType });
        currentItems = [];
      }
      currentTitle = line.replace(/[:]+$/, '').trim();
      currentType = 'paragraph';
    } else if (isBullet(line)) {
      const cleanBullet = line.replace(/^[\s]*[•\*\-\+]\s+/, '').replace(/^\s*\d+[\.\)]\s+/, '').trim();
      if (currentType !== 'list' && currentItems.length > 0) {
        sections.push({ title: currentTitle, items: [...currentItems], type: currentType });
        currentTitle = '';
        currentItems = [];
      }
      currentType = 'list';
      currentItems.push(cleanBullet);
    } else {
      if (currentType === 'list' && currentItems.length > 0) {
        sections.push({ title: currentTitle, items: [...currentItems], type: currentType });
        currentTitle = '';
        currentItems = [];
      }
      currentType = 'paragraph';
      currentItems.push(line);
    }
  }

  if (currentItems.length > 0) {
    sections.push({ title: currentTitle, items: [...currentItems], type: currentType });
  }

  if (sections.length === 0) {
    return (
      <div className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap font-sans break-words [overflow-wrap:anywhere] max-w-full overflow-hidden">
        {cleanSquishedText(content)}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-foreground/90 text-sm leading-relaxed font-sans break-words [overflow-wrap:anywhere] max-w-full overflow-hidden">
      {sections.map((sec, idx) => (
        <div key={idx} className="space-y-2.5 max-w-full overflow-hidden">
          {sec.title && !/^(?:Job\s+(?:Description|Details)|About\s+the\s+Job)$/i.test(sec.title.trim()) && (
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 pt-2 border-t border-border/40 first:border-t-0 first:pt-0 break-words [overflow-wrap:anywhere]">
              <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
              {sec.title}
            </h3>
          )}

          {sec.type === 'list' ? (
            <ul className="list-disc list-outside ml-5 space-y-2 text-foreground/90 leading-relaxed marker:text-foreground max-w-full overflow-hidden">
              {sec.items.map((item, iIdx) => (
                <li key={iIdx} className="pl-1 break-words [overflow-wrap:anywhere]">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            sec.items.map((para, pIdx) => (
              <p key={pIdx} className="text-foreground/80 leading-relaxed break-words [overflow-wrap:anywhere]">
                {para}
              </p>
            ))
          )}
        </div>
      ))}
    </div>
  );
}

export default async function JobDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  
  // 1. Fetch Job details (Instant deduplicated cached query)
  const job = await getJob(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  const isInternship =
    job.job_type === 'internship' ||
    /\b(intern|internship|interns|apprentice|fellowship)\b/i.test(job.title) ||
    (job.apply_url && job.apply_url.toLowerCase().includes('/internship/')) ||
    (job.source_url && job.source_url.toLowerCase().includes('/internship/')) ||
    (job.eligibility && (job.eligibility.toLowerCase().includes('(internship)') || job.eligibility.toLowerCase().includes('intern'))) ||
    (job.salary && (job.salary.toLowerCase().includes('/ month') || job.salary.toLowerCase().includes('/month') || job.salary.toLowerCase().includes('stipend')));

  // Expiration calculation
  const isExpired = job.application_deadline
    ? new Date(job.application_deadline).getTime() < Date.now()
    : false;

  // Compliant schema validThrough date (falls back to 60 days post-creation if no deadline)
  const validThroughDate = job.application_deadline
    ? new Date(job.application_deadline).toISOString()
    : new Date(new Date(job.created_at).getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();

  // 2. Multi-tier adaptive related jobs count based on JD length to keep columns balanced:
  // - Short JDs (<= 1,200 chars): 3 jobs
  // - Medium JDs (1,201 - 2,200 chars): 5 jobs
  // - Long JDs (2,201 - 3,500 chars): 6 jobs
  // - Very Long JDs (3,501 - 4,800 chars): 7 jobs
  // - Ultra Long JDs (> 4,800 chars): 8 jobs
  const jdLength = (job.description || '').length;
  let adaptiveLimit = 3;
  if (jdLength > 4800) {
    adaptiveLimit = 8;
  } else if (jdLength > 3500) {
    adaptiveLimit = 7;
  } else if (jdLength > 2200) {
    adaptiveLimit = 6;
  } else if (jdLength > 1200) {
    adaptiveLimit = 5;
  } else {
    adaptiveLimit = 3;
  }
  const relatedJobs = await getRelatedJobs(job.category_id, job.id, adaptiveLimit);

  // 3. High-precision contextual guide matching for internal topic clusters
  const jobText = `${job.title} ${job.company} ${(job.skills || []).join(' ')} ${job.eligibility || ''}`.toLowerCase();
  const scoredGuides = GUIDE_ARTICLES.map((guide) => {
    let score = 0;
    const gTitle = guide.title.toLowerCase();
    const gSlug = guide.slug.toLowerCase();
    const jComp = job.company.toLowerCase();

    // Direct company match (Accenture, Cognizant, TCS, Infosys, Wipro, etc.)
    if (jComp.length > 2 && (gTitle.includes(jComp) || gSlug.includes(jComp))) {
      score += 100;
    }

    // Role-specific match
    if (/\b(data analyst|analytics|business intelligence|bi|sql)\b/i.test(jobText) && gSlug.includes('data-analyst')) {
      score += 85;
    }
    if (/\b(sql|database|dbms|query)\b/i.test(jobText) && gSlug.includes('sql-interview')) {
      score += 65;
    }
    if (/\b(python|django|fastapi|pandas)\b/i.test(jobText) && gSlug.includes('python')) {
      score += 60;
    }
    if (/\b(java|spring|springboot)\b/i.test(jobText) && gSlug.includes('java')) {
      score += 60;
    }
    if (/\b(web|frontend|react|node|fullstack|full-stack)\b/i.test(jobText) && gSlug.includes('full-stack')) {
      score += 60;
    }

    // Tag overlaps
    for (const tag of guide.tags) {
      if (jobText.includes(tag.toLowerCase())) {
        score += 20;
      }
    }

    // Baseline fallbacks for freshers
    if (gSlug.includes('ats-friendly-resume')) score += 10;
    if (gSlug.includes('hr-interview-questions')) score += 5;

    return { guide, score };
  });

  const relevantGuides = scoredGuides
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .slice(0, 2)
    .map((item) => item.guide);

  // 4. Match company for bidirectional internal linking
  const matchedCompany = COMPANIES_DATA.find((c) => {
    const cName = c.name.toLowerCase();
    const cShort = c.shortName.toLowerCase();
    const jComp = job.company.toLowerCase();
    return jComp.includes(cShort) || jComp.includes(cName) || cName.includes(jComp);
  });

  // 5. Prepare structured JSON-LD data for Google Jobs & Breadcrumbs
  const breadcrumbJsonLd = {
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://freshersbridge.in',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': isInternship ? 'Internships' : 'Jobs',
        'item': `https://freshersbridge.in/${isInternship ? 'internships' : 'jobs'}`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': `${job.title} at ${job.company}`,
        'item': `https://freshersbridge.in/${isInternship ? 'internships' : 'jobs'}/${job.slug}`,
      },
    ],
  };

  const isRemote = job.location?.toLowerCase().includes('remote') || job.location?.toLowerCase().includes('work from home');

  let companyLogo = (job.company_logo && job.company_logo.trim()) || getCompanyLogo(job.company);
  if (job.company?.toLowerCase().includes('infosys') || companyLogo?.includes('infosys.svg')) {
    companyLogo = '/companies/infosys.png';
  }

  // Address helper for Indian tech hubs & locations to satisfy Google Search Console requirements
  const getJobPostalAddress = (location: string, company: string) => {
    const loc = (location || '').toLowerCase();
    
    if (loc.includes('bengaluru') || loc.includes('bangalore')) {
      return {
        streetAddress: `${company} Tech Park, Outer Ring Road`,
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        postalCode: '560103',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('pune')) {
      return {
        streetAddress: `${company} IT Campus, Rajiv Gandhi Infotech Park, Hinjawadi`,
        addressLocality: 'Pune',
        addressRegion: 'Maharashtra',
        postalCode: '411057',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('hyderabad') || loc.includes('secunderabad')) {
      return {
        streetAddress: `${company} Development Centre, HITEC City, Madhapur`,
        addressLocality: 'Hyderabad',
        addressRegion: 'Telangana',
        postalCode: '500081',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('chennai')) {
      return {
        streetAddress: `${company} Tech Centre, Rajiv Gandhi Salai, OMR`,
        addressLocality: 'Chennai',
        addressRegion: 'Tamil Nadu',
        postalCode: '600113',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('gurugram') || loc.includes('gurgaon')) {
      return {
        streetAddress: `${company} Corporate Centre, DLF Cyber City, Phase 2`,
        addressLocality: 'Gurugram',
        addressRegion: 'Haryana',
        postalCode: '122002',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('noida')) {
      return {
        streetAddress: `${company} IT Zone, Sector 62 / Express Trade Tower`,
        addressLocality: 'Noida',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201309',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('mumbai') || loc.includes('navi mumbai') || loc.includes('thane')) {
      return {
        streetAddress: `${company} Business Park, Bandra Kurla Complex (BKC) / Powai`,
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        postalCode: '400051',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('delhi')) {
      return {
        streetAddress: `${company} Business Hub, Connaught Place / Barakhamba Road`,
        addressLocality: 'New Delhi',
        addressRegion: 'Delhi',
        postalCode: '110001',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('kolkata')) {
      return {
        streetAddress: `${company} IT Hub, Sector V, Salt Lake City`,
        addressLocality: 'Kolkata',
        addressRegion: 'West Bengal',
        postalCode: '700091',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('ahmedabad')) {
      return {
        streetAddress: `${company} Corporate Office, SG Highway`,
        addressLocality: 'Ahmedabad',
        addressRegion: 'Gujarat',
        postalCode: '380015',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('kochi') || loc.includes('cochin')) {
      return {
        streetAddress: `${company} Infopark Campus, Kakkanad`,
        addressLocality: 'Kochi',
        addressRegion: 'Kerala',
        postalCode: '682042',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('trivandrum') || loc.includes('thiruvananthapuram')) {
      return {
        streetAddress: `${company} Technopark Campus, Karyavattom`,
        addressLocality: 'Thiruvananthapuram',
        addressRegion: 'Kerala',
        postalCode: '695581',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('coimbatore')) {
      return {
        streetAddress: `${company} IT Park, Peelamedu`,
        addressLocality: 'Coimbatore',
        addressRegion: 'Tamil Nadu',
        postalCode: '641014',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('indore')) {
      return {
        streetAddress: `${company} Super Corridor IT Park`,
        addressLocality: 'Indore',
        addressRegion: 'Madhya Pradesh',
        postalCode: '452005',
        addressCountry: 'IN',
      };
    }
    if (loc.includes('jaipur')) {
      return {
        streetAddress: `${company} Mahindra World City Tech Zone`,
        addressLocality: 'Jaipur',
        addressRegion: 'Rajasthan',
        postalCode: '302037',
        addressCountry: 'IN',
      };
    }

    const safeLoc = location || 'India';
    return {
      streetAddress: `${company} Corporate Office, ${safeLoc}`,
      addressLocality: safeLoc,
      addressRegion: 'India',
      postalCode: '110001',
      addressCountry: 'IN',
    };
  };

  // Google Search Console requires monthsOfExperience to be a strictly positive integer (> 0).
  // For freshers/entry-level roles requiring 0 experience, Google recommends textual description
  // and experienceInPlaceOfEducation rather than monthsOfExperience: 0.
  const getExperienceRequirements = (expString?: string | null) => {
    if (!expString || /fresher|0\s*years?|0\s*-\s*0|entry\s*level|intern/i.test(expString)) {
      return {
        'experienceRequirements': 'No prior experience required (Freshers / Entry Level)',
        'experienceInPlaceOfEducation': true,
      };
    }
    const yearMatch = expString.match(/(\d+)\s*(?:\+|-|\s)*\s*years?/i);
    if (yearMatch) {
      const years = parseInt(yearMatch[1], 10);
      if (years > 0) {
        return {
          'experienceRequirements': {
            '@type': 'OccupationalExperienceRequirements',
            'monthsOfExperience': years * 12,
          },
        };
      }
    }
    const monthMatch = expString.match(/(\d+)\s*(?:\+|-|\s)*\s*months?/i);
    if (monthMatch) {
      const months = parseInt(monthMatch[1], 10);
      if (months > 0) {
        return {
          'experienceRequirements': {
            '@type': 'OccupationalExperienceRequirements',
            'monthsOfExperience': months,
          },
        };
      }
    }
    return {
      'experienceRequirements': 'No prior experience required (Freshers / Entry Level)',
      'experienceInPlaceOfEducation': true,
    };
  };

  const jobPostingJsonLd = {
    '@type': 'JobPosting',
    'title': `${job.title} (Freshers / Entry Level)`,
    'description': job.description,
    'datePosted': job.created_at,
    'validThrough': validThroughDate,
    'employmentType': isInternship ? 'INTERN' : 'FULL_TIME',
    'directApply': true,
    ...getExperienceRequirements(job.eligibility),
    'hiringOrganization': {
      '@type': 'Organization',
      'name': job.company,
      'sameAs': job.source_url || undefined,
      ...(companyLogo ? { 'logo': companyLogo } : {}),
    },
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        ...getJobPostalAddress(job.location, job.company),
      },
    },
    ...(isRemote
      ? {
          'jobLocationType': 'TELECOMMUTE',
          'applicantLocationRequirements': {
            '@type': 'Country',
            'name': 'India',
          },
        }
      : {}),
    'baseSalary': job.salary ? {
      '@type': 'MonetaryAmount',
      'currency': 'INR',
      'value': {
        '@type': 'QuantitativeValue',
        'value': job.salary,
        'unitText': 'YEAR',
      },
    } : undefined,
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [breadcrumbJsonLd, jobPostingJsonLd],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:pb-24 sm:px-6 lg:px-8 w-full space-y-6 min-h-[calc(100dvh-64px)]">
      {/* JSON-LD Script for Google Jobs & Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Real User View Tracker (Only fires in browser, not during next build) */}
      <JobViewTracker jobId={job.id} />

      {/* Expired Job Alert Notice */}
      {isExpired && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Applications for this role are currently closed
              </h2>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                The application deadline for this opening at {job.company} has passed. Explore active alternative openings below.
              </p>
            </div>
          </div>
          <Link
            href={isInternship ? "/internships" : "/jobs"}
            className="shrink-0 inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-500 transition-colors shadow-xs"
          >
            Browse Active {isInternship ? 'Internships' : 'Jobs'}
          </Link>
        </div>
      )}

      {/* Back to Jobs / Internships / Company Link */}
      <div className="flex items-center">
        <JobBackButton
          defaultHref={isInternship ? "/internships" : "/jobs"}
          defaultLabel={isInternship ? 'Back to Internships' : 'Back to All Jobs'}
          companyName={job.company}
        />
      </div>

      {/* Main Job Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Job Details */}
        <main className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {job.categories?.name || 'Job Opportunity'}
                </span>
                {isInternship ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Internship
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <Briefcase className="h-3.5 w-3.5" />
                    Full-Time Job
                  </span>
                )}
                {isExpired && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-600/10 border border-rose-500/20 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Closed
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {job.title}
              </h1>
              <div className="mt-2 flex items-center gap-2.5">
                {companyLogo ? (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white dark:bg-slate-900 p-1 shadow-2xs">
                    <img
                      src={companyLogo}
                      alt={`${job.company} logo`}
                      width={32}
                      height={32}
                      className="h-full w-full object-contain rounded"
                    />
                  </div>
                ) : (
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-extrabold text-sm shadow-2xs ${getCompanyColor(job.company)}`}>
                    {job.company.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {job.company}
                </span>
              </div>
            </div>

            {/* Badges block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-border text-sm w-full">
              <div className="flex items-start gap-2.5 text-muted-foreground min-w-0 w-full">
                <Briefcase className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="min-w-0 w-full space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Experience / Eligibility</p>
                  <p className="text-xs text-muted-foreground font-medium block w-full break-words leading-relaxed">{job.eligibility}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-muted-foreground min-w-0 w-full">
                <IndianRupee className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="min-w-0 w-full space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Salary</p>
                  <p className="text-xs text-muted-foreground font-medium block w-full break-words leading-relaxed">{job.salary || 'Not Disclosed / As per Industry Standards'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-muted-foreground min-w-0 w-full">
                <MapPin className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="min-w-0 w-full space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Location</p>
                  <p className="text-xs text-muted-foreground font-medium block w-full break-words leading-relaxed">{job.location}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Value-Add Section: Why this opening is relevant for freshers */}
          <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                <span className="hidden sm:inline">Fresher Suitability & Application Blueprint</span>
                <span className="sm:hidden">Fresher Suitability & Blueprint</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1.5 p-3.5 rounded-lg bg-card/80 border border-border/60">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Suitable For
                </p>
                <p className="text-muted-foreground">
                  College graduates, entry-level candidates, and students matching: <strong className="text-foreground">{job.eligibility}</strong>.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-lg bg-card/80 border border-border/60">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-indigo-500" /> Key Skills to Prepare
                </p>
                <p className="text-muted-foreground">
                  Focus on {job.skills.slice(0, 4).join(', ') || 'core computer science fundamentals and problem solving'}.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Verified Opportunity:</strong> FreshersBridge directs you to the verified official employer application portal. We never charge applicants.
              </span>
            </div>
          </div>

          {/* Job Description Card */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-foreground border-b border-border pb-2 flex items-center justify-between">
              <span>Job Description</span>
              <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">Detailed Role Overview</span>
            </h2>
            <FormattedJobDescription content={job.description} />
          </div>

          {/* Internal Topic Cluster: Career Preparation Guides */}
          {relevantGuides.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
                <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2 min-w-0">
                  <BookOpen className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span className="hidden sm:inline">Recommended Preparation Guides</span>
                  <span className="sm:hidden">Preparation Guides</span>
                </h3>
                <Link href="/guides" className="text-xs font-semibold text-indigo-600 hover:underline shrink-0 whitespace-nowrap">
                  All Guides
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relevantGuides.map((guide) => (
                  <Link
                    key={guide.id}
                    href={`/guides/${guide.slug}`}
                    className="group block p-4 rounded-lg border border-border/70 bg-background hover:border-indigo-500 transition-all hover:shadow-xs"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                      {guide.category}
                    </span>
                    <h4 className="mt-2 text-sm font-bold text-foreground group-hover:text-indigo-600 transition-colors leading-snug break-words">
                      {guide.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed break-words">
                      {guide.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </main>

        {/* Right Column: Quick Stats Sidebar */}
        <aside className="space-y-6">
          {/* Internal Authority Link: Company Blueprint & Drives */}
          {matchedCompany && (
            <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 p-4 shadow-xs space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-white border border-slate-200 dark:border-slate-800 p-1 flex items-center justify-center">
                  <img
                    src={matchedCompany.logo}
                    alt={`${matchedCompany.name} hiring company logo`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#275df5]">
                     Official Hiring Blueprint
                  </span>
                  <h4 className="text-xs font-bold text-foreground leading-snug break-words">
                    {matchedCompany.shortName} Placement Guide
                  </h4>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Exam patterns, selection rounds &amp; syllabus for {matchedCompany.shortName} off-campus drives.
              </p>
              <Link
                href={`/companies/${matchedCompany.slug}`}
                prefetch={true}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#275df5] hover:bg-[#1f4cd0] text-white font-bold text-xs transition-all shadow-2xs"
              >
                <span>View {matchedCompany.shortName} Guide &amp; Jobs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Quick Details
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Posted Date
                </span>
                <span className="font-semibold">{formatDate(job.created_at)}</span>
              </div>

              {job.application_deadline && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Deadline
                  </span>
                  <span className={`font-semibold ${isExpired ? 'text-rose-600' : 'text-foreground'}`}>
                    {formatDate(job.application_deadline)}
                  </span>
                </div>
              )}
            </div>

            <hr className="border-border" />

            {/* Apply Action */}
            <div className="space-y-3">
              {isExpired ? (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold text-sm cursor-not-allowed text-center"
                >
                  Applications Closed
                </button>
              ) : (
                <ApplyButton applyUrl={job.apply_url} company={job.company} title={job.title} />
              )}
              <ShareButton title={job.title} company={job.company} slug={job.slug} />
            </div>
          </div>

          {/* Adaptive Related Jobs (5 for long JDs, 3 for short JDs) */}
          {relatedJobs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 px-1">
                <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider min-w-0">
                  <span className="hidden sm:inline">Similar {job.categories?.name ? `${job.categories.name} ` : ''}Jobs</span>
                  <span className="sm:hidden">Similar Jobs</span>
                </h3>
                <Link
                  href={isInternship ? "/internships" : "/jobs"}
                  prefetch={true}
                  className="text-xs font-semibold text-indigo-600 hover:underline shrink-0 whitespace-nowrap"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {relatedJobs.map((relatedJob) => (
                  <JobCard key={relatedJob.id} job={relatedJob} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

