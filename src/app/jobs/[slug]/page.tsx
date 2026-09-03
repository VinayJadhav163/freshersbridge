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
  ExternalLink
} from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import ApplyButton from '@/components/ApplyButton';
import JobCard from '@/components/JobCard';
import JobViewTracker from '@/components/JobViewTracker';
import { Job } from '@/types';
import { GUIDE_ARTICLES } from '@/lib/guidesData';
import { fetchWithCache } from '@/lib/dataCache';

interface Props {
  params: Promise<{ slug: string }>;
}

// 5 minutes background ISR revalidation
export const revalidate = 300;
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

// Fast cached related jobs query
const getRelatedJobs = cache(async (categoryId: string | null, currentJobId: string) => {
  return fetchWithCache(`related:${categoryId}:${currentJobId}`, async () => {
    try {
      let query = supabase
        .from('jobs')
        .select('id, title, slug, company, location, salary, eligibility, skills, created_at, category_id, featured_job, categories(id, name, slug)')
        .neq('id', currentJobId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data } = await query;
      return (data || []) as unknown as Job[];
    } catch {
      return [] as Job[];
    }
  }, 180);
});

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

  const titlePrefix = isExpired ? '[Closed] ' : '';
  const title = `${titlePrefix}${job.title} at ${job.company} | FreshersBridge`;
  const description = `Apply for ${job.title} vacancy at ${job.company} in ${job.location}. Eligibility: ${
    job.eligibility
  }. Required skills: ${job.skills.join(', ')}. Find more entry-level tech opportunities on FreshersBridge.in.`;
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

  const lines = healedLines;
  const sections: { title?: string; items: string[]; type: 'list' | 'paragraph' }[] = [];
  
  let currentTitle = '';
  let currentItems: string[] = [];
  let currentType: 'list' | 'paragraph' = 'paragraph';

  const isHeading = (line: string) => {
    const trimmed = line.trim();
    if (trimmed.length > 60) return false;
    return /^(?:(?:Key\s+|Primary\s+)?Responsibilities|(?:Required\s+|Preferred\s+)?Qualifications|(?:Required\s+|Key\s+|Technical\s+)?Skills(?:\s+Required)?|Requirements|Eligibility(?:\s*&.*)?|What\s+You(?:'ll|\s+Will)\s+Do|Role\s+(?:Overview|Description|Summary)|Must\s+Have|Key\s+(?:Objectives|Deliverables)|Success\s+Measures|Perks(?:\s*&.*)?|Benefits|What\s+We(?:'re|\s+Are)\s+Looking\s+For|About\s+(?:Us|the\s+Role|[A-Z][a-zA-Z0-9\s]+)|Your\s+Impact|Education|Experience)\s*:?$/i.test(trimmed);
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
          {sec.title && (
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
    /\b(intern|internship|interns|apprentice|fellowship)\b/i.test(job.title);

  // Expiration calculation
  const isExpired = job.application_deadline
    ? new Date(job.application_deadline).getTime() < Date.now()
    : false;

  // Compliant schema validThrough date (falls back to 60 days post-creation if no deadline)
  const validThroughDate = job.application_deadline
    ? new Date(job.application_deadline).toISOString()
    : new Date(new Date(job.created_at).getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();

  // 2. Fast parallel related jobs query
  const relatedJobs = await getRelatedJobs(job.category_id, job.id);

  // 3. Smart contextual guides matching for internal topic clusters
  const jobText = `${job.title} ${job.company} ${job.skills.join(' ')}`.toLowerCase();
  const relevantGuides = GUIDE_ARTICLES.filter((g) => {
    return (
      g.tags.some((tag) => jobText.includes(tag.toLowerCase())) ||
      g.title.toLowerCase().includes(job.company.toLowerCase()) ||
      g.tags.includes('Aptitude') ||
      g.tags.includes('Coding')
    );
  }).slice(0, 2);

  // 4. Prepare structured JSON-LD data for Google Jobs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': job.title,
    'description': job.description,
    'datePosted': job.created_at,
    'validThrough': validThroughDate,
    'employmentType': isInternship ? 'INTERN' : 'FULL_TIME',
    'hiringOrganization': {
      '@type': 'Organization',
      'name': job.company,
      'sameAs': job.source_url || undefined,
    },
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': job.location,
        'addressRegion': 'India',
        'addressCountry': 'IN',
      },
    },
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-6">
      {/* JSON-LD Script for Google Jobs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

      {/* Back to Jobs / Internships Link */}
      <div className="flex items-center">
        <Link
          href={isInternship ? "/internships" : "/jobs"}
          prefetch={true}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {isInternship ? 'Back to Internships' : 'Back to All Jobs'}
        </Link>
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
              <p className="mt-1.5 text-lg font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <Building2 className="h-5 w-5 inline" />
                {job.company}
              </p>
            </div>

            {/* Badges block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-border text-sm w-full overflow-hidden">
              <div className="flex items-start gap-2.5 text-muted-foreground min-w-0 w-full overflow-hidden">
                <Briefcase className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="min-w-0 w-full overflow-hidden space-y-0.5">
                  <p className="text-xs font-bold text-foreground truncate">Experience / Eligibility</p>
                  <p className="truncate text-xs text-muted-foreground font-medium block w-full" title={job.eligibility}>{job.eligibility}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-muted-foreground min-w-0 w-full overflow-hidden">
                <IndianRupee className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="min-w-0 w-full overflow-hidden space-y-0.5">
                  <p className="text-xs font-bold text-foreground truncate">Salary</p>
                  <p className="truncate text-xs text-muted-foreground font-medium block w-full" title={job.salary || 'Not Disclosed'}>{job.salary || 'Not Disclosed'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-muted-foreground min-w-0 w-full overflow-hidden">
                <MapPin className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="min-w-0 w-full overflow-hidden space-y-0.5">
                  <p className="text-xs font-bold text-foreground truncate">Location</p>
                  <p className="truncate text-xs text-muted-foreground font-medium block w-full" title={job.location}>{job.location}</p>
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
          <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-foreground">
                Fresher Suitability & Application Blueprint
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
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2 flex items-center justify-between">
              <span>Job Description</span>
              <span className="text-xs font-semibold text-muted-foreground">Detailed Role Overview</span>
            </h2>
            <FormattedJobDescription content={job.description} />
          </div>

          {/* Internal Topic Cluster: Career Preparation Guides */}
          {relevantGuides.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-600" /> Recommended Preparation Guides
                </h3>
                <Link href="/guides" className="text-xs font-semibold text-indigo-600 hover:underline">
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
                    <h4 className="mt-2 text-sm font-bold text-foreground group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {guide.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
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

          {/* 3 Related Jobs from Same Category */}
          {relatedJobs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Similar {job.categories?.name ? `${job.categories.name}` : ''} Jobs
                </h3>
                <Link href="/jobs" prefetch={true} className="text-xs font-semibold text-indigo-600 hover:underline">
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

