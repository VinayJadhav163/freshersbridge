import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  getCompanyBySlug, 
  getAllCompanySlugs,
  CompanyProfile
} from '@/lib/companiesData';
import { GUIDE_ARTICLES } from '@/lib/guidesData';
import JobCard from '@/components/JobCard';
import FAQAccordion from '@/components/FAQAccordion';
import { Job } from '@/types';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  GraduationCap, 
  ArrowLeft, 
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { fetchWithCache } from '@/lib/dataCache';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300; // 5 min ISR
export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllCompanySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const company = getCompanyBySlug(resolvedParams.slug);

  if (!company) {
    return {
      title: 'Company Not Found | FreshersBridge',
    };
  }

  const title = `${company.name} Jobs for Freshers 2026: Off-Campus Drives & Syllabus | FreshersBridge`;
  const description = `Explore latest ${company.shortName} fresher job drives, salary packages (${company.salaryRange}), eligibility criteria, and interview exam pattern for college graduates.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://freshersbridge.in/companies/${company.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://freshersbridge.in/companies/${company.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// Fetch active & recent jobs for this company
async function getCompanyJobs(company: CompanyProfile): Promise<Job[]> {
  return fetchWithCache(`company_jobs:${company.slug}`, async () => {
    try {
      const searchTerms = Array.from(
        new Set([company.shortName, company.name.split(' ')[0], company.slug])
      );
      const filters = searchTerms
        .map((t) => `company.ilike.%${t}%,title.ilike.%${t}%`)
        .join(',');

      const { data } = await supabase
        .from('jobs')
        .select('id, title, slug, company, location, salary, eligibility, skills, created_at, category_id, featured_job, categories(id, name, slug)')
        .or(filters)
        .order('created_at', { ascending: false })
        .limit(6);
      return (data || []) as unknown as Job[];
    } catch {
      return [] as Job[];
    }
  }, 180);
}

export default async function CompanyDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const company = getCompanyBySlug(resolvedParams.slug);

  if (!company) {
    notFound();
  }

  const jobs = await getCompanyJobs(company);
  const relatedGuide = company.relatedGuideSlug
    ? GUIDE_ARTICLES.find((g) => g.slug === company.relatedGuideSlug)
    : null;

  // Organization + Breadcrumb Schema for Google
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
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
            'name': 'Companies',
            'item': 'https://freshersbridge.in/companies',
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': company.name,
            'item': `https://freshersbridge.in/companies/${company.slug}`,
          },
        ],
      },
      {
        '@type': 'Organization',
        'name': company.name,
        'url': company.website,
        'sameAs': [company.careersUrl],
      },
      {
        '@type': 'FAQPage',
        'mainEntity': company.frequentlyAsked.map((faq) => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-10">
      {/* JSON-LD Script for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Back Navigation */}
      <div className="flex items-center">
        <Link
          href="/companies"
          prefetch={true}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Companies
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 md:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            {company.logo ? (
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white border border-slate-200 dark:border-slate-800 p-2 shadow-xs flex items-center justify-center shrink-0">
                <img
                  src={company.logo}
                  alt={`${company.name} Logo`}
                  className="h-full w-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-black text-2xl shrink-0">
                {company.shortName.charAt(0)}
              </div>
            )}
            <div className="space-y-1.5 min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> Top Fresher Recruiter
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight break-words">
                {company.name} Jobs for Freshers 2026
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">{company.category} • HQ: {company.headquarters}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto pt-1 sm:pt-0">
            <a
              href={company.careersUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-background text-xs font-bold text-foreground hover:bg-accent transition-colors shadow-2xs"
            >
              <span>Official Careers Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-border text-sm">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/60">
            <IndianRupee className="h-5 w-5 text-[#275df5] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Fresher Package Range</p>
              <p className="text-sm font-bold text-foreground">{company.salaryRange}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/60">
            <GraduationCap className="h-5 w-5 text-[#275df5] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Eligible Batches</p>
              <p className="text-sm font-bold text-foreground">{company.eligibleBatches.join(', ')} Passouts</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/60">
            <Briefcase className="h-5 w-5 text-[#275df5] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Degree Criteria</p>
              <p className="text-xs font-semibold text-foreground line-clamp-2">{company.eligibility.split('(')[0].trim()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Active Drives & Syllabus */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Job Openings Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#275df5] shrink-0" />
                <span>Latest {company.shortName} Off-Campus Drives & Jobs</span>
              </h2>
              <span className="text-xs font-semibold text-muted-foreground shrink-0 self-start sm:self-auto">
                {jobs.length} Opportunities Found
              </span>
            </div>

            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center space-y-3">
                <Building2 className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <h3 className="text-base font-bold text-foreground">No open drives at this moment</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  There are currently no active public drives listed for {company.shortName}. Sign up for alerts or explore preparation roadmaps below.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center rounded-lg bg-[#275df5] px-4 py-2 text-xs font-bold text-white hover:bg-[#1f4cd0] transition-colors"
                >
                  Browse Other Active Drives
                </Link>
              </div>
            )}
          </div>

          {/* Hiring Tracks & Packages Breakdown */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-foreground">
              {company.shortName} Fresher Hiring Cadres & Salary Breakdown
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {company.hiringTracks.map((track, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border/70 bg-background space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                      {track.title}
                    </h3>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {track.package}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {track.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Selection Process */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground">
              {company.shortName} Recruitment & Exam Pattern
            </h2>
            <ol className="space-y-3">
              {company.selectionProcess.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-foreground pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Frequently Asked Questions */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Frequently Asked Questions about {company.shortName} Hiring
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Common doubts, eligibility rules, and interview advice for freshers applying to {company.shortName}.
              </p>
            </div>
            
            <FAQAccordion items={company.frequentlyAsked} />
          </div>

        </div>

        {/* Right Sidebar: Guide Link & Company Overview */}
        <aside className="space-y-6">
          
          {/* Related Guide CTA Card */}
          {relatedGuide && (
            <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/80 to-indigo-100/30 dark:from-indigo-950/30 dark:to-background p-6 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 text-white px-3 py-1 text-[11px] font-bold">
                <BookOpen className="h-3.5 w-3.5" /> Featured Preparation Guide
              </div>
              <h3 className="text-base font-bold text-foreground">
                {relatedGuide.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {relatedGuide.description}
              </p>
              <Link
                href={`/guides/${relatedGuide.slug}`}
                prefetch={true}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all shadow-xs"
              >
                <span>Read Full Exam Blueprint</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* About Company Card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 text-xs sm:text-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              About {company.name}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {company.overview}
            </p>
            <div className="pt-3 border-t border-border/60 space-y-2 text-xs">
              <p><strong className="text-foreground">Official Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{company.website.replace('https://', '')}</a></p>
              <p><strong className="text-foreground">Eligibility Policy:</strong> {company.eligibility}</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
