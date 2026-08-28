import Link from 'next/link';
import { Metadata } from 'next';
import { BadgePercent, ArrowLeft, Mail, Info, HeartHandshake, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | FreshersBridge',
  description:
    'Affiliate Disclosure for FreshersBridge - Transparency regarding third-party affiliate partnerships, commissions, and content integrity.',
};

export default function AffiliateDisclosurePage() {
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

      {/* Header */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <BadgePercent className="h-3.5 w-3.5" /> Transparency & Trust
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Affiliate Disclosure
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Last Updated: February 2026
        </p>
      </div>

      {/* Main Content */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-8 text-sm text-muted-foreground leading-relaxed font-medium">
        
        <p className="text-base text-foreground font-semibold">
          At <strong className="text-indigo-600 dark:text-indigo-400">FreshersBridge</strong> (freshersbridge.in), transparency and trust are important to us.
        </p>

        <hr className="border-border" />

        {/* Affiliate Relationships */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Affiliate Relationships
          </h2>
          <p>
            Some of the links on our website are affiliate links. This means that if you click on certain links and take action (such as registering, applying, or signing up), we may earn a small commission.
          </p>
          <p className="font-semibold text-foreground text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-border">
            This commission comes at <span className="text-indigo-600 dark:text-indigo-400 font-bold">no additional cost to you</span>.
          </p>
        </section>

        <hr className="border-border" />

        {/* Why We Use Affiliate Links */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">Why We Use Affiliate Links</h2>
          <p>
            Affiliate commissions help us maintain and improve our website, cover hosting and server expenses, and continue providing free job updates, internship listings, hackathon alerts, and free course coupons to job seekers in India.
          </p>
        </section>

        <hr className="border-border" />

        {/* No Additional Cost to Users */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            No Additional Cost to Users
          </h2>
          <p>
            We do not charge users for accessing job listings or applying to opportunities shared on our platform. Affiliate partnerships do not increase the cost for users in any way.
          </p>
        </section>

        <hr className="border-border" />

        {/* Independent Content */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">Independent Content</h2>
          <p>
            Our job listings and shared opportunities are selected based on relevance and usefulness to freshers and college graduates. Affiliate relationships do not influence the integrity, quality, or choice of our content.
          </p>
        </section>

        <hr className="border-border" />

        {/* Third-Party Platforms */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Third-Party Platforms
          </h2>
          <p>
            When you click on an affiliate link, you will be redirected to a third-party website. We are not responsible for the content, privacy policies, or practices of these external websites.
          </p>
        </section>

        <hr className="border-border" />

        {/* Contact */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">Contact Us</h2>
          <p>
            If you have any questions regarding this Affiliate Disclosure, please contact us at:
          </p>
          <a
            href="mailto:freshersbridge@gmail.com"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            <Mail className="h-4 w-4" /> freshersbridge@gmail.com
          </a>
        </section>

      </div>
    </div>
  );
}
