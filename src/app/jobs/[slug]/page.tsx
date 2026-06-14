import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatDate, formatDeadline } from '@/lib/utils';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Eye, 
  GraduationCap, 
  ArrowLeft, 
  ExternalLink,
  Info,
  Clock
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0; // Disable cache for details page to track views accurately

// Generate dynamic SEO Metadata for each job posting
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: job } = await supabase
    .from('jobs')
    .select('*, categories(*)')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!job) {
    return {
      title: 'Job Not Found | FreshersBridge',
    };
  }

  const title = `${job.title} at ${job.company} | FreshersBridge`;
  const description = `Apply for ${job.title} vacancy at ${job.company} in ${job.location}. Eligibility: ${
    job.eligibility
  }. Required skills: ${job.skills.join(', ')}. Find more entry-level tech opportunities on FreshersBridge.in.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://freshersbridge.in/jobs/${job.slug}`,
    },
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  
  // 1. Fetch Job details
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*, categories(*)')
    .eq('slug', resolvedParams.slug)
    .single();

  if (error || !job) {
    notFound();
  }

  // 2. Increment view count (run on server side upon page hit)
  try {
    await supabase
      .from('jobs')
      .update({ views_count: (job.views_count || 0) + 1 })
      .eq('id', job.id);
  } catch (err) {
    console.error('Failed to increment job view:', err);
  }

  // 3. Prepare structured JSON-LD data for Google Jobs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': job.title,
    'description': job.description,
    'datePosted': job.created_at,
    'validThrough': job.application_deadline || undefined,
    'employmentType': 'FULL_TIME',
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

      {/* Back to Jobs Link */}
      <div className="flex items-center">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all jobs
        </Link>
      </div>

      {/* Main Job Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Job Details */}
        <main className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="inline-flex items-center rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {job.categories?.name || 'Job Opportunity'}
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {job.title}
              </h1>
              <p className="mt-1.5 text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {job.company}
              </p>
            </div>

            {/* Badges block */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-border text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Location</p>
                  <p className="truncate text-xs">{job.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4 text-indigo-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Eligibility</p>
                  <p className="truncate text-xs">{job.eligibility}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground col-span-2 sm:col-span-1">
                <DollarSign className="h-4 w-4 text-indigo-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Salary</p>
                  <p className="truncate text-xs">{job.salary || 'Not Disclosed'}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-lg bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground border border-border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Job Description Card */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">
              Job Description
            </h2>
            <div className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {job.description}
            </div>
          </div>
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

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Deadline
                </span>
                <span className="font-semibold text-rose-500">
                  {job.application_deadline ? formatDeadline(job.application_deadline) : 'Apply ASAP'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Eye className="h-4 w-4" /> Views
                </span>
                <span className="font-semibold">{job.views_count + 1} views</span>
              </div>

              {job.source_name && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Source</span>
                  {job.source_url ? (
                    <a
                      href={job.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      {job.source_name} <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="font-semibold">{job.source_name}</span>
                  )}
                </div>
              )}
            </div>

            <hr className="border-border" />

            {/* Apply Action */}
            <div className="space-y-3">
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-500 hover:shadow-indigo-600/10"
              >
                Apply Now <ExternalLink className="h-4 w-4" />
              </a>
              <p className="text-[11px] text-muted-foreground text-center flex items-center gap-1.5 justify-center">
                <Info className="h-3.5 w-3.5 shrink-0" />
                This will redirect you to the application portal.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
