import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GUIDE_ARTICLES, getGuideBySlug, getRelatedGuides } from '@/lib/guidesData';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import GuideContentRenderer from '@/components/GuideContentRenderer';
import TableOfContents from '@/components/TableOfContents';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return GUIDE_ARTICLES.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | FreshersBridge',
    };
  }

  const title = `${guide.title} | FreshersBridge`;
  const description = guide.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [guide.author.name],
      tags: guide.tags,
      url: `https://freshersbridge.in/guides/${guide.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function GuideArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedGuides = getRelatedGuides(guide.slug, guide.category, 3);

  // Structured JSON-LD for Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': guide.title,
    'description': guide.description,
    'image': 'https://freshersbridge.in/logo.png',
    'author': {
      '@type': 'Person',
      'name': guide.author.name,
      'jobTitle': guide.author.role,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'FreshersBridge',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://freshersbridge.in/logo.png',
      },
    },
    'datePublished': guide.publishedAt,
    'dateModified': guide.updatedAt,
    'mainEntityOfPage': `https://freshersbridge.in/guides/${guide.slug}`,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8">
      {/* JSON-LD Script for Google News & Search Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link href="/" prefetch={true} className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/guides" prefetch={true} className="hover:text-indigo-600 transition-colors">
          Career Guides
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground truncate max-w-[200px] sm:max-w-md">{guide.category}</span>
      </nav>

      {/* Main Grid: Article vs Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Article Content (8 cols) */}
        <main className="lg:col-span-8 space-y-8">
          
          {/* Article Header Card */}
          <div className="space-y-4 border-b border-border pb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
                {guide.category}
              </span>
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {guide.readTime}
              </span>
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Updated: {guide.updatedAt}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
              {guide.title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
              {guide.subtitle}
            </p>

            {/* Author Byline */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center text-white font-black text-xs shadow-xs tracking-wider">
                  FB
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{guide.author.name}</p>
                  <p className="text-xs text-muted-foreground">{guide.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShareButton
                  title={guide.title}
                  company="FreshersBridge Guides"
                  slug={`guides/${guide.slug}`}
                  type="guide"
                  label="Share Guide"
                />
              </div>
            </div>
          </div>

          {/* Table of Contents Component (Smooth Scroll without History Pollution) */}
          <TableOfContents items={guide.tableOfContents} />

          {/* Formatted Guide Article Body Content */}
          <article className="space-y-6 leading-relaxed">
            <GuideContentRenderer
              content={guide.content}
              tableOfContents={guide.tableOfContents}
            />
          </article>

          {/* Tags */}
          <div className="pt-6 border-t border-border flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-muted-foreground">Tags:</span>
            {guide.tags.map((tag) => (
              <span key={tag} className="rounded-lg bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground border border-border">
                #{tag}
              </span>
            ))}
          </div>

          {/* Editorial Trust Note */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-2 text-xs text-muted-foreground">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Editorial Integrity & Fact-Checking
            </p>
            <p>
              This guide is created for educational and off-campus placement guidance. Exam patterns, eligibility cutoffs, and package structures are verified against recent recruitment notification announcements. FreshersBridge does not charge candidates for study resources or job drives.
            </p>
          </div>
        </main>

        {/* Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          
          {/* Action Box: Free Career Tools */}
          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 via-card to-card p-6 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
              <Sparkles className="h-3 w-3" />
              100% Free Tools
            </div>
            <h3 className="text-base font-bold text-foreground">
              Prepare with Free Career Tools
            </h3>
            <p className="text-xs text-muted-foreground">
              Scan your resume against ATS filters or copy 12 ready-to-use HR email scripts.
            </p>
            <Link
              href="/career-tools"
              prefetch={true}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-500 transition-all"
            >
              <span>Explore Career Tools</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Active Job Openings CTA */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              🔥 Active Tech Job Drives
            </h3>
            <p className="text-xs text-muted-foreground">
              Explore 200+ verified off-campus drives posted in the last 1–3 days.
            </p>
            <div className="space-y-2">
              <Link
                href="/jobs"
                prefetch={true}
                className="flex items-center justify-between rounded-lg border border-border p-3 text-xs font-bold text-foreground hover:bg-secondary transition-all"
              >
                <span>Browse Full-Time Jobs</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/internships"
                prefetch={true}
                className="flex items-center justify-between rounded-lg border border-border p-3 text-xs font-bold text-foreground hover:bg-secondary transition-all"
              >
                <span>Browse Tech Internships</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>

          {/* Related Guides List */}
          {relatedGuides.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Related Career Guides
              </h3>
              <div className="space-y-3">
                {relatedGuides.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/guides/${rel.slug}`}
                    prefetch={true}
                    className="group block space-y-1 text-xs"
                  >
                    <span className="font-bold text-foreground group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {rel.title}
                    </span>
                    <span className="text-muted-foreground text-[10px] block">
                      {rel.readTime} · {rel.category}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
