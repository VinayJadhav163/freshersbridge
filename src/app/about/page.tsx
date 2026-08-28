import Link from 'next/link';
import { Metadata } from 'next';
import { Target, Eye, Sparkles, CheckCircle2, ShieldCheck, Mail, ArrowLeft, Briefcase, GraduationCap, Filter, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | FreshersBridge',
  description:
    'Learn about FreshersBridge - empowering freshers and college graduates with handpicked off-campus jobs, internships, free course coupons, and career resources.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 w-full space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" /> Welcome to FreshersBridge
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          About Us
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl font-medium">
          Welcome to <strong className="text-foreground">FreshersBridge</strong>, a career-focused platform dedicated to helping students, freshers, and recent college graduates discover the latest job opportunities, off-campus hiring drives, internships, hackathons, and free learning resources.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mission */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
            <Target className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Our Mission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Our mission is to simplify the job search process by bringing together entry-level opportunities from multiple trusted sources into one easy-to-use platform. We aim to save job seekers time and effort by eliminating the need to browse multiple company websites individually.
          </p>
        </div>

        {/* Vision */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
            <Eye className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Our Vision</h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            We envision a transparent and accessible job ecosystem where opportunities and talent connect seamlessly. Our goal is to create a reliable information platform that empowers students and graduates to make informed career decisions.
          </p>
        </div>
      </div>

      {/* What We Offer */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
        <h2 className="text-2xl font-black text-foreground tracking-tight">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm">
              <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Latest Job & Internship Listings
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We curate and share job openings, internships, and career opportunities across various domains including software development, cybersecurity, cloud, data analytics, and more. Our listings are sourced from company websites and trusted platforms.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm">
              <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Free Course Coupons
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We regularly share free course coupons and learning resources to help learners upskill at no cost. Please note that coupons are limited in availability and may expire at any time as controlled by the course provider.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm">
              <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Smart Filters & Categories
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Our platform allows users to filter opportunities by location, batch year, role, and category to make job searching faster and more efficient.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm">
              <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Career Resources
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We provide interview preparation resources, career guidance content, and useful insights to help job seekers prepare better and stay updated.
            </p>
          </div>
        </div>
      </div>

      {/* How We Operate & Transparency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-foreground">
            <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            How We Operate
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
            <strong className="text-foreground">FreshersBridge</strong> is an independent informational platform. We are not directly affiliated with the companies whose job listings appear on our website unless explicitly stated.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
            Some links on our website may be affiliate links. This means we may earn a small commission if users choose to apply or register through certain third-party platforms. This does not result in any additional cost to the user. Our goal is always to provide genuine and valuable opportunities.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-foreground">
            <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Transparency & Trust
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
            We do not charge job seekers for accessing job listings or applying to opportunities shared on our platform. Users are encouraged to verify details directly from official sources before applying.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
            We also offer an optional notification service where users can join our WhatsApp updates or check job alerts. You can choose to leave or unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* Join Our Community & Contact CTA */}
      <div className="rounded-2xl border-2 border-indigo-500/30 bg-card text-foreground p-6 sm:p-10 shadow-lg space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" /> Community & Support
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Join Our Community
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed max-w-3xl">
            Whether you&apos;re a student looking for internships, a fresher searching for your first job, or a graduate planning your next career move, <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">FreshersBridge</strong> is here to support your journey. Explore opportunities, stay updated, and take the next step toward your career goals with confidence.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-border">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 text-sm font-bold shadow-md transition-all"
          >
            <Briefcase className="h-4 w-4" /> Browse Job Drives
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white px-6 py-3 text-sm font-bold transition-all"
          >
            <Mail className="h-4 w-4" /> Contact Us
          </Link>
          <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold">
            Official Email: <a href="mailto:freshersbridge@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">freshersbridge@gmail.com</a>
          </span>
        </div>
      </div>
    </div>
  );
}
