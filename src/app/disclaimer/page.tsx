import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldAlert, ArrowLeft, Mail, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer | FreshersBridge',
  description:
    'Disclaimer for FreshersBridge - Read our informational disclosure, external links policy, job listing verification notice, and affiliate policy.',
};

export default function DisclaimerPage() {
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
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
          <ShieldAlert className="h-3.5 w-3.5" /> Legal Notice & Terms
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Disclaimer for FreshersBridge
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          If you require any more information or have any questions about this disclaimer, please contact us at{' '}
          <a href="mailto:freshersbridge@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
            freshersbridge@gmail.com
          </a>.
        </p>
      </div>

      {/* Main Sections */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-8 text-sm text-muted-foreground leading-relaxed font-medium">
        
        {/* General Disclaimer */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            General Information
          </h2>
          <p>
            The information provided on <strong className="text-foreground">FreshersBridge</strong> (freshersbridge.in) is published in good faith and for general informational purposes only. While we strive to keep the information accurate and up to date, we make no warranties or representations regarding the completeness, reliability, or accuracy of any job listing, internship, hackathon, coupon, or course information.
          </p>
          <p>
            Any action you take based on the information found on this website is strictly at your own risk. FreshersBridge will not be liable for any losses, damages, or inconveniences arising from the use of our website or reliance on any information provided.
          </p>
        </section>

        <hr className="border-border" />

        {/* Job Listings & External Opportunities */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Job Listings & External Opportunities
          </h2>
          <p>
            <strong className="text-foreground">FreshersBridge</strong> is an independent informational platform. We are not affiliated with, endorsed by, or officially connected to the companies whose job opportunities are shared on this website unless explicitly stated.
          </p>
          <p className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-800 dark:text-amber-300 font-semibold text-xs sm:text-sm">
            Users are strongly advised to verify job details, eligibility criteria, deadlines, and official announcements directly from the respective company’s official website before applying.
          </p>
        </section>

        <hr className="border-border" />

        {/* Affiliate Disclosure */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">Affiliate Disclosure</h2>
          <p>
            Some links on our website may be affiliate links. This means we may earn a small commission if you register, apply, or take action through those links. This comes at no additional cost to you. Our content and job listings are not influenced by affiliate partnerships, and we aim to provide genuine and valuable opportunities.
          </p>
        </section>

        <hr className="border-border" />

        {/* Free Course Coupons */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">Free Course Coupons</h2>
          <p>
            We may share free course coupons and promotional offers from third-party platforms. These coupons are subject to availability and may expire at any time without notice. We do not control or guarantee the validity, availability, or duration of such offers.
          </p>
        </section>

        <hr className="border-border" />

        {/* External Links */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">External Links</h2>
          <p>
            Our website contains links to external websites. While we strive to provide links to reputable sources, we have no control over the content, privacy policies, or practices of third-party websites. We are not responsible for any content, changes, or actions taken by those external sites.
          </p>
          <p>
            Once you leave our website, you are subject to the terms and privacy policies of the external site you visit. We encourage you to review their policies before sharing personal information or engaging in any transactions.
          </p>
        </section>

        <hr className="border-border" />

        {/* Consent & Updates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border space-y-1">
            <h3 className="font-bold text-foreground flex items-center gap-1.5 text-sm">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Consent
            </h3>
            <p className="text-xs text-muted-foreground">
              By using our website, you hereby consent to this disclaimer and agree to its terms.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border space-y-1">
            <h3 className="font-bold text-foreground flex items-center gap-1.5 text-sm">
              <FileText className="h-4 w-4 text-indigo-500" /> Updates
            </h3>
            <p className="text-xs text-muted-foreground">
              We reserve the right to update, amend, or modify this disclaimer at any time. Any changes will be clearly posted on this page.
            </p>
          </div>
        </div>

      </div>

      {/* Footer Contact Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground">Have Questions?</h3>
          <p className="text-xs text-muted-foreground">Contact our support team for clarification regarding our policies.</p>
        </div>
        <a
          href="mailto:freshersbridge@gmail.com"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all shrink-0"
        >
          <Mail className="h-4 w-4" /> freshersbridge@gmail.com
        </a>
      </div>
    </div>
  );
}
